import { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import { getEventStatus } from "@/services/eventApi";
import EventDetailDialog from "./EventDetailDialog";
import { useAuth } from "@/contexts/AuthContext";
import { Timer, Crown } from "lucide-react";
import { parse, differenceInSeconds, isAfter, isValid } from "date-fns";

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
  const [countdown, setCountdown] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
  const status = getEventStatus(startDate, endDate);
  const { isPremium } = useAuth();
  
  if (status === "ended") return null;

  // Parse date string like "Jan 03" to a Date object for the current year
  const parseEventDate = (dateStr: string): Date | null => {
    try {
      const currentYear = new Date().getFullYear();
      const parsed = parse(`${dateStr} ${currentYear}`, "MMM dd yyyy", new Date());
      if (isValid(parsed)) return parsed;
      
      const parsed2 = parse(`${dateStr} ${currentYear}`, "dd MMM yyyy", new Date());
      if (isValid(parsed2)) return parsed2;
      
      return null;
    } catch {
      return null;
    }
  };

  // Countdown timer for upcoming events (Premium only)
  useEffect(() => {
    if (!isPremium || status !== "upcoming") {
      setCountdown(null);
      return;
    }

    const startDateObj = parseEventDate(startDate);
    if (!startDateObj || !isAfter(startDateObj, new Date())) {
      setCountdown(null);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const diff = differenceInSeconds(startDateObj, now);
      
      if (diff <= 0) {
        setCountdown(null);
        return;
      }

      const days = Math.floor(diff / (24 * 60 * 60));
      const hours = Math.floor((diff % (24 * 60 * 60)) / (60 * 60));
      const minutes = Math.floor((diff % (60 * 60)) / 60);
      const seconds = diff % 60;

      setCountdown({ days, hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [isPremium, status, startDate]);

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
          
          {/* Premium Countdown on Card */}
          {isPremium && countdown && status === "upcoming" && (
            <div className="absolute bottom-2 left-2 right-2 p-2 rounded-lg bg-background/90 backdrop-blur-sm border border-primary/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Timer className="w-3 h-3 text-primary" />
                  <Crown className="w-2.5 h-2.5 text-primary" />
                </div>
                <div className="flex gap-1.5 text-[10px] font-mono font-semibold">
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">{countdown.days}d</span>
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">{countdown.hours}h</span>
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded">{countdown.minutes}m</span>
                  <span className="bg-primary/20 text-primary px-1.5 py-0.5 rounded animate-pulse">{countdown.seconds}s</span>
                </div>
              </div>
            </div>
          )}
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
