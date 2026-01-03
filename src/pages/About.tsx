import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Calendar, Users, Globe, Zap, Shield, Heart } from "lucide-react";

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