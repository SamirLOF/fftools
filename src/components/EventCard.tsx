import { Calendar, Clock } from "lucide-react";
import StatusBadge from "./StatusBadge";

interface EventCardProps {
  title: string;
  image: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "active";
}

const EventCard = ({ title, image, startDate, endDate, status }: EventCardProps) => {
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
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
          {title}
        </h3>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 text-primary" />
            <span>Start: {startDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4 text-muted-foreground" />
            <span>End: {endDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
