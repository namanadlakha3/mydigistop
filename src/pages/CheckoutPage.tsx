import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, ArrowRight, Lock, Package, Trash2, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useCartStore } from '@/stores/cartStore';
import { useCreateOrder } from '@/hooks/useOrders';
import { useAuth } from '@/features/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Input';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export function CheckoutPage() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const { user, signInWithGoogle } = useAuth();
  const createOrder = useCreateOrder();
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState<string | null>(null);

  const total = getTotalPrice();

  const handleSubmit = async () => {
    if (!user) { toast.error('Please sign in to place an order'); return; }
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    try {
      const order = await createOrder.mutateAsync({
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          unit_price: item.product.sale_price ?? item.product.price,
        })),
        notes,
        totalAmount: total,
      });
      clearCart();
      setSuccess(order.id);
    } catch {
      toast.error('Failed to place order. Please try again.');
    }
  };

  if (success) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8"
            style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.2), rgba(0,194,203,0.2))', border: '2px solid rgba(16,185,129,0.3)' }}
          >
            <CheckCircle2 size={44} className="text-green-400" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3">Order Placed!</h1>
          <p className="mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Your order <span className="text-white font-mono font-semibold">#{success.slice(0, 8).toUpperCase()}</span> has been received.
          </p>
          <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Our team will process your order and deliver your license key to your dashboard within a few hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/dashboard/orders">
              <Button size="lg" className="gap-2">
                Track Order <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/products">
              <Button variant="outline" size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout — MyDigiStop</title>
      </Helmet>

      <div className="min-h-screen pt-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-10">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
            >
              <ShoppingCart size={20} className="text-white" />
            </div>
            <h1 className="text-3xl font-black text-white">Checkout</h1>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🛒</div>
              <h2 className="text-2xl font-bold text-white mb-2">Your cart is empty</h2>
              <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Add some products first</p>
              <Link to="/products"><Button size="lg">Browse Products</Button></Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Order Items */}
              <div className="lg:col-span-3 space-y-4">
                <h2 className="text-lg font-bold text-white mb-4">Order Summary</h2>
                {items.map((item) => {
                  const price = item.product.sale_price ?? item.product.price;
                  const image = item.product.product_images?.[0]?.image_url;
                  return (
                    <motion.div
                      key={item.product.id}
                      layout
                      className="flex gap-4 p-4 rounded-2xl border"
                      style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                    >
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        {image ? (
                          <img src={image} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={20} style={{ color: 'rgba(108,71,255,0.4)' }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">{item.product.title}</p>
                        <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                          {formatPrice(price)} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-white">{formatPrice(price * item.quantity)}</p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Notes */}
                <div className="mt-6">
                  <Textarea
                    label="Order Notes (optional)"
                    placeholder="Any special requirements or messages for our team..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              {/* Order Totals */}
              <div className="lg:col-span-2">
                <div className="p-6 rounded-2xl border sticky top-24" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <h2 className="text-lg font-bold text-white mb-6">Payment Summary</h2>

                  <div className="space-y-3 mb-6">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between text-sm">
                        <span style={{ color: 'rgba(255,255,255,0.55)' }} className="truncate max-w-36">
                          {item.product.title} ×{item.quantity}
                        </span>
                        <span className="text-white font-medium ml-2">
                          {formatPrice((item.product.sale_price ?? item.product.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-6" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                    <div className="flex justify-between">
                      <span className="font-semibold text-white">Total</span>
                      <span className="text-2xl font-black gradient-text">{formatPrice(total)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs mb-6 p-3 rounded-xl" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.15)', color: 'rgba(16,185,129,0.9)' }}>
                    <Lock size={12} />
                    No payment required now. Keys delivered after verification.
                  </div>

                  {!user ? (
                    <Button onClick={signInWithGoogle} size="lg" className="w-full gap-2">
                      Sign in to Place Order
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmit}
                      isLoading={createOrder.isPending}
                      size="lg"
                      className="w-full gap-2"
                    >
                      Place Order <ArrowRight size={18} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
