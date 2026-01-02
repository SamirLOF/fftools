import { useState, useCallback } from "react";
import { Search, Archive, ChevronLeft, ChevronRight, Loader2, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import HistoryCard from "@/components/HistoryCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEventHistoryPaginated } from "@/hooks/useEventHistory";
import { useSelectedRegion } from "@/hooks/useSelectedRegion";
import { regions } from "@/services/eventApi";
import PageTransition from "@/components/PageTransition";

const PAGE_SIZE = 12;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

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
    <PageTransition>
      <div className="min-h-screen bg-background hexagon-grid">
        <Header selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />

        <main className="container py-8">
          {/* Back Link */}
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2 mb-4 font-bold hover:text-primary">
              <ChevronLeft className="w-4 h-4" />
              Back
            </Button>
          </Link>

          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Globe className="w-4 h-4 text-secondary" />
                <span className="font-display text-sm tracking-wider text-secondary">
                  {selectedRegionData?.code} — {selectedRegionData?.name}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display tracking-wider">
                <span className="purple-text">EVENT</span>{" "}
                <span className="text-foreground">ARCHIVE</span>
              </h1>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 h-10 bg-muted/50 border-secondary/30 font-semibold focus:border-secondary/60"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="mb-6 bg-muted/50 p-1 border border-border/50">
              <TabsTrigger value="all" className="font-bold px-4 data-[state=active]:bg-secondary/20 data-[state=active]:text-secondary">All</TabsTrigger>
              <TabsTrigger value="event" className="font-bold px-4 data-[state=active]:bg-primary/20 data-[state=active]:text-primary">Events</TabsTrigger>
              <TabsTrigger value="update" className="font-bold px-4 data-[state=active]:bg-accent/20 data-[state=active]:text-accent">Announcements</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="w-10 h-10 animate-spin text-secondary" />
                </div>
              ) : data && data.data.length > 0 ? (
                <>
                  <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
                  >
                    {data.data.map((event) => (
                      <motion.div key={event.id} variants={itemVariants}>
                        <HistoryCard event={event} />
                      </motion.div>
                    ))}
                  </motion.div>

                  {data.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-3 mt-8">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="gap-1 font-bold border-secondary/40 hover:bg-secondary/20"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Prev
                      </Button>

                      <span className="text-sm font-bold text-muted-foreground">
                        {currentPage} / {data.totalPages}
                      </span>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage((p) => Math.min(data.totalPages, p + 1))}
                        disabled={currentPage === data.totalPages}
                        className="gap-1 font-bold border-secondary/40 hover:bg-secondary/20"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  <p className="text-center text-xs text-muted-foreground mt-4 font-semibold">
                    {data.total} archived events
                  </p>
                </>
              ) : (
                <div className="text-center py-16 cursed-card rounded-xl">
                  <Archive className="w-14 h-14 mx-auto mb-4 text-secondary/50" />
                  <h3 className="text-2xl font-display tracking-wider mb-2 text-muted-foreground">
                    {searchQuery ? "NO RESULTS" : "NO ARCHIVES"}
                  </h3>
                  <p className="text-muted-foreground font-semibold text-sm">
                    {searchQuery
                      ? `No events matching "${searchQuery}"`
                      : `No archived events for ${selectedRegionData?.name}`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-secondary/20 py-6 mt-10">
          <div className="container text-center">
            <p className="text-xs text-muted-foreground font-semibold">
              © 2026 FF Events (JJK) — Credit{" "}
              <span className="purple-text font-bold">LEAKS OF FF</span>
            </p>
          </div>
        </footer>
      </div>
    </PageTransition>
  );
};

export default History;
