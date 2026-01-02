import { Calendar, Clock, Copy, Check, Archive, Globe } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
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
      toast.success("Sealed link extracted!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Extraction failed");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="group relative overflow-hidden rounded-lg cursed-card transition-all duration-500 opacity-80 hover:opacity-100">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-secondary/90 backdrop-blur-sm">
          <Globe className="w-3.5 h-3.5 text-secondary-foreground" />
          <span className="font-display text-xs tracking-wider text-secondary-foreground">
            {event.region}
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-muted/90 backdrop-blur-sm">
          <Archive className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="font-display text-xs tracking-wider text-muted-foreground">
            SEALED
          </span>
        </div>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={event.banner}
          alt={`${event.title} event banner`}
          className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-500"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "https://via.placeholder.com/700x400?text=Sealed+Curse";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />

        {/* Copy Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={copyBannerLink}
          className="absolute bottom-3 right-3 h-9 px-3 gap-2 text-sm font-bold bg-background/90 backdrop-blur-md hover:bg-secondary hover:text-secondary-foreground border border-secondary/30 transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Extract"}
        </Button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h3 className="font-bold text-foreground text-xl leading-tight line-clamp-2">
          {event.title || "Unknown Curse"}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground/90">{event.start_date || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-muted-foreground">{event.end_date || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-xs font-semibold pt-2 border-t border-border/30">
            <Archive className="w-3.5 h-3.5 text-accent/70 flex-shrink-0" />
            <span className="text-accent/70">
              Sealed {formatDate(event.removed_at)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
