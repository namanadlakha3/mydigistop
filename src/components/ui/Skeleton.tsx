import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('skeleton', className)} {...props} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="glass-card p-0 overflow-hidden">
      <Skeleton className="w-full h-48" style={{ borderRadius: '16px 16px 0 0' }} />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-9 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: SkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
      <Skeleton className="h-4 w-16" />
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="w-10 h-10 rounded-xl" />
      </div>
      <Skeleton className="h-9 w-20" />
      <Skeleton className="h-3 w-28" />
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 rounded-xl border border-white/5">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}
