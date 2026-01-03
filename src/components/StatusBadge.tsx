import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "upcoming" | "active" | "ended";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const label = status === "active" ? "Active" : status === "ended" ? "Ended" : "Upcoming";
  
  return (
    <div
      className={cn(
        "absolute top-2 right-2 z-10 px-2 py-0.5 rounded text-xs font-medium",
        status === "active" && "bg-success text-success-foreground",
        status === "upcoming" && "bg-primary text-primary-foreground",
        status === "ended" && "bg-muted text-muted-foreground"
      )}
    >
      {label}
    </div>
  );
};

export default StatusBadge;
