import { useState, useCallback } from "react";
import { Search, History as HistoryIcon, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import HistoryCard from "@/components/HistoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventHistoryPaginated } from "@/hooks/useEventHistory";

const PAGE_SIZE = 12;

const History = () => {
  const [selectedRegion, setSelectedRegion] = useState("SG");
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

  // Debounce search
  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
    const timeout = setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value as 'all' | 'event' | 'update');
    setCurrentPage(1); // Reset to first page on tab change
  };

  const handleRegionChange = (region: string) => {
    setSelectedRegion(region);
    setCurrentPage(1); // Reset to first page on region change
  };

  return (
    <div className="min-h-screen bg-background">
      <Header selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />

      <main className="container py-8">
        {/* Back Link & Title */}
        <div className="flex items-center gap-4 mb-6">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ChevronLeft className="w-4 h-4" />
              Back to Events
            </Button>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <HistoryIcon className="w-6 h-6 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">Event History</h1>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search archived events..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 bg-card border-border"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="event">Events</TabsTrigger>
            <TabsTrigger value="update">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="gap-1"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {data.totalPages}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
                      disabled={currentPage === data.totalPages}
                      className="gap-1"
                    >
                      Next
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {/* Total Count */}
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing {data.data.length} of {data.total} archived events
                </p>
              </>
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <HistoryIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">
                  {searchQuery
                    ? "No events found matching your search"
                    : "No archived events yet for this region"}
                </p>
                <p className="text-sm mt-2">
                  Events will appear here when they are removed from the API
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
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

export default History;
