import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ChevronDown, Eye, Key, MessageSquare, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useAdminOrders, useUpdateOrderStatus } from '@/hooks/useOrders';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import { Badge, OrderStatusBadge } from '@/components/ui/Badge';
import { TableSkeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils';
import type { Order, OrderStatus, LicenseKey } from '@/types';
import { toast } from 'sonner';

interface OrderDetailModalProps {
  order: Order;
  onClose: () => void;
}

function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const [status, setStatus] = useState(order.status);
  const [adminNotes, setAdminNotes] = useState(order.admin_notes || '');
  const [selectedKeys, setSelectedKeys] = useState<Record<string, string>>({});
  const updateStatus = useUpdateOrderStatus();
  const qc = useQueryClient();

  const assignAndDeliver = async () => {
    try {
      // Assign keys to order items
      for (const [itemId, keyId] of Object.entries(selectedKeys)) {
        await supabase.from('license_keys').update({
          status: 'delivered',
          assigned_order_id: order.id,
        }).eq('id', keyId);
      }

      await updateStatus.mutateAsync({
        orderId: order.id,
        status,
        adminNotes,
      });

      // Create notification for customer
      if (status === 'delivered') {
        await supabase.from('notifications').insert({
          user_id: order.user_id,
          title: 'Your order has been delivered!',
          message: `Order #${order.id.slice(0, 8).toUpperCase()} has been processed. Check your license key in My Orders.`,
          type: 'order_delivered',
          read: false,
        });
      }

      toast.success('Order updated!');
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to update order');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl rounded-3xl border overflow-hidden max-h-[90vh] flex flex-col"
        style={{ background: '#12152A', borderColor: 'rgba(255,255,255,0.1)' }}
      >
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div>
            <h2 className="text-xl font-bold text-white">Order #{order.id.slice(0, 8).toUpperCase()}</h2>
            <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* Customer */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Customer</p>
            <p className="text-sm text-white">{(order as any).profile?.full_name || 'Unknown'}</p>
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>{(order as any).profile?.email}</p>
          </div>

          {/* Items */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.4)' }}>Items</p>
            <div className="space-y-2">
              {order.order_items?.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-2 border-b text-sm" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                  <span className="text-white/70">{item.product?.title}</span>
                  <span className="text-white">×{item.quantity} — {formatPrice(item.unit_price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3">
              <span className="text-sm font-bold text-white">Total</span>
              <span className="font-black gradient-text">{formatPrice(order.total_amount)}</span>
            </div>
          </div>

          {/* Customer Notes */}
          {order.notes && (
            <div className="p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>Customer Note</p>
              <p className="text-sm text-white/70">{order.notes}</p>
            </div>
          )}

          {/* Update Status */}
          <div className="space-y-4">
            <Select
              label="Update Status"
              value={status}
              onChange={(e) => setStatus(e.target.value as OrderStatus)}
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
            />
            <Textarea
              label="Admin Notes (visible to customer)"
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={3}
              placeholder="Add internal notes or customer-facing update..."
            />
          </div>

          <div className="flex gap-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
            <Button onClick={assignAndDeliver} isLoading={updateStatus.isPending} className="flex-1">
              Update Order
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function AdminOrders() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | undefined>();
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { data, isLoading } = useAdminOrders({ status: statusFilter });

  const filtered = data?.orders.filter((o) =>
    !search || o.id.toLowerCase().includes(search.toLowerCase()) || (o as any).profile?.email?.includes(search)
  );

  const statusFilters = [
    { value: undefined, label: 'All' },
    { value: 'pending' as OrderStatus, label: 'Pending' },
    { value: 'processing' as OrderStatus, label: 'Processing' },
    { value: 'delivered' as OrderStatus, label: 'Delivered' },
    { value: 'cancelled' as OrderStatus, label: 'Cancelled' },
  ];

  return (
    <>
      <Helmet><title>Orders — Admin</title></Helmet>

      <div className="space-y-6 max-w-7xl">
        <div>
          <h1 className="text-3xl font-black text-white">Orders</h1>
          <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {data?.total ?? 0} total orders
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="w-72">
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by order ID or email..."
              icon={<Search size={16} />}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {statusFilters.map(({ value, label }) => (
              <button
                key={label}
                onClick={() => setStatusFilter(value)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  statusFilter === value
                    ? 'text-white border-purple-500/40'
                    : 'text-white/50 border-white/10 hover:text-white'
                }`}
                style={statusFilter === value ? { background: 'rgba(108,71,255,0.15)' } : undefined}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <TableSkeleton rows={8} />
        ) : (
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                  {['Order ID', 'Customer', 'Items', 'Total', 'Status', 'Date', 'Actions'].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered?.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-white/2 transition-colors" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
                    <td className="px-4 py-3 font-mono text-sm text-purple-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm text-white">{(order as any).profile?.full_name || 'Unknown'}</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{(order as any).profile?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-white/60">{(order as any).order_items?.length ?? 0}</td>
                    <td className="px-4 py-3 text-sm font-bold text-white">{formatPrice(order.total_amount)}</td>
                    <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{formatDate(order.created_at)}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white/60 hover:text-white border border-white/10 hover:border-white/20 transition-all"
                      >
                        <Eye size={13} /> Manage
                      </button>
                    </td>
                  </tr>
                ))}
                {(!filtered || filtered.length === 0) && (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedOrder && (
        <OrderDetailModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </>
  );
}
