'use client';

/**
 * Loading Skeleton Component
 * 
 * Displays skeleton loaders for various content types
 */
export function LoadingSkeleton({ type = 'card' }: { type?: 'card' | 'list' | 'table' | 'text' }) {
  if (type === 'card') {
    return (
      <div className="card animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      </div>
    );
  }

  if (type === 'list') {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="card animate-pulse">
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/6"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // text
  return (
    <div className="animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-4/6"></div>
    </div>
  );
}

/**
 * Card Skeleton
 */
export function CardSkeleton() {
  return <LoadingSkeleton type="card" />;
}

/**
 * List Skeleton
 */
export function ListSkeleton() {
  return <LoadingSkeleton type="list" />;
}

/**
 * Table Skeleton
 */
export function TableSkeleton() {
  return <LoadingSkeleton type="table" />;
}

