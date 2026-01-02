const EventCardSkeleton = () => {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card card-glow animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-[16/10] bg-muted" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-full" />
          <div className="h-4 bg-muted rounded w-2/3" />
        </div>
      </div>
    </div>
  );
};

export default EventCardSkeleton;
