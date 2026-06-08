import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'cyan' | 'success' | 'warning' | 'danger' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-white/10 text-white border-white/15',
  purple: 'bg-purple-500/15 text-purple-300 border-purple-500/25',
  cyan: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/25',
  success: 'bg-green-500/15 text-green-300 border-green-500/25',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/25',
  danger: 'bg-red-500/15 text-red-400 border-red-500/25',
  muted: 'bg-white/5 text-white/50 border-white/10',
};

const sizeStyles = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
};

export function Badge({ children, variant = 'default', size = 'md', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium border',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      {children}
    </span>
  );
}

const statusVariantMap: Record<OrderStatus, BadgeProps['variant']> = {
  pending: 'warning',
  processing: 'purple',
  delivered: 'success',
  cancelled: 'danger',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge variant={statusVariantMap[status]}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}

export function FeaturedBadge() {
  return (
    <Badge variant="purple" className="text-xs">
      ⭐ Featured
    </Badge>
  );
}

export function SaleBadge({ percentage }: { percentage: number }) {
  return (
    <Badge variant="danger" className="font-bold">
      -{percentage}%
    </Badge>
  );
}

export function InventoryBadge({ count }: { count: number }) {
  if (count === 0) return <Badge variant="danger">Out of Stock</Badge>;
  if (count <= 5) return <Badge variant="warning">{count} left</Badge>;
  return <Badge variant="success">In Stock</Badge>;
}
