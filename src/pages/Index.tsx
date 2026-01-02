import { useState, useMemo } from "react";
import { AlertCircle, RefreshCw, History } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { sortEvents } from "@/services/eventApi";

const Index = () => {
  const [selectedRegion, setSelectedRegion] = useState("SG");
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
    <div className="min-h-screen bg-background">
      <Header
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <main className="container py-8 space-y-12">
        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="w-6 h-6" />
              <p className="text-lg font-medium">Failed to load events</p>
            </div>
            <p className="text-muted-foreground text-center max-w-md">
              {error.message}
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              className="gap-2"
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
              <div className="flex items-center justify-between mb-6">
                <SectionTitle title="Events" />
                {isFetching && !isLoading && (
                  <RefreshCw className="w-5 h-5 animate-spin text-primary" />
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
                <p className="text-muted-foreground text-center py-8">
                  No events available for this region.
                </p>
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
            <section className="text-center py-8 border-t border-border/50">
              <p className="text-muted-foreground mb-4">
                Looking for past events that are no longer available?
              </p>
              <Link to="/history">
                <Button variant="outline" className="gap-2">
                  <History className="w-4 h-4" />
                  View Event History
                </Button>
              </Link>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-6 mt-12">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2026 Free Fire Events. API by Shah G Creator.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
