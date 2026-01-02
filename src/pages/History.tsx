import { useState, useCallback } from "react";
import { Search, Archive, ChevronLeft, ChevronRight, Loader2, Globe, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HistoryCard from "@/components/HistoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventHistoryPaginated } from "@/hooks/useEventHistory";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { regions } from "@/services/eventApi";

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

  // Debounce search
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
    <div className="min-h-screen bg-background bg-grid">
      <Header selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />

      <main className="container py-10">
        {/* Back Link */}
        <Link to="/">
          <Button variant="ghost" size="sm" className="gap-2 mb-6 font-semibold">
            <ChevronLeft className="w-4 h-4" />
            Back to Events
          </Button>
        </Link>

        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <Globe className="w-4 h-4 text-primary" />
                <span className="font-display text-sm tracking-wider text-primary">
                  {selectedRegionData?.code} — {selectedRegionData?.name}
                </span>
              </div>
            </div>
            <h1 className="text-5xl sm:text-6xl font-display tracking-wider mb-2">
              <span className="gold-text">EVENT</span>{" "}
              <span className="text-foreground">ARCHIVE</span>
            </h1>
            <p className="text-muted-foreground font-medium max-w-lg">
              Browse archived banners that have been removed from the API for this region.
            </p>
          </div>

          {/* Search Input */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search archived events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-12 h-12 bg-card border-border/50 font-medium text-base"
            />
          </div>
        </div>

        {/* Info Banner */}
        <div className="glass-card rounded-lg p-5 mb-8 flex items-start gap-4">
          <Zap className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-muted-foreground font-medium">
            <strong className="text-foreground">How it works:</strong> When events are removed from the API for{" "}
            <strong className="text-primary">{selectedRegionData?.name}</strong>, they are automatically archived here.
            Switch regions from the header to view archives for other regions.
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-8 bg-secondary/50 p-1">
            <TabsTrigger value="all" className="font-semibold px-6">All</TabsTrigger>
            <TabsTrigger value="event" className="font-semibold px-6">Events</TabsTrigger>
            <TabsTrigger value="update" className="font-semibold px-6">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
              </div>
            ) : data && data.data.length > 0 ? (
              <>
                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {data.data.map((event) => (
                    <HistoryCard key={event.id} event={event} />
                  ))}
                </div>

                {/* Pagination */}
                {data.totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-10">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-2 font-semibold"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <span className="text-sm font-semibold text-muted-foreground px-4">
                      Page {currentPage} of {data.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
                      disabled={currentPage === data.totalPages}
                      className="gap-2 font-semibold"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Total Count */}
                <p className="text-center text-sm text-muted-foreground mt-6 font-medium">
                  Showing {data.data.length} of {data.total} archived events
                </p>
              </>
            ) : (
              <div className="text-center py-20 glass-card rounded-xl">
                <Archive className="w-20 h-20 mx-auto mb-6 text-muted-foreground/50" />
                <h3 className="text-3xl font-display tracking-wider mb-3 text-muted-foreground">
                  {searchQuery ? "NO RESULTS" : "ARCHIVE EMPTY"}
                </h3>
                <p className="text-muted-foreground font-medium max-w-md mx-auto">
                  {searchQuery
                    ? `No events found matching "${searchQuery}"`
                    : `No archived events yet for ${selectedRegionData?.name}`}
                </p>
                <p className="text-sm mt-4 text-muted-foreground/70 font-medium">
                  Events appear here when removed from the {selectedRegionData?.code} region API
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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

export default History;
