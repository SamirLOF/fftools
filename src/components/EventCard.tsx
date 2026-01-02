import { Calendar, Clock, Copy, Check } from "lucide-react";
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
  
  // Don't show ended events
  if (status === "ended") return null;

  const copyBannerLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(image);
      setCopied(true);
      toast.success("Banner link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg bg-card card-glow transition-all duration-300 hover:scale-[1.02] cursor-pointer">
      <StatusBadge status={status} />
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={`${title} event banner`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x400?text=Event+Banner";
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
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title || "Untitled Event"}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span>Start: {startDate || "N/A"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <span>End: {endDate || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
