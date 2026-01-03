import { Copy, Check } from "lucide-react";
import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { getEventStatus } from "@/services/eventApi";
import { Button } from "./ui/button";
import { toast } from "sonner";

interface EventCardProps {
  title: string;
  image: string;
  startDate: string;
  endDate: string;
}

const EventCard = ({ title, image, startDate, endDate }: EventCardProps) => {
  const [copied, setCopied] = useState(false);
  const status = getEventStatus(startDate, endDate);
  
  if (status === "ended") return null;

  const copyBannerLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(image);
      setCopied(true);
      toast.success("Link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card border border-border card-shadow transition-all duration-200 hover:card-shadow-hover hover:border-primary/30">
      <StatusBadge status={status} />
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x400?text=Event";
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
          {title || "Untitled Event"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5">
          {startDate} — {endDate}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
