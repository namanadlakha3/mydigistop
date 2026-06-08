import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Package, Key, Copy, CheckCircle2, Clock, Info } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useOrder } from '@/hooks/useOrders';
import { OrderStatusBadge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatDate, formatPrice } from '@/lib/utils';
import { useState } from 'react';
import { toast } from 'sonner';

export function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useOrder(id!);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success('License key copied!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-white">Order not found</p>
        <Link to="/dashboard/orders" className="text-purple-400 mt-2 block">← Back to orders</Link>
      </div>
    );
  }

  const statusMessages = {
    pending: 'Your order has been received and is awaiting review.',
    processing: 'We\'re preparing your license key. This usually takes 1-4 hours.',
    delivered: 'Your license key has been delivered! Check below.',
    cancelled: 'This order was cancelled.',
  };

  return (
    <>
      <Helmet><title>Order #{id?.slice(0, 8).toUpperCase()} — MyDigiStop</title></Helmet>

      <div className="space-y-6">
        {/* Back */}
        <Link to="/dashboard/orders" className="flex items-center gap-2 text-sm text-white/50 hover:text-white transition-colors">
          <ChevronLeft size={16} /> Back to Orders
        </Link>

        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-black text-white">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Placed on {formatDate(order.created_at)}
            </p>
          </div>
          <OrderStatusBadge status={order.status} />
        </div>

        {/* Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 rounded-2xl border"
          style={{
            background: order.status === 'delivered' ? 'rgba(16,185,129,0.08)' : 'rgba(108,71,255,0.08)',
            borderColor: order.status === 'delivered' ? 'rgba(16,185,129,0.2)' : 'rgba(108,71,255,0.2)',
          }}
        >
          {order.status === 'delivered' ? (
            <CheckCircle2 size={18} className="text-green-400 shrink-0 mt-0.5" />
          ) : (
            <Clock size={18} style={{ color: '#6C47FF', flexShrink: 0, marginTop: '2px' }} />
          )}
          <div>
            <p className="text-sm font-semibold text-white">{statusMessages[order.status]}</p>
            {order.admin_notes && (
              <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Admin note: {order.admin_notes}
              </p>
            )}
          </div>
        </motion.div>

        {/* Order Items */}
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Ordered Products</h2>
          <div className="space-y-3">
            {order.order_items?.map((item) => {
              const image = item.product?.product_images?.[0]?.image_url;
              const keys = item.license_keys?.filter((k) => k.status !== 'unused') ?? [];

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                      {image ? (
                        <img src={image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={20} style={{ color: 'rgba(108,71,255,0.4)' }} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-white">{item.product?.title}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        <span>Qty: {item.quantity}</span>
                        <span>Unit: {formatPrice(item.unit_price)}</span>
                        <span className="font-semibold text-white">Total: {formatPrice(item.unit_price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>

                  {/* License Keys */}
                  {order.status === 'delivered' && keys.length > 0 && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                      <div className="flex items-center gap-2 mb-3">
                        <Key size={14} style={{ color: '#6C47FF' }} />
                        <p className="text-sm font-semibold text-white">Your License Key(s)</p>
                      </div>
                      {keys.map((key) => (
                        <div
                          key={key.id}
                          className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl font-mono text-sm"
                          style={{ background: 'rgba(108,71,255,0.08)', border: '1px solid rgba(108,71,255,0.2)' }}
                        >
                          <span className="text-purple-300 truncate">{key.key_value}</span>
                          <button
                            onClick={() => copyKey(key.key_value)}
                            className="shrink-0 p-1.5 rounded-lg hover:bg-white/10 transition-all"
                          >
                            {copiedKey === key.key_value ? (
                              <CheckCircle2 size={15} className="text-green-400" />
                            ) : (
                              <Copy size={15} style={{ color: 'rgba(255,255,255,0.5)' }} />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="p-4 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Info size={14} style={{ color: 'rgba(255,255,255,0.5)' }} />
              <p className="text-sm font-semibold text-white">Order Notes</p>
            </div>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{order.notes}</p>
          </div>
        )}

        {/* Total */}
        <div className="flex justify-end">
          <div className="p-4 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-8">
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>Order Total</span>
              <span className="text-2xl font-black gradient-text">{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
