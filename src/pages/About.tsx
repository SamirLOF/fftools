import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Globe, Zap, Shield, Heart, Send } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const features = [
  {
    icon: Calendar,
    title: "Real-time Events",
    description: "Track all Free Fire events across multiple regions with live updates.",
  },
  {
    icon: Globe,
    title: "Multi-Region Support",
    description: "Coverage for 13+ regions including SG, India, Brazil, Europe, and more.",
  },
  {
    icon: Zap,
    title: "Fast & Reliable",
    description: "Lightning-fast API integration with smart caching for instant access.",
  },
  {
    icon: Shield,
    title: "Always Accurate",
    description: "Data sourced directly from official APIs ensuring accuracy.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "Built by players, for players. We understand what you need.",
  },
  {
    icon: Heart,
    title: "Free Forever",
    description: "Core features will always remain free for the community.",
  },
];

const About = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitRequest = async () => {
    if (!user) {
      toast.error("Please sign in first");
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      // Find samir1's user_id
      const { data: adminProfile, error: profileError } = await supabase
        .from("profiles")
        .select("user_id")
        .ilike("username", "samir1")
        .maybeSingle();

      if (profileError || !adminProfile) {
        toast.error("Admin user not found");
        setIsSubmitting(false);
        return;
      }

      // Check if already friends or request sent
      const { data: existingRequest } = await supabase
        .from("friend_requests")
        .select("id, status")
        .or(
          `and(from_user_id.eq.${user.id},to_user_id.eq.${adminProfile.user_id}),and(from_user_id.eq.${adminProfile.user_id},to_user_id.eq.${user.id})`,
        )
        .limit(1)
        .maybeSingle();

      if (existingRequest) {
        toast.info("Request already sent or you're already friends!");
        navigate("/chat");
        setIsSubmitting(false);
        return;
      }

      // Send friend request
      const { error: requestError } = await supabase
        .from("friend_requests")
        .insert({
          from_user_id: user.id,
          to_user_id: adminProfile.user_id,
        });

      if (requestError) {
        toast.error("Failed to send request");
      } else {
        toast.success("Friend request sent to Samir1!");
        navigate("/chat");
      }
    } catch {
      toast.error("Something went wrong");
    }
    setIsSubmitting(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex">
        <AppSidebar />
        
        <main className="flex-1 lg:ml-64">
          <div className="container py-12 px-6 max-w-4xl">
            {/* Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                About <span className="text-primary">FF Events</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Your ultimate companion for tracking Free Fire events, updates, and announcements across all regions.
              </p>
            </motion.div>

            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border/50 p-8 mb-12 card-glow"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe every Free Fire player deserves easy access to event information. 
                Our platform aggregates event data from multiple regions, presenting it in a clean, 
                user-friendly interface. No more missing out on limited-time events or exclusive rewards.
              </p>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-6 text-center">Why Choose Us</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="bg-card rounded-xl border border-border/50 p-5 hover:border-primary/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-primary/10 w-fit mb-3">
                      <feature.icon className="w-5 h-5 text-primary" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1.5">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Submit Request */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-card rounded-2xl border border-border/50 p-8 mb-12 card-glow text-center"
            >
              <h2 className="text-xl font-semibold text-foreground mb-3">Need Help?</h2>
              <p className="text-muted-foreground mb-6">
                Have questions or suggestions? Send a request to connect with our admin team.
              </p>
              <Button
                onClick={handleSubmitRequest}
                disabled={isSubmitting}
                className="gap-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? "Sending..." : "Submit Request"}
              </Button>
            </motion.div>

            {/* Credits */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-center mt-16 pt-8 border-t border-border/50"
            >
              <p className="text-sm text-muted-foreground">
                Developed with ❤️ by <span className="text-primary font-medium">LEAKS OF FF</span>
              </p>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default About;