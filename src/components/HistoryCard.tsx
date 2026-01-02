import { Calendar, Clock, Copy, Check, History, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { toast } from "sonner";
import { HistoryEvent } from "@/services/historyService";
import { regions } from "@/services/eventApi";

interface HistoryCardProps {
  event: HistoryEvent;
}

const HistoryCard = ({ event }: HistoryCardProps) => {
  const [copied, setCopied] = useState(false);
  const regionData = regions.find((r) => r.code === event.region);

  const copyBannerLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(event.banner);
      setCopied(true);
      toast.success("Banner link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border/50 transition-all duration-300 hover:border-primary/30">
      {/* Region & Archived Badge */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-2">
        <Badge variant="secondary" className="gap-1 text-xs bg-primary/90 text-primary-foreground backdrop-blur-sm">
          <Globe className="w-3 h-3" />
          {event.region}
        </Badge>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-muted/90 backdrop-blur-sm text-xs text-muted-foreground">
          <History className="w-3 h-3" />
          <span>Archived</span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.banner}
          alt={`${event.title} event banner`}
          className="w-full h-full object-cover opacity-75"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/700x400?text=Event+Banner";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

        {/* Copy Banner Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={copyBannerLink}
          className="absolute bottom-2 right-2 h-8 px-2 gap-1 text-xs bg-background/80 backdrop-blur-sm hover:bg-background"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy Link"}
        </Button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2">
          {event.title || "Untitled Event"}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Start: {event.start_date || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>End: {event.end_date || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70">
            <History className="w-3 h-3 flex-shrink-0" />
            <span>Archived: {formatDate(event.removed_at)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
