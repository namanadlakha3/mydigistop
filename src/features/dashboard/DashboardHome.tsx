import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Package, ShoppingBag, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '@/features/auth/AuthProvider';
import { useMyOrders } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { OrderRowSkeleton } from '@/components/ui/Skeleton';

export function DashboardHome() {
  const { profile } = useAuth();
  const { data: orders, isLoading } = useMyOrders();

  const stats = [
    { label: 'Total Orders', value: orders?.length ?? 0, icon: ShoppingBag },
    { label: 'Pending', value: orders?.filter((o) => o.status === 'pending').length ?? 0, icon: Clock },
    { label: 'Delivered', value: orders?.filter((o) => o.status === 'delivered').length ?? 0, icon: CheckCircle2 },
  ];

  return (
    <>
      <Helmet><title>Dashboard — MyDigiStop</title></Helmet>

      <div className="space-y-8">
        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-black text-white">
            Welcome back, {profile?.full_name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="mt-2 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Here's a summary of your account activity
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {stats.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-5 rounded-2xl border text-center"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(108,71,255,0.12)', border: '1px solid rgba(108,71,255,0.2)' }}
              >
                <Icon size={18} style={{ color: '#6C47FF' }} />
              </div>
              <div className="text-2xl font-black text-white">{value}</div>
              <div className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link to="/dashboard/orders" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300 transition-colors">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => <OrderRowSkeleton key={i} />)}
            </div>
          ) : orders?.length === 0 ? (
            <div className="text-center py-12 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <Package size={36} className="mx-auto mb-3" style={{ color: 'rgba(108,71,255,0.4)' }} />
              <p className="text-sm font-medium text-white mb-1">No orders yet</p>
              <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Browse our products and place your first order</p>
              <Link to="/products">
                <button className="btn-brand text-sm">Browse Products</button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders?.slice(0, 5).map((order) => (
                <Link key={order.id} to={`/dashboard/orders/${order.id}`}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border transition-all hover:border-purple-500/30"
                    style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                      style={{ background: 'rgba(108,71,255,0.1)' }}
                    >
                      <Package size={18} style={{ color: '#6C47FF' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white">
                        Order #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {formatDate(order.created_at)} · {order.order_items?.length ?? 0} item(s)
                      </p>
                    </div>
                    <OrderStatusBadge status={order.status} />
                    <span className="text-sm font-bold text-white ml-2">
                      {formatPrice(order.total_amount)}
                    </span>
                    <ArrowRight size={16} style={{ color: 'rgba(255,255,255,0.3)' }} />
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
