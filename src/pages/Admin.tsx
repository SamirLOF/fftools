import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { 
  Shield, 
  Plus, 
  Trash2, 
  Users, 
  Calendar,
  Settings,
  AlertTriangle,
  Loader2,
  X,
  Wrench,
  Clock
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMaintenance } from "@/hooks/useMaintenance";

interface CustomEvent {
  id: string;
  title: string;
  banner: string;
  start_date: string;
  end_date: string;
  details: string | null;
  link: string | null;
  event_type: string;
  region: string;
  created_at: string;
  created_by: string;
}

interface AdminUser {
  id: string;
  username: string;
  created_at: string;
}

const Admin = () => {
  const { isAdmin, isLoading, profile } = useAuth();
  const username = profile?.username;
  const navigate = useNavigate();
  const { maintenance, updateMaintenance } = useMaintenance();
  
  const [events, setEvents] = useState<CustomEvent[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [activeTab, setActiveTab] = useState<"events" | "admins" | "settings">("events");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [maintenanceMessage, setMaintenanceMessage] = useState("");
  const [maintenanceEndTime, setMaintenanceEndTime] = useState("");
  const [isUpdatingMaintenance, setIsUpdatingMaintenance] = useState(false);
  
  // Event form
  const [eventForm, setEventForm] = useState({
    title: "",
    banner: "",
    start_date: "",
    end_date: "",
    details: "",
    link: "",
    event_type: "event",
    region: "IND",
  });
  
  // Admin form
  const [newAdmin, setNewAdmin] = useState("");

  // Sync maintenance state
  useEffect(() => {
    setMaintenanceMessage(maintenance.message || "Site is under maintenance");
    setMaintenanceEndTime(maintenance.end_time || "");
  }, [maintenance]);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate("/auth");
    }
  }, [isLoading, isAdmin, navigate]);

  useEffect(() => {
    if (isAdmin) {
      fetchEvents();
      fetchAdmins();
    }
  }, [isAdmin]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("custom_events")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data || []);
    }
  };

  const fetchAdmins = async () => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching admins:", error);
    } else {
      setAdmins(data || []);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventForm.title || !eventForm.banner || !eventForm.start_date || !eventForm.end_date) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await supabase.from("custom_events").insert({
      ...eventForm,
      created_by: username || "admin",
    });
    
    if (error) {
      console.error("Error adding event:", error);
      toast.error("Failed to add event");
    } else {
      toast.success("Event added successfully!");
      setEventForm({
        title: "",
        banner: "",
        start_date: "",
        end_date: "",
        details: "",
        link: "",
        event_type: "event",
        region: "IND",
      });
      fetchEvents();
    }
    
    setIsSubmitting(false);
  };

  const handleDeleteEvent = async (id: string) => {
    const { error } = await supabase.from("custom_events").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to delete event");
    } else {
      toast.success("Event deleted");
      fetchEvents();
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newAdmin.trim()) {
      toast.error("Please enter a username");
      return;
    }
    
    setIsSubmitting(true);
    
    const { error } = await supabase.from("admin_users").insert({
      username: newAdmin.trim(),
    });
    
    if (error) {
      if (error.code === "23505") {
        toast.error("This username is already an admin");
      } else {
        toast.error("Failed to add admin");
      }
    } else {
      toast.success("Admin added successfully!");
      setNewAdmin("");
      fetchAdmins();
    }
    
    setIsSubmitting(false);
  };

  const handleRemoveAdmin = async (id: string, adminUsername: string) => {
    if (adminUsername === username) {
      toast.error("You cannot remove yourself as admin");
      return;
    }
    
    const { error } = await supabase.from("admin_users").delete().eq("id", id);
    
    if (error) {
      toast.error("Failed to remove admin");
    } else {
      toast.success("Admin removed");
      fetchAdmins();
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

  if (!isAdmin) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
          <div className="text-center">
            <AlertTriangle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
            <p className="text-muted-foreground mb-4">You don't have admin privileges.</p>
            <Button onClick={() => navigate("/auth")}>Go to Login</Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-12 px-6 max-w-4xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-4 mb-8"
            >
              <div className="p-3 rounded-2xl bg-primary/10">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
                <p className="text-muted-foreground">Logged in as: {username}</p>
              </div>
            </motion.div>

            {/* Tabs */}
            <div className="flex gap-2 mb-8 flex-wrap">
              <Button
                variant={activeTab === "events" ? "default" : "secondary"}
                onClick={() => setActiveTab("events")}
                className="rounded-xl gap-2"
              >
                <Calendar className="w-4 h-4" />
                Events
              </Button>
              <Button
                variant={activeTab === "admins" ? "default" : "secondary"}
                onClick={() => setActiveTab("admins")}
                className="rounded-xl gap-2"
              >
                <Users className="w-4 h-4" />
                Admins
              </Button>
              <Button
                variant={activeTab === "settings" ? "default" : "secondary"}
                onClick={() => setActiveTab("settings")}
                className="rounded-xl gap-2"
              >
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </div>

            {activeTab === "events" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Add Event Form */}
                <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Event
                  </h2>
                  
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Title *</Label>
                        <Input
                          value={eventForm.title}
                          onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                          placeholder="Event title"
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Banner URL *</Label>
                        <Input
                          value={eventForm.banner}
                          onChange={(e) => setEventForm({ ...eventForm, banner: e.target.value })}
                          placeholder="https://..."
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Start Date *</Label>
                        <Input
                          type="date"
                          value={eventForm.start_date}
                          onChange={(e) => setEventForm({ ...eventForm, start_date: e.target.value })}
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>End Date *</Label>
                        <Input
                          type="date"
                          value={eventForm.end_date}
                          onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Region</Label>
                        <Input
                          value={eventForm.region}
                          onChange={(e) => setEventForm({ ...eventForm, region: e.target.value })}
                          placeholder="IND"
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Event Type</Label>
                        <Input
                          value={eventForm.event_type}
                          onChange={(e) => setEventForm({ ...eventForm, event_type: e.target.value })}
                          placeholder="event"
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Link (optional)</Label>
                      <Input
                        value={eventForm.link}
                        onChange={(e) => setEventForm({ ...eventForm, link: e.target.value })}
                        placeholder="https://..."
                        className="rounded-xl bg-secondary/50"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Details (optional)</Label>
                      <Textarea
                        value={eventForm.details}
                        onChange={(e) => setEventForm({ ...eventForm, details: e.target.value })}
                        placeholder="Event details..."
                        className="rounded-xl bg-secondary/50 min-h-[100px]"
                      />
                    </div>
                    <Button type="submit" disabled={isSubmitting} className="rounded-xl">
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4 mr-2" />
                          Add Event
                        </>
                      )}
                    </Button>
                  </form>
                </div>

                {/* Events List */}
                <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Custom Events ({events.length})
                  </h2>
                  
                  {events.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No custom events yet. Add one above!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {events.map((event) => (
                        <div
                          key={event.id}
                          className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30"
                        >
                          <img
                            src={event.banner}
                            alt={event.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-foreground truncate">{event.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {event.region} • {event.start_date} - {event.end_date}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "admins" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Add Admin Form */}
                <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Plus className="w-5 h-5 text-primary" />
                    Add New Admin
                  </h2>
                  
                  <form onSubmit={handleAddAdmin} className="flex gap-3">
                    <Input
                      value={newAdmin}
                      onChange={(e) => setNewAdmin(e.target.value)}
                      placeholder="Enter username"
                      className="flex-1 rounded-xl bg-secondary/50"
                    />
                    <Button type="submit" disabled={isSubmitting} className="rounded-xl">
                      {isSubmitting ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </Button>
                  </form>
                </div>

                {/* Admins List */}
                <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    Admin Users ({admins.length})
                  </h2>
                  
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div
                        key={admin.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30 border border-border/30"
                      >
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Users className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-foreground">{admin.username}</p>
                          <p className="text-xs text-muted-foreground">
                            Added: {new Date(admin.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        {admin.username !== username && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveAdmin(admin.id, admin.username)}
                            className="shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                {/* Maintenance Mode */}
                <div className={`bg-card rounded-2xl border p-6 card-glow ${maintenance.enabled ? "border-amber-500/50" : "border-border/50"}`}>
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Wrench className={`w-5 h-5 ${maintenance.enabled ? "text-amber-500" : "text-primary"}`} />
                    Maintenance Mode
                    {maintenance.enabled && (
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full">ACTIVE</span>
                    )}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <div>
                        <h3 className="font-medium text-foreground">Enable Maintenance Mode</h3>
                        <p className="text-sm text-muted-foreground">
                          Show a maintenance banner to all users
                        </p>
                      </div>
                      <Switch
                        checked={maintenance.enabled}
                        onCheckedChange={async (checked) => {
                          setIsUpdatingMaintenance(true);
                          const success = await updateMaintenance({ enabled: checked });
                          if (success) {
                            toast.success(checked ? "Maintenance mode enabled" : "Maintenance mode disabled");
                          } else {
                            toast.error("Failed to update maintenance mode");
                          }
                          setIsUpdatingMaintenance(false);
                        }}
                        disabled={isUpdatingMaintenance}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-500" />
                          Maintenance Message
                        </Label>
                        <Input
                          value={maintenanceMessage}
                          onChange={(e) => setMaintenanceMessage(e.target.value)}
                          placeholder="Site is under maintenance"
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-primary" />
                          End Time (optional - for countdown)
                        </Label>
                        <Input
                          type="datetime-local"
                          value={maintenanceEndTime}
                          onChange={(e) => setMaintenanceEndTime(e.target.value)}
                          className="rounded-xl bg-secondary/50"
                        />
                      </div>

                      <Button
                        onClick={async () => {
                          setIsUpdatingMaintenance(true);
                          const success = await updateMaintenance({
                            message: maintenanceMessage,
                            end_time: maintenanceEndTime || null
                          });
                          if (success) {
                            toast.success("Maintenance settings saved");
                          } else {
                            toast.error("Failed to save settings");
                          }
                          setIsUpdatingMaintenance(false);
                        }}
                        disabled={isUpdatingMaintenance}
                        className="rounded-xl gap-2"
                      >
                        {isUpdatingMaintenance ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Settings className="w-4 h-4" />
                        )}
                        Save Settings
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Settings Panel */}
                <div className="bg-card rounded-2xl border border-border/50 p-6 card-glow">
                  <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Site Settings
                  </h2>
                  
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <h3 className="font-medium text-foreground mb-2">Banner Download</h3>
                      <p className="text-sm text-muted-foreground">
                        Users can download banners with "LEAKS OF FF" watermark for free, or watch an ad to download without watermark.
                      </p>
                    </div>
                    
                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <h3 className="font-medium text-foreground mb-2">Admin Permissions</h3>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Add and delete custom events</li>
                        <li>• Manage admin users</li>
                        <li>• Access all site settings</li>
                        <li>• View event history</li>
                        <li>• Control maintenance mode</li>
                      </ul>
                    </div>

                    <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                      <h3 className="font-medium text-foreground mb-2">Quick Stats</h3>
                      <div className="grid grid-cols-2 gap-3 mt-3">
                        <div className="p-3 rounded-lg bg-primary/10 text-center">
                          <p className="text-2xl font-bold text-primary">{events.length}</p>
                          <p className="text-xs text-muted-foreground">Custom Events</p>
                        </div>
                        <div className="p-3 rounded-lg bg-primary/10 text-center">
                          <p className="text-2xl font-bold text-primary">{admins.length}</p>
                          <p className="text-xs text-muted-foreground">Admin Users</p>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                      <h3 className="font-medium text-destructive mb-2">Danger Zone</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        Be careful with these actions. They cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="rounded-xl"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete ALL custom events?")) {
                            supabase.from("custom_events").delete().neq("id", "").then(() => {
                              toast.success("All events deleted");
                              fetchEvents();
                            });
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete All Events
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Admin;
