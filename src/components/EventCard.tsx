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
  
  if (status === "ended") return null;

  const copyBannerLink = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(image);
      setCopied(true);
      toast.success("Cursed link copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Technique failed");
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg cursed-card transition-all duration-500 hover:scale-[1.02]">
      <StatusBadge status={status} />
      
      {/* Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={image}
          alt={`${title} event banner`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x400?text=Cursed+Banner";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
        
        {/* Copy Button */}
        <Button
          size="sm"
          variant="secondary"
          onClick={copyBannerLink}
          className="absolute bottom-3 right-3 h-9 px-3 gap-2 text-sm font-bold bg-background/90 backdrop-blur-md hover:bg-primary hover:text-primary-foreground border border-primary/30 transition-all"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied!" : "Copy"}
        </Button>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        <h3 className="font-bold text-foreground text-xl leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title || "Unknown Curse"}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Calendar className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="text-foreground/90">{startDate || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Clock className="w-4 h-4 text-secondary flex-shrink-0" />
            <span className="text-muted-foreground">{endDate || "N/A"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
