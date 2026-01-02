import { useMemo } from "react";
import { AlertCircle, RefreshCw, Archive, Sparkles, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import EventCard from "@/components/EventCard";
import EventCardSkeleton from "@/components/EventCardSkeleton";
import SectionTitle from "@/components/SectionTitle";
import { Button } from "@/components/ui/button";
import { useEvents } from "@/hooks/useEvents";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { sortEvents } from "@/services/eventApi";
import gojoHero from "@/assets/gojo-hero.png";
import gojoCard from "@/assets/gojo-card.png";
import nobaraCard from "@/assets/nobara-card.png";

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
    <div className="min-h-screen bg-background hexagon-grid domain-expansion">
      {/* Floating Particles */}
      <div className="energy-particles" />
      
      <Header
        selectedRegion={selectedRegion}
        onRegionChange={setSelectedRegion}
      />

      <main className="container py-10 space-y-16 relative">
        {/* Hero Section with Gojo */}
        <section className="relative overflow-hidden rounded-2xl">
          <div className="absolute inset-0">
            <img 
              src={gojoHero} 
              alt="Gojo Satoru" 
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
          </div>
          
          <div className="relative py-16 px-8 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 mb-6 infinity-border">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-bold text-primary tracking-wide">DOMAIN EXPANSION</span>
              </div>
              <h1 className="text-5xl sm:text-7xl font-display tracking-wider mb-4">
                <span className="infinity-text">UNLIMITED</span>
                <br />
                <span className="purple-text">EVENTS</span>
              </h1>
              <p className="text-lg text-muted-foreground font-semibold max-w-xl">
                Track the latest Free Fire events with the power of cursed energy. 
                No event shall escape the Infinity.
              </p>
            </div>
            
            {/* Character Cards */}
            <div className="flex gap-4 lg:gap-6">
              <div className="relative w-32 h-40 sm:w-40 sm:h-52 rounded-lg overflow-hidden cursed-card animate-float group">
                <img src={gojoCard} alt="Gojo" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background to-transparent">
                  <p className="text-xs font-display text-primary text-center">GOJO</p>
                </div>
                <div className="absolute inset-0 border-2 border-primary/30 rounded-lg group-hover:border-primary/60 transition-colors" />
              </div>
              <div className="relative w-32 h-40 sm:w-40 sm:h-52 rounded-lg overflow-hidden cursed-card animate-float group" style={{ animationDelay: '1s' }}>
                <img src={nobaraCard} alt="Nobara" className="w-full h-full object-cover" />
                <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-background to-transparent">
                  <p className="text-xs font-display text-accent text-center">NOBARA</p>
                </div>
                <div className="absolute inset-0 border-2 border-accent/30 rounded-lg group-hover:border-accent/60 transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* Error State */}
        {error && (
          <div className="flex flex-col items-center justify-center py-16 gap-6 cursed-card rounded-xl">
            <div className="flex items-center gap-3 text-destructive">
              <AlertCircle className="w-8 h-8" />
              <p className="text-2xl font-display tracking-wide">CURSED TECHNIQUE FAILED</p>
            </div>
            <p className="text-muted-foreground text-center max-w-md font-semibold">
              {error.message}
            </p>
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              className="gap-2 font-bold border-primary/50 hover:bg-primary/20"
            >
              <RefreshCw className="w-4 h-4" />
              Reverse Cursed Technique
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
                <SectionTitle title="Active Curses" subtitle="Events" />
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
                <div className="text-center py-16 cursed-card rounded-xl">
                  <Hexagon className="w-16 h-16 mx-auto mb-4 text-muted-foreground/50" />
                  <p className="text-muted-foreground font-semibold text-lg">
                    No cursed events detected in this domain.
                  </p>
                </div>
              )}
            </section>

            {/* Announcements Section */}
            {sortedUpdates.length > 0 && (
              <section>
                <SectionTitle title="Transmissions" subtitle="Announcements" />
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

            {/* Archive Section */}
            <section className="relative text-center py-12 cursed-card rounded-xl overflow-hidden">
              <div className="absolute top-4 right-4 w-24 h-24 opacity-20">
                <img src={gojoCard} alt="" className="w-full h-full object-cover rounded-lg" />
              </div>
              <Archive className="w-14 h-14 mx-auto mb-4 text-secondary" />
              <h3 className="text-3xl font-display tracking-wider mb-2 purple-text">
                SEALED DOMAIN
              </h3>
              <p className="text-muted-foreground mb-6 font-semibold">
                Access the prison realm of expired events
              </p>
              <Link to="/history">
                <Button className="gap-2 font-bold px-8 h-12 cursed-gradient hover:opacity-90 text-white">
                  <Archive className="w-5 h-5" />
                  Enter the Vault
                </Button>
              </Link>
            </section>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/20 py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-semibold">
            © 2026 Jujutsu Events — Cursed by{" "}
            <span className="cursed-text">Shah G Creator</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
