import { useState, useCallback } from "react";
import { Search, Archive, ChevronLeft, ChevronRight, Loader2, Globe, Hexagon } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HistoryCard from "@/components/HistoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventHistoryPaginated } from "@/hooks/useEventHistory";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { regions } from "@/services/eventApi";
import nobaraCard from "@/assets/nobara-card.png";

const PAGE_SIZE = 12;

const History = () => {
  const [selectedRegion, setSelectedRegion] = useSelectedRegion("SG");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'all' | 'event' | 'update'>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading } = useEventHistoryPaginated(selectedRegion, {
    page: currentPage,
    pageSize: PAGE_SIZE,
    searchQuery: debouncedQuery,
    eventType: activeTab,
  });

  const selectedRegionData = regions.find((r) => r.code === selectedRegion);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
    const timeout = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'event' | 'update');
    setCurrentPage(1);
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setCurrentPage(1);
    setSearchQuery("");
    setDebouncedQuery("");
    setActiveTab("all");
  };

  return (
    <div className="min-h-screen bg-background hexagon-grid domain-expansion">
      <div className="energy-particles" />
      <Header selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />

      <main className="container py-10 relative">
        {/* Back Link */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-6 font-bold hover:text-primary">
            <ChevronLeft className="w-4 h-4" />
            Exit Domain
          </Button>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div className="flex gap-6 items-start">
            <div className="hidden sm:block relative w-24 h-32 rounded-lg overflow-hidden cursed-card flex-shrink-0">
              <img src={nobaraCard} alt="Nobara" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 border border-accent/40 rounded-lg" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/30">
                  <Globe className="w-4 h-4 text-secondary" />
                  <span className="font-display text-sm tracking-wider text-secondary">
                    {selectedRegionData?.code} — {selectedRegionData?.name}
                  </span>
                </div>
              </div>
              <h1 className="text-5xl sm:text-6xl font-display tracking-wider mb-2">
                <span className="purple-text">PRISON</span>{" "}
                <span className="text-foreground">REALM</span>
              </h1>
              <p className="text-muted-foreground font-semibold max-w-lg">
                Sealed curses that have been exorcised from the active domain.
              </p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search sealed events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 h-12 bg-muted/50 border-secondary/30 font-semibold text-base focus:border-secondary/60"
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="cursed-card rounded-lg p-5 mb-8 flex items-start gap-4 border-l-4 border-secondary">
          <Hexagon className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground font-semibold">
            <strong className="text-foreground">Binding Vow:</strong> When curses are exorcised from{" "}
            <strong className="text-secondary">{selectedRegionData?.name}</strong>, they are sealed here automatically.
            Change domains from the header to view other sealed entities.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8 bg-muted/50 p-1 border border-border/50">
            <TabsTrigger value="all" className="font-bold px-6 data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">All</TabsTrigger>
            <TabsTrigger value="event" className="font-bold px-6 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Events</TabsTrigger>
            <TabsTrigger value="update" className="font-bold px-6 data-[state=active]:bg-accent/20 data-[state=active]:text-accent">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-12 h-12 animate-spin text-secondary" />
              </div>
            ) : data && data.data.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.data.map((event) => (
                    <HistoryCard key={event.id} event={event} />
                  ))}
                </div>

                {data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-2 font-bold border-secondary/40 hover:bg-secondary/20"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <span className="text-sm font-bold text-muted-foreground px-4">
                      Seal {currentPage} of {data.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
                      disabled={currentPage === data.totalPages}
                      className="gap-2 font-bold border-secondary/40 hover:bg-secondary/20"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <p className="text-center text-sm text-muted-foreground mt-6 font-semibold">
                  {data.total} sealed curses discovered
                </p>
              </>
            ) : (
              <div className="text-center py-20 cursed-card rounded-xl">
                <Archive className="w-20 h-20 mx-auto mb-6 text-secondary/50" />
                <h3 className="text-3xl font-display tracking-wider mb-3 text-muted-foreground">
                  {searchQuery ? "NO MATCHES" : "REALM EMPTY"}
                </h3>
                <p className="text-muted-foreground font-semibold max-w-md mx-auto">
                  {searchQuery
                    ? `No sealed curses matching "${searchQuery}"`
                    : `No sealed entities in ${selectedRegionData?.name} domain`}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-secondary/20 py-8 mt-16">
        <div className="container text-center">
          <p className="text-sm text-muted-foreground font-semibold">
            © 2026 Jujutsu Events — Cursed by{" "}
            <span className="purple-text">Shah G Creator</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default History;
