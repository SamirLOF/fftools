import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "upcoming" | "active" | "ended";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = status === "active" ? "Active" : status === "ended" ? "Ended" : "Upcoming";
  
  return (
    <div
      className={cn(
        "absolute top-2 right-2 z-10 px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wide backdrop-blur-sm",
        status === "active" && "bg-success/90 text-success-foreground shadow-lg shadow-success/20",
        status === "upcoming" && "bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20",
        status === "ended" && "bg-muted/90 text-muted-foreground"
      )}
    >
      {label}
    </div>
  );
};

export default StatusBadge;
