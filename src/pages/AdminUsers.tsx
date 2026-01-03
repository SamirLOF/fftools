import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Users, 
  Search, 
  Crown, 
  Shield, 
  Loader2,
  Calendar,
  Edit2,
  X,
  Check,
  ArrowLeft
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { format, addDays } from "date-fns";
import VerifiedBadge from "@/components/VerifiedBadge";
import { useAuth } from "@/contexts/AuthContext";

interface UserProfile {
  id: string;
  user_id: string;
  username: string;
  is_premium: boolean;
  premium_expires_at: string | null;
  created_at: string;
  last_username_change: string;
}

const AdminUsers = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ username: "", premiumDays: 0 });

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    fetchUsers();
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } else {
      setUsers(data || []);
    }
    setIsLoading(false);
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (user: UserProfile) => {
    setEditingUser(user.user_id);
    setEditForm({
      username: user.username,
      premiumDays: 0,
    });
  };

  const handleUpdateUser = async (userId: string) => {
    const user = users.find(u => u.user_id === userId);
    if (!user) return;

    const updates: Partial<UserProfile> = {};

    // Update username if changed
    if (editForm.username !== user.username) {
      // Check if username is taken
      const { data: existing } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", editForm.username.toLowerCase())
        .neq("user_id", userId)
        .maybeSingle();

      if (existing) {
        toast.error("Username already taken");
        return;
      }

      updates.username = editForm.username.toLowerCase();
    }

    // Add premium days if specified
    if (editForm.premiumDays > 0) {
      const currentExpiry = user.premium_expires_at ? new Date(user.premium_expires_at) : new Date();
      const newExpiry = addDays(currentExpiry > new Date() ? currentExpiry : new Date(), editForm.premiumDays);
      updates.is_premium = true;
      updates.premium_expires_at = newExpiry.toISOString();
    }

    if (Object.keys(updates).length === 0) {
      setEditingUser(null);
      return;
    }

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", userId);

    if (error) {
      toast.error("Failed to update user");
      console.error(error);
    } else {
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchUsers();
    }
  };

  const togglePremium = async (userId: string, currentlyPremium: boolean) => {
    if (currentlyPremium) {
      // Remove premium
      const { error } = await supabase
        .from("profiles")
        .update({ is_premium: false, premium_expires_at: null })
        .eq("user_id", userId);

      if (error) {
        toast.error("Failed to remove premium");
      } else {
        toast.success("Premium removed");
        fetchUsers();
      }
    } else {
      // Add 30 days premium
      const newExpiry = addDays(new Date(), 30);
      const { error } = await supabase
        .from("profiles")
        .update({ is_premium: true, premium_expires_at: newExpiry.toISOString() })
        .eq("user_id", userId);

      if (error) {
        toast.error("Failed to add premium");
      } else {
        toast.success("Premium added for 30 days");
        fetchUsers();
      }
    }
  };

  const makeAdmin = async (userId: string) => {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: userId, role: "admin" });

    if (error) {
      toast.error("Failed to make admin");
      console.error(error);
    } else {
      toast.success("User is now an admin!");
    }
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-8 px-6 max-w-5xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/admin")}
                className="rounded-xl"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="p-3 rounded-2xl bg-primary/10">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Manage Users</h1>
                <p className="text-muted-foreground">{users.length} total users</p>
              </div>
            </motion.div>

            {/* Search */}
            <Card className="border-border/50 bg-card mb-6">
              <CardContent className="pt-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by username..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 rounded-xl"
                    />
                  </div>
                  <Button variant="outline" onClick={fetchUsers} className="rounded-xl gap-2">
                    <Loader2 className="w-4 h-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Users List */}
            <Card className="border-border/50 bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  All Users ({filteredUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {filteredUsers.map((user) => {
                      const isPremium = user.is_premium && 
                        (!user.premium_expires_at || new Date(user.premium_expires_at) > new Date());

                      return (
                        <motion.div
                          key={user.user_id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className={`p-4 rounded-xl border ${
                            isPremium 
                              ? "bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/30" 
                              : "bg-secondary/30 border-border/30"
                          }`}
                        >
                          {editingUser === user.user_id ? (
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                                  isPremium ? "bg-primary/30 text-primary" : "bg-secondary text-muted-foreground"
                                }`}>
                                  {user.username.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 space-y-2">
                                  <Input
                                    value={editForm.username}
                                    onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                                    placeholder="Username"
                                    className="rounded-lg"
                                  />
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm text-muted-foreground">Add Premium Days:</span>
                                    <Input
                                      type="number"
                                      value={editForm.premiumDays}
                                      onChange={(e) => setEditForm({ ...editForm, premiumDays: parseInt(e.target.value) || 0 })}
                                      className="w-20 rounded-lg"
                                      min="0"
                                    />
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => handleUpdateUser(user.user_id)}
                                    className="text-success hover:text-success hover:bg-success/20"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => setEditingUser(null)}
                                    className="text-destructive hover:text-destructive hover:bg-destructive/20"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                                isPremium ? "bg-primary/30 text-primary" : "bg-secondary text-muted-foreground"
                              }`}>
                                {user.username.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-semibold text-foreground">{user.username}</span>
                                  {isPremium && <VerifiedBadge size="sm" />}
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="w-3 h-3" />
                                    Joined {format(new Date(user.created_at), "MMM d, yyyy")}
                                  </span>
                                  {isPremium && user.premium_expires_at && (
                                    <span className="flex items-center gap-1 text-primary">
                                      <Crown className="w-3 h-3" />
                                      Expires {format(new Date(user.premium_expires_at), "MMM d, yyyy")}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditing(user)}
                                  className="gap-1 rounded-lg"
                                >
                                  <Edit2 className="w-3 h-3" />
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant={isPremium ? "secondary" : "default"}
                                  onClick={() => togglePremium(user.user_id, isPremium)}
                                  className="gap-1 rounded-lg"
                                >
                                  <Crown className="w-3 h-3" />
                                  {isPremium ? "Remove" : "Add"} Premium
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => makeAdmin(user.user_id)}
                                  className="gap-1 rounded-lg"
                                >
                                  <Shield className="w-3 h-3" />
                                  Make Admin
                                </Button>
                              </div>
                            </div>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default AdminUsers;
