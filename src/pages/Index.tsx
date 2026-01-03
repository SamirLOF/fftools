import { useMemo } from "react";
import { AlertCircle, RefreshCw, Globe, Clock } from "lucide-react";
import { motion } from "framer-motion";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import SectionTitle from "@/components/SectionTitle";
import AppSidebar from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEvents } from "@/hooks/useEvents";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { sortEvents, regions } from "@/services/eventApi";
import PageTransition from "@/components/PageTransition";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
      duration: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.15 } },
};

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useSelectedRegion("SG");
  const { data, isLoading, error, refetch, isFetching, dataUpdatedAt } = useEvents(selectedRegion);
  const selectedRegionData = regions.find((r) => r.code === selectedRegion);

  // Format the last updated time
  const lastUpdated = dataUpdatedAt ? new Date(dataUpdatedAt) : null;
  const timeAgo = lastUpdated ? getTimeAgo(lastUpdated) : null;

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
      <div className="min-h-screen bg-background flex">
        <AppSidebar />

        <main className="flex-1 lg:ml-64">
          <div className="container py-8 px-6 space-y-8">
            {/* Region Selector Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-foreground tracking-tight">Events</h1>
                {/* Last Updated + Refresh */}
                {timeAgo && !isLoading && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {timeAgo}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => refetch()}
                      disabled={isFetching}
                      className="h-7 w-7 rounded-lg"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
                    </Button>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                  <SelectTrigger className="w-[140px] sm:w-[170px] h-9 bg-card border-border/50 rounded-xl">
                    <Globe className="w-4 h-4 mr-2 text-primary" />
                    <SelectValue>
                      {selectedRegionData?.code || "Region"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-border/50">
                    {regions.map((region) => (
                      <SelectItem
                        key={region.code}
                        value={region.code}
                        className="rounded-lg"
                      >
                        <span className="font-medium">{region.code}</span>
                        <span className="text-muted-foreground ml-2">— {region.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Error State */}
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-12 gap-4 bg-card rounded-2xl border border-border/50 card-glow"
              >
                <div className="flex items-center gap-3 text-destructive">
                  <AlertCircle className="w-5 h-5" />
                  <p className="font-medium">Connection Failed</p>
                </div>
                <p className="text-muted-foreground text-center max-w-md text-sm">
                  {error.message}
                </p>
                <Button 
                  onClick={() => refetch()} 
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-xl"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry
                </Button>
              </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
              <section>
                <SectionTitle title="Loading Events..." />
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
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
                  <div className="flex items-center justify-between mb-4">
                    <SectionTitle title="Active Events" />
                    {isFetching && !isLoading && (
                      <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
                    )}
                  </div>
                  {sortedEvents.length > 0 ? (
                    <motion.div 
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {sortedEvents.map((event, index) => (
                        <motion.div key={`${event.Title}-${index}`} variants={itemVariants}>
                          <EventCard
                            title={event.Title}
                            image={event.Banner}
                            startDate={event.Start}
                            endDate={event.End}
                            details={event.Details}
                            link={event.link}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-12 bg-card rounded-2xl border border-border/50 card-glow">
                      <p className="text-muted-foreground">
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
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                      {sortedUpdates.map((update, index) => (
                        <motion.div key={`${update.Title}-${index}`} variants={itemVariants}>
                          <EventCard
                            title={update.Title}
                            image={update.Banner}
                            startDate={update.Start}
                            endDate={update.End}
                            details={update.Details}
                            link={update.link}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  </section>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

// Helper function to format time ago
function getTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default Index;
