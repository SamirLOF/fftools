import { Skeleton } from "@/components/ui/skeleton";

const EventCardSkeleton = () => {
  return (
    <div className="overflow-hidden rounded-lg bg-card border border-border">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
};

export default EventCardSkeleton;
