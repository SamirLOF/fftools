import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "upcoming" | "active";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  return (
    <div
      className={cn(
        "absolute top-2 right-2 z-10 px-2 py-0.5 rounded text-xs font-medium",
        status === "active"
          ? "bg-success text-success-foreground"
          : "bg-primary text-primary-foreground"
      )}
    >
      {status === "active" ? "Active" : "Upcoming"}
    </div>
  );
};

export default StatusBadge;
