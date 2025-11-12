interface SkeletonProps {
  className?: string;
  width?: string;
  height?: string;
  rounded?: boolean;
}

export function Skeleton({ 
  className = '', 
  width = 'w-full', 
  height = 'h-4', 
  rounded = true 
}: SkeletonProps) {
  return (
    <div 
      className={`
        animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 
        bg-[length:200%_100%] animate-[shimmer_2s_infinite]
        ${width} ${height} ${rounded ? 'rounded' : ''} ${className}
      `}
    />
  );
}

// Specific skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-6 space-y-4">
      <div className="flex items-center space-x-3">
        <Skeleton width="w-12" height="h-12" className="rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton width="w-3/4" height="h-4" />
          <Skeleton width="w-1/2" height="h-3" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton width="w-full" height="h-3" />
        <Skeleton width="w-5/6" height="h-3" />
        <Skeleton width="w-4/6" height="h-3" />
      </div>
      <div className="flex space-x-2">
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
        <Skeleton width="w-20" height="h-6" className="rounded-full" />
      </div>
    </div>
  );
}

export function OpportunityCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-start justify-between">
        <Skeleton width="w-3/4" height="h-5" />
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
      </div>
      <div className="space-y-2">
        <Skeleton width="w-full" height="h-4" />
        <Skeleton width="w-5/6" height="h-4" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton width="w-16" height="h-6" className="rounded-full" />
        <Skeleton width="w-20" height="h-6" className="rounded-full" />
        <Skeleton width="w-14" height="h-4" />
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton width="w-48" height="h-8" />
          <Skeleton width="w-32" height="h-5" />
        </div>
        <Skeleton width="w-24" height="h-10" />
      </div>
      
      {/* Stats Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-6 space-y-3">
            <div className="flex items-center justify-between">
              <Skeleton width="w-8" height="h-8" className="rounded-lg" />
              <Skeleton width="w-6" height="h-4" />
            </div>
            <Skeleton width="w-16" height="h-8" />
            <Skeleton width="w-24" height="h-4" />
          </div>
        ))}
      </div>
      
      {/* Content Area Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton width="w-48" height="h-6" />
          {[1, 2, 3].map((i) => (
            <OpportunityCardSkeleton key={i} />
          ))}
        </div>
        <div className="space-y-4">
          <Skeleton width="w-32" height="h-6" />
          <CardSkeleton />
        </div>
      </div>
    </div>
  );
}
