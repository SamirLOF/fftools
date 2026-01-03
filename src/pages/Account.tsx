import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Crown, Gift, Settings, LogOut, Edit2, Check, X, Clock, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays, addDays } from "date-fns";
import confetti from "canvas-confetti";

const Account = () => {
  const { profile, isPremium, signOut, refreshProfile, user } = useAuth();
  const navigate = useNavigate();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(profile?.username || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [isRedeemingPromo, setIsRedeemingPromo] = useState(false);

  const canChangeUsername = () => {
    if (isPremium) return true;
    if (!profile?.last_username_change) return true;
    
    const lastChange = new Date(profile.last_username_change);
    const daysSinceChange = differenceInDays(new Date(), lastChange);
    return daysSinceChange >= 7;
  };

  const daysUntilUsernameChange = () => {
    if (!profile?.last_username_change) return 0;
    const lastChange = new Date(profile.last_username_change);
    const nextChange = addDays(lastChange, 7);
    return Math.max(0, differenceInDays(nextChange, new Date()));
  };

  const handleUpdateUsername = async () => {
    if (!newUsername.trim() || newUsername.length < 6) {
      toast.error("Username must be at least 6 characters");
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(newUsername)) {
      toast.error("Username can only contain letters, numbers, and underscores");
      return;
    }

    setIsUpdating(true);

    try {
      // Check if username is taken
      const { data: existing } = await supabase
        .from("profiles")
        .select("username")
        .eq("username", newUsername.toLowerCase())
        .neq("user_id", profile?.user_id)
        .maybeSingle();

      if (existing) {
        toast.error("Username already taken");
        setIsUpdating(false);
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({ 
          username: newUsername.toLowerCase(),
          last_username_change: new Date().toISOString()
        })
        .eq("user_id", profile?.user_id);

      if (error) {
        toast.error("Failed to update username");
        console.error(error);
      } else {
        toast.success("Username updated successfully!");
        setIsEditingUsername(false);
        await refreshProfile();
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRedeemPromo = async () => {
    const code = promoCode.trim().toUpperCase();
    
    if (!code) {
      toast.error("Please enter a promo code");
      return;
    }

    // Get current user from auth
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    
    if (!currentUser?.id) {
      toast.error("Please log in to redeem a promo code");
      return;
    }

    setIsRedeemingPromo(true);

    try {
      // Validate promo code and get days
      let premiumDays = 0;
      if (code === "LOF5K") {
        premiumDays = 3;
      } else {
        toast.error("Invalid promo code");
        setIsRedeemingPromo(false);
        return;
      }

      // Check if already redeemed
      const { data: existingRedemption, error: checkError } = await supabase
        .from("promo_redemptions")
        .select("id")
        .eq("user_id", currentUser.id)
        .eq("promo_code", code)
        .maybeSingle();

      if (checkError) {
        console.error("Check error:", checkError);
      }

      if (existingRedemption) {
        toast.error("You've already redeemed this promo code");
        setIsRedeemingPromo(false);
        return;
      }

      // Calculate new expiry date
      const currentExpiry = profile?.premium_expires_at ? new Date(profile.premium_expires_at) : new Date();
      const newExpiry = addDays(currentExpiry > new Date() ? currentExpiry : new Date(), premiumDays);

      // Update profile to premium first
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ 
          is_premium: true,
          premium_expires_at: newExpiry.toISOString()
        })
        .eq("user_id", currentUser.id);

      if (updateError) {
        console.error("Profile update error:", updateError);
        toast.error("Failed to activate premium: " + updateError.message);
        setIsRedeemingPromo(false);
        return;
      }

      // Add promo redemption record
      const { error: redemptionError } = await supabase
        .from("promo_redemptions")
        .insert({ user_id: currentUser.id, promo_code: code });

      if (redemptionError) {
        console.error("Redemption record error:", redemptionError);
        // Don't fail - premium is already activated
      }

      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b']
      });

      toast.success(`🎉 Premium activated for ${premiumDays} days!`, {
        description: "Enjoy all premium features!",
        duration: 5000,
      });

      setPromoCode("");
      await refreshProfile();
    } catch (error) {
      console.error("Promo error:", error);
      toast.error("Failed to redeem promo code");
    } finally {
      setIsRedeemingPromo(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-8 px-6 max-w-4xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-foreground">Account</h1>
              <p className="text-muted-foreground">Manage your profile and settings</p>
            </div>

            <Tabs defaultValue="profile" className="space-y-6">
              <TabsList className="bg-card border border-border/50 p-1 rounded-xl">
                <TabsTrigger value="profile" className="rounded-lg gap-2">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="premium" className="rounded-lg gap-2">
                  <Crown className="w-4 h-4" />
                  Premium
                </TabsTrigger>
                <TabsTrigger value="settings" className="rounded-lg gap-2">
                  <Settings className="w-4 h-4" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                {/* Profile Card */}
                <Card className="border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-primary" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Your public profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Avatar & Username */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold ${
                          isPremium 
                            ? "bg-gradient-to-br from-primary/30 to-purple-500/30 text-primary" 
                            : "bg-secondary text-muted-foreground"
                        }`}>
                          {profile?.username?.charAt(0).toUpperCase()}
                        </div>
                        {isPremium && (
                          <div className="absolute -bottom-1 -right-1">
                            <VerifiedBadge size="lg" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          {isEditingUsername ? (
                            <div className="flex items-center gap-2">
                              <Input
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="h-9 w-48"
                                placeholder="New username"
                              />
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={handleUpdateUsername}
                                disabled={isUpdating}
                              >
                                {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4 text-success" />}
                              </Button>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-9 w-9"
                                onClick={() => {
                                  setIsEditingUsername(false);
                                  setNewUsername(profile?.username || "");
                                }}
                              >
                                <X className="w-4 h-4 text-destructive" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <h2 className="text-xl font-semibold">{profile?.username}</h2>
                              {isPremium && <VerifiedBadge />}
                              {canChangeUsername() ? (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => setIsEditingUsername(true)}
                                >
                                  <Edit2 className="w-4 h-4" />
                                </Button>
                              ) : (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {daysUntilUsernameChange()}d until change
                                </span>
                              )}
                            </>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Member since {profile?.created_at && format(new Date(profile.created_at), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {!isPremium && !canChangeUsername() && (
                      <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                        <p className="text-sm text-primary">
                          <Crown className="w-4 h-4 inline mr-2" />
                          Upgrade to Premium for unlimited username changes!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="premium" className="space-y-6">
                {/* Premium Status */}
                <Card className={`border-border/50 ${isPremium ? "bg-gradient-to-br from-primary/10 via-card to-purple-500/10" : "bg-card"}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Crown className={`w-5 h-5 ${isPremium ? "text-primary" : "text-muted-foreground"}`} />
                      Premium Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isPremium ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <Sparkles className="w-6 h-6 text-primary" />
                          <div>
                            <p className="font-semibold text-foreground">Premium Active</p>
                            {profile?.premium_expires_at && (
                              <p className="text-sm text-muted-foreground">
                                Expires on {format(new Date(profile.premium_expires_at), "MMMM d, yyyy")}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="grid gap-2 text-sm">
                          <div className="flex items-center gap-2 text-foreground">
                            <Check className="w-4 h-4 text-success" /> Verified Badge
                          </div>
                          <div className="flex items-center gap-2 text-foreground">
                            <Check className="w-4 h-4 text-success" /> Unlimited username changes
                          </div>
                          <div className="flex items-center gap-2 text-foreground">
                            <Check className="w-4 h-4 text-success" /> Copy event links
                          </div>
                          <div className="flex items-center gap-2 text-foreground">
                            <Check className="w-4 h-4 text-success" /> Priority support
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <p className="text-muted-foreground">
                          Upgrade to Premium to unlock exclusive features!
                        </p>
                        <Button onClick={() => navigate("/pricing")} className="gap-2">
                          <Crown className="w-4 h-4" />
                          View Plans
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Promo Code */}
                <Card className="border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Gift className="w-5 h-5 text-primary" />
                      Redeem Promo Code
                    </CardTitle>
                    <CardDescription>
                      Have a promo code? Enter it below to activate rewards
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-3">
                      <Input
                        placeholder="Enter promo code"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        className="flex-1 uppercase"
                      />
                      <Button 
                        onClick={handleRedeemPromo} 
                        disabled={isRedeemingPromo}
                        className="gap-2"
                      >
                        {isRedeemingPromo ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Gift className="w-4 h-4" />
                        )}
                        Redeem
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <Card className="border-border/50 bg-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="w-5 h-5 text-primary" />
                      Account Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      variant="destructive" 
                      onClick={handleSignOut}
                      className="gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Account;
