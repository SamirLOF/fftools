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
        className="group relative overflow-hidden rounded-xl bg-card border border-border/50 card-glow smooth-transition hover:card-glow-hover hover:border-primary/40 cursor-pointer will-change-transform"
      >
        <StatusBadge status={status} />
        
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted/50">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://via.placeholder.com/700x400?text=Event";
            }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-3">
          <h3 className="font-medium text-foreground text-sm leading-tight" title={title}>
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
