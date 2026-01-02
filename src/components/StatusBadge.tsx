import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "upcoming" | "active";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "absolute top-3 right-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide",
        status === "active"
          ? "bg-success text-success-foreground status-pulse"
          : "bg-primary text-primary-foreground"
      )}
    >
      <Sparkles className="w-3 h-3" />
      {status === "active" ? "Active" : "Upcoming"}
    </div>
  );
};

export default StatusBadge;
