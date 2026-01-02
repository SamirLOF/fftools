import { useMemo } from "react";
import { AlertCircle, RefreshCw, Archive } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { sortEvents } from "@/services/eventApi";
import PageTransition from "@/components/PageTransition";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useSelectedRegion("SG");
  const { data, isLoading, error, refetch, isFetching } = useEvents(selectedRegion);

  const sortedEvents = useMemo(() => {
    if (!data?.events) return [];
    return sortEvents(data.events);
  }, [data?.events]);

  const sortedUpdates = useMemo(() => {
    if (!data?.updates) return [];
    return sortEvents(data.updates);
  }, [data?.updates]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background hexagon-grid">
        <Header
          selectedRegion={selectedRegion}
          onRegionChange={setSelectedRegion}
        />

        <main className="container py-8 space-y-10">
          {/* Error State */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-12 gap-4 cursed-card rounded-xl"
            >
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="w-6 h-6" />
                <p className="text-xl font-display tracking-wide">CONNECTION FAILED</p>
              </div>
              <p className="text-muted-foreground text-center max-w-md font-semibold text-sm">
                {error.message}
              </p>
              <Button 
                onClick={() => refetch()} 
                variant="outline"
                size="sm"
                className="gap-2 font-bold border-primary/50 hover:bg-primary/20"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </motion.div>
          )}

          {/* Loading State */}
          {isLoading && (
            <section>
              <SectionTitle title="Events" />
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            </section>
          )}

          {/* Data Display */}
          {data && !error && (
            <>
              {/* Events Section */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <SectionTitle title="Active Events" />
                  {isFetching && !isLoading && (
                    <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                  )}
                </div>
                {sortedEvents.length > 0 ? (
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  >
                    {sortedEvents.map((event, index) => (
                      <motion.div key={`${event.Title}-${index}`} variants={itemVariants}>
                        <EventCard
                          title={event.Title}
                          image={event.Banner}
                          startDate={event.Start}
                          endDate={event.End}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="text-center py-12 cursed-card rounded-xl">
                    <p className="text-muted-foreground font-semibold">
                      No active events in this region.
                    </p>
                  </div>
                )}
              </section>

              {/* Announcements Section */}
              {sortedUpdates.length > 0 && (
                <section>
                  <SectionTitle title="Announcements" />
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  >
                    {sortedUpdates.map((update, index) => (
                      <motion.div key={`${update.Title}-${index}`} variants={itemVariants}>
                        <EventCard
                          title={update.Title}
                          image={update.Banner}
                          startDate={update.Start}
                          endDate={update.End}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </section>
              )}

              {/* Archive Link */}
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center py-8 cursed-card rounded-xl"
              >
                <Archive className="w-10 h-10 mx-auto mb-3 text-secondary" />
                <h3 className="text-xl font-display tracking-wider mb-2 purple-text">
                  EVENT ARCHIVE
                </h3>
                <p className="text-muted-foreground mb-4 font-semibold text-sm">
                  View expired events
                </p>
                <Link to="/history">
                  <Button className="gap-2 font-bold cursed-gradient hover:opacity-90 text-white">
                    <Archive className="w-4 h-4" />
                    View Archive
                  </Button>
                </Link>
              </motion.section>
            </>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-primary/20 py-6 mt-10">
          <div className="container text-center">
            <p className="text-xs text-muted-foreground font-semibold">
              © 2026 FF Events (JJK) — Credit{" "}
              <span className="cursed-text font-bold">LEAKS OF FF</span>
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default Index;
