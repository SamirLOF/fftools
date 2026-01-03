import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { HistoryEvent } from "@/services/historyService";

interface HistoryCardProps {
  event: HistoryEvent;
}

const HistoryCard = ({ event }: HistoryCardProps) => {
  const [copied, setCopied] = useState(false);

  const copyBannerLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(event.banner);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border card-shadow transition-all duration-200 hover:card-shadow-hover hover:border-primary/30 opacity-80 hover:opacity-100">
      {/* Region Badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground">
          {event.region}
        </span>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={event.banner}
          alt={event.title}
          className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-300"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x400?text=Archived";
          }}
        />

        {/* Copy Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={copyBannerLink}
          className="absolute bottom-2 right-2 h-7 px-2 gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Done" : "Copy"}
        </Button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-medium text-foreground text-sm leading-tight line-clamp-2">
          {event.title || "Untitled Event"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5">
          {event.start_date} — {event.end_date}
        </p>
      </div>
    </div>
  );
};

export default HistoryCard;
