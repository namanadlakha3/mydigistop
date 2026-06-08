import { motion } from 'framer-motion';
import { Package, ShoppingBag, Users, Key, TrendingUp, Clock, CheckCircle2, AlertTriangle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { StatCardSkeleton, TableSkeleton } from '@/components/ui/Skeleton';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { formatDate, formatPrice } from '@/lib/utils';
import { Link } from 'react-router-dom';
import type { Order } from '@/types';

function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [products, orders, customers, pendingOrders] = await Promise.all([
        supabase.from('products').select('id', { count: 'exact', head: true }),
        supabase.from('orders').select('id, total_amount', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'customer'),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
      ]);

      const totalRevenue = (orders.data || []).reduce((sum, o) => sum + (o.total_amount || 0), 0);

      return {
        products: products.count ?? 0,
        orders: orders.count ?? 0,
        customers: customers.count ?? 0,
        revenue: totalRevenue,
        pending: pendingOrders.count ?? 0,
      };
    },
  });
}

function useRecentOrders() {
  return useQuery({
    queryKey: ['admin-recent-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, profile:profiles(full_name, email), order_items(id)')
        .order('created_at', { ascending: false })
        .limit(8);
      if (error) throw error;
      return data as Order[];
    },
  });
}

export function AdminDashboard() {
  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: orders, isLoading: ordersLoading } = useRecentOrders();

  const statCards = [
    { label: 'Total Products', value: stats?.products ?? 0, icon: Package, color: '#6C47FF', suffix: '' },
    { label: 'Total Orders', value: stats?.orders ?? 0, icon: ShoppingBag, color: '#00C2CB', suffix: '' },
    { label: 'Customers', value: stats?.customers ?? 0, icon: Users, color: '#F59E0B', suffix: '' },
    { label: 'Total Revenue', value: formatPrice(stats?.revenue ?? 0), icon: TrendingUp, color: '#10B981', suffix: '' },
    { label: 'Pending Orders', value: stats?.pending ?? 0, icon: Clock, color: '#EF4444', suffix: '' },
  ];

  return (
    <>
      <Helmet><title>Admin Dashboard — MyDigiStop</title></Helmet>

      <div className="space-y-8 max-w-7xl">
        <div>
          <h1 className="text-3xl font-black text-white">Dashboard</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Overview of your store performance
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {statsLoading
            ? Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
            : statCards.map(({ label, value, icon: Icon, color }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-5 rounded-2xl border"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.07)' }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>{label}</span>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                  </div>
                  <div className="text-2xl font-black text-white">{value}</div>
                </motion.div>
              ))}
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-white">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-purple-400 hover:text-purple-300">View All →</Link>
          </div>

          {ordersLoading ? (
            <TableSkeleton rows={6} />
          ) : (
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders?.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b hover:bg-white/2 transition-colors"
                      style={{ borderColor: 'rgba(255,255,255,0.05)' }}
                    >
                      <td className="px-4 py-3">
                        <Link to={`/admin/orders/${order.id}`} className="text-sm font-mono font-semibold text-purple-400 hover:text-purple-300">
                          #{order.id.slice(0, 8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-white">{(order as any).profile?.full_name || 'N/A'}</p>
                          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{(order as any).profile?.email}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-white/60">{(order as any).order_items?.length ?? 0}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-white">{formatPrice(order.total_amount)}</td>
                      <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
