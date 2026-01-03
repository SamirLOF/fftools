import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { 
  Copy, 
  Image, 
  Calendar, 
  Bell, 
  Share2, 
  Download,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

const tools = [
  {
    icon: Copy,
    title: "Banner Copier",
    description: "Copy event banner URLs with one click for sharing on social media or Discord.",
    action: "Available on Events",
    available: true,
  },
  {
    icon: Image,
    title: "Banner Downloader",
    description: "Download high-quality event banners directly to your device.",
    action: "Coming Soon",
    available: false,
  },
  {
    icon: Calendar,
    title: "Event Calendar",
    description: "Sync events to your Google Calendar or Apple Calendar automatically.",
    action: "Coming Soon",
    available: false,
  },
  {
    icon: Bell,
    title: "Event Alerts",
    description: "Get push notifications when new events are announced in your region.",
    action: "Coming Soon",
    available: false,
  },
  {
    icon: Share2,
    title: "Quick Share",
    description: "Generate shareable links for events to post on social media.",
    action: "Coming Soon",
    available: false,
  },
  {
    icon: Download,
    title: "Export Data",
    description: "Export event data in JSON or CSV format for analysis.",
    action: "Coming Soon",
    available: false,
  },
];

const comingSoonTools = [
  {
    title: "FF Wishlist Changer",
    description: "Change your Free Fire wishlist items easily with our tool.",
  },
  {
    title: "UID Lookup",
    description: "Search player information by UID across all servers.",
  },
  {
    title: "Diamond Calculator",
    description: "Calculate the best diamond top-up offers and discounts.",
  },
  {
    title: "Guild Finder",
    description: "Find and join active guilds in your region.",
  },
];

const Tools = () => {
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
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-bold text-foreground mb-4 tracking-tight">
                Explore <span className="text-primary">Tools</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                Powerful utilities to enhance your Free Fire event tracking experience.
              </p>
            </motion.div>

            {/* Tools Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
              {tools.map((tool, index) => (
                <motion.div
                  key={tool.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="bg-card rounded-xl border border-border/50 p-5 card-glow hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-xl bg-primary/10 shrink-0">
                      <tool.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {tool.description}
                      </p>
                      <Button
                        size="sm"
                        variant={tool.available ? "default" : "secondary"}
                        className="rounded-lg gap-1.5"
                        disabled={!tool.available}
                        onClick={() => {
                          if (tool.available) {
                            toast.info("Navigate to Events page to use this tool");
                          }
                        }}
                      >
                        {tool.available ? (
                          <>
                            <ExternalLink className="w-3.5 h-3.5" />
                            {tool.action}
                          </>
                        ) : (
                          tool.action
                        )}
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Coming Soon Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mt-10"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
                <h2 className="text-lg font-semibold text-foreground px-4">
                  🚀 More Tools Coming Soon
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {comingSoonTools.map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + 0.05 * index }}
                    className="bg-secondary/30 rounded-xl border border-dashed border-border/50 p-5 relative overflow-hidden"
                  >
                    <div className="absolute top-3 right-3 px-2 py-0.5 bg-primary/20 text-primary text-xs font-medium rounded-full">
                      Soon
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {tool.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Request Feature */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-10 text-center bg-card rounded-2xl border border-border/50 p-8 card-glow"
            >
              <h2 className="text-xl font-semibold text-foreground mb-2">
                Have a Feature Request?
              </h2>
              <p className="text-muted-foreground mb-4">
                We're always looking to improve. Let us know what tools you'd like to see!
              </p>
              <Button className="rounded-xl" onClick={() => toast.success("Feature request submitted!")}>
                Submit Request
              </Button>
            </motion.div>
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default Tools;