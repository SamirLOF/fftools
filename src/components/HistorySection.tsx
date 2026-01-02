import { useState } from "react";
import { Search, History, Loader2 } from "lucide-react";
import { Input } from "./ui/input";
import { useEventHistory } from "@/hooks/useEventHistory";
import HistoryCard from "./HistoryCard";
import SectionTitle from "./SectionTitle";

interface HistorySectionProps {
  region: string;
}

const HistorySection = ({ region }: HistorySectionProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search
  const handleSearch = (value: string) => {
    setSearchQuery(value);
    // Simple debounce
    setTimeout(() => {
      setDebouncedQuery(value);
    }, 300);
  };

  const { data: history, isLoading } = useEventHistory(region, debouncedQuery);

  if (isLoading) {
    return (
      <section className="mt-8">
        <SectionTitle title="Event History" />
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-bold text-foreground">Event History</h2>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-card border-border"
          />
        </div>
      </div>

      {history && history.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {history.map((event) => (
            <HistoryCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>
            {searchQuery
              ? "No events found matching your search"
              : "No archived events yet for this region"}
          </p>
          <p className="text-sm mt-2">
            Events will appear here when they are removed from the API
          </p>
        </div>
      )}
    </section>
  );
};

export default HistorySection;
