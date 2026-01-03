import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-xl bg-card border border-border/50 card-glow">
      <Skeleton className="aspect-[16/10] w-full bg-muted/50" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full bg-muted/50" />
        <Skeleton className="h-3 w-2/3 bg-muted/50" />
      </div>
    </div>
  );
};

export default EventCardSkeleton;
