import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, ArrowRight, Filter } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useMyOrders } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils';
import type { OrderStatus } from '@/types';

const statusFilters: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export function MyOrdersPage() {
  const { data: orders, isLoading } = useMyOrders();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = orders?.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = !search || o.id.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <>
      <Helmet><title>My Orders — MyDigiStop</title></Helmet>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black text-white">My Orders</h1>
          <p className="mt-1 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Track all your order history
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="w-64">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID..."
              icon={<Search size={16} />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  statusFilter === value
                    ? 'text-white border-purple-500/40'
                    : 'text-white/50 border-white/10 hover:text-white hover:border-white/20'
                }`}
                style={statusFilter === value ? { background: 'rgba(108,71,255,0.15)' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {isLoading ? (
          <TableSkeleton rows={6} />
        ) : filtered?.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <Package size={40} className="mx-auto mb-4" style={{ color: 'rgba(108,71,255,0.4)' }} />
            <p className="font-semibold text-white mb-1">No orders found</p>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              {search || statusFilter !== 'all' ? 'Try changing filters' : 'Place your first order!'}
            </p>
            {!search && statusFilter === 'all' && (
              <Link to="/products" className="mt-4 inline-block">
                <button className="btn-brand text-sm mt-4">Shop Now</button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered?.map((order) => (
              <Link key={order.id} to={`/dashboard/orders/${order.id}`}>
                <motion.div
                  whileHover={{ x: 3 }}
                  className="flex items-center gap-4 p-5 rounded-2xl border transition-all hover:border-purple-500/25"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: 'rgba(108,71,255,0.1)', border: '1px solid rgba(108,71,255,0.15)' }}
                  >
                    <Package size={20} style={{ color: '#6C47FF' }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-white">
                      Order #{order.id.slice(0, 8).toUpperCase()}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {formatDate(order.created_at)} · {order.order_items?.length ?? 0} product(s)
                    </p>
                  </div>

                  <OrderStatusBadge status={order.status} />

                  <p className="text-lg font-black text-white ml-2 hidden sm:block">
                    {formatPrice(order.total_amount)}
                  </p>

                  <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
