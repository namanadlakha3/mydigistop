import { cn } from '@/lib/utils';
import type { OrderStatus } from '@/types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'purple' | 'cyan' | 'success' | 'warning' | 'danger' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

const variantStyles = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  purple:  'bg-indigo-50 text-indigo-700 border-indigo-200',
  cyan:    'bg-sky-50 text-sky-700 border-sky-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger:  'bg-red-50 text-red-600 border-red-200',
  muted:   'bg-slate-50 text-slate-400 border-slate-200',
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
  pending:    'warning',
  processing: 'purple',
  delivered:  'success',
  cancelled:  'danger',
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
