import { useState } from "react";
import StatusBadge from "./StatusBadge";
import { getEventStatus } from "@/services/eventApi";
import EventDetailDialog from "./EventDetailDialog";

interface EventCardProps {
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  details?: string;
  link?: string;
}

const EventCard = ({ title, image, startDate, endDate, details, link }: EventCardProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const status = getEventStatus(startDate, endDate);
  
  if (status === "ended") return null;

  return (
    <>
      <div
        onClick={() => setDialogOpen(true)}
        className="group relative overflow-hidden rounded-lg bg-card border border-border card-shadow transition-all duration-200 hover:card-shadow-hover hover:border-primary/30 cursor-pointer"
      >
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

      <EventDetailDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={title}
        image={image}
        startDate={startDate}
        endDate={endDate}
        details={details}
        link={link}
      />
    </>
  );
};

export default EventCard;
