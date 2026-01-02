import { useMemo } from "react";
import { AlertCircle, RefreshCw, Archive, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { sortEvents } from "@/services/eventApi";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useSelectedRegion("SG");
  const { data, isLoading, error, refetch, isFetching } = useEvents(selectedRegion);

  // Sort events: upcoming first, then by newest start date
  const sortedEvents = useMemo(() => {
    if (!data?.events) return [];
    return sortEvents(data.events);
  }, [data?.events]);

  const sortedUpdates = useMemo(() => {
    if (!data?.updates) return [];
    return sortEvents(data.updates);
  }, [data?.updates]);

  return (
    <div className="min-h-screen bg-background bg-grid">
      <Header
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <main className="container py-10 space-y-16">
        {/* Hero Section */}
        <section className="text-center py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary tracking-wide">LIVE TRACKER</span>
          </div>
          <h1 className="text-5xl sm:text-7xl font-display tracking-wider mb-4">
            <span className="gold-text">DISCOVER</span>{" "}
            <span className="cyan-text">EVENTS</span>
          </h1>
          <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
            Stay updated with the latest Free Fire events, rewards, and announcements for your region.
          </p>
        </section>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-6">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-8 h-8" />
              <p className="text-2xl font-display tracking-wide">FAILED TO LOAD</p>
            </div>
            <p className="text-muted-foreground text-center max-w-md font-medium">
              {error.message}
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              className="gap-2 font-semibold"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <>
            <section>
              <SectionTitle title="Events" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <EventCardSkeleton key={i} />
                ))}
              </div>
            </section>
          </>
        )}

        {/* Data Display */}
        {data && !error && (
          <>
            {/* Events Section */}
            <section>
              <div className="flex items-center justify-between mb-8">
                <SectionTitle title="Events" />
                {isFetching && !isLoading && (
                  <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                )}
              </div>
              {sortedEvents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedEvents.map((event, index) => (
                    <EventCard
                      key={`${event.Title}-${index}`}
                      title={event.Title}
                      image={event.Banner}
                      startDate={event.Start}
                      endDate={event.End}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 glass-card rounded-xl">
                  <p className="text-muted-foreground font-medium text-lg">
                    No events available for this region.
                  </p>
                </div>
              )}
            </section>

            {/* Announcements/Updates Section */}
            {sortedUpdates.length > 0 && (
              <section>
                <SectionTitle title="Announcements" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {sortedUpdates.map((update, index) => (
                    <EventCard
                      key={`${update.Title}-${index}`}
                      title={update.Title}
                      image={update.Banner}
                      startDate={update.Start}
                      endDate={update.End}
                    />
                  ))}
                </div>
              </section>
            )}

            {/* View History Link */}
            <section className="text-center py-12 glass-card rounded-xl neon-border">
              <Archive className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-2xl font-display tracking-wider mb-2 text-foreground">
                EVENT ARCHIVE
              </h3>
              <p className="text-muted-foreground mb-6 font-medium">
                Browse past events that are no longer available in the API
              </p>
              <Link to="/history">
                <Button className="gap-2 font-semibold px-6 h-11">
                  <Archive className="w-4 h-4" />
                  View Archive
                </Button>
              </Link>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-medium">
            © 2026 Free Fire Events Tracker — API by{" "}
            <span className="text-primary">Shah G Creator</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
