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
    <div className="group relative overflow-hidden rounded-lg cursed-card transition-all duration-300 hover:scale-[1.02]">
      <StatusBadge status={status} />
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x400?text=Event";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />
        
        {/* Copy Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={copyBannerLink}
          className="absolute bottom-2 right-2 h-7 px-2 gap-1 text-xs font-bold bg-background/90 backdrop-blur-sm hover:bg-primary hover:text-primary-foreground border border-primary/30"
        >
          {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
          {copied ? "Done" : "Copy"}
        </Button>
      </div>

      {/* Content */}
      <div className="p-3">
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-2">
          {title || "Untitled Event"}
        </h3>
        <p className="text-xs text-muted-foreground mt-1.5 font-medium">
          {startDate} — {endDate}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
