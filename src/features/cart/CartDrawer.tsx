import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/stores/cartStore';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Package } from 'lucide-react';

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice, getTotalItems } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col border-l"
            style={{
              background: 'linear-gradient(160deg, #12152A 0%, #0A0B14 100%)',
              borderColor: 'rgba(255,255,255,0.08)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
                >
                  <ShoppingCart size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Your Cart</h2>
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <AnimatePresence>
                {items.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center h-full gap-4 text-center"
                  >
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{ background: 'rgba(108,71,255,0.1)', border: '1px solid rgba(108,71,255,0.2)' }}
                    >
                      <Package size={32} style={{ color: 'rgba(108,71,255,0.6)' }} />
                    </div>
                    <div>
                      <p className="font-semibold text-white mb-1">Your cart is empty</p>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                        Browse our products and add them here
                      </p>
                    </div>
                    <Link to="/products" onClick={closeCart}>
                      <Button size="md">Browse Products</Button>
                    </Link>
                  </motion.div>
                ) : (
                  items.map((item) => {
                    const price = item.product.sale_price ?? item.product.price;
                    const image = item.product.product_images?.[0]?.image_url;
                    return (
                      <motion.div
                        key={item.product.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex gap-4 p-4 rounded-2xl border"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          borderColor: 'rgba(255,255,255,0.07)',
                        }}
                      >
                        <div
                          className="w-16 h-16 rounded-xl overflow-hidden shrink-0"
                          style={{ background: 'rgba(255,255,255,0.05)' }}
                        >
                          {image ? (
                            <img src={image} alt={item.product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} style={{ color: 'rgba(108,71,255,0.4)' }} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white leading-snug truncate mb-1">
                            {item.product.title}
                          </p>
                          <p className="text-base font-bold" style={{ color: '#6C47FF' }}>
                            {formatPrice(price * item.quantity)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-6 text-center text-sm font-semibold text-white">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.inventory}
                                className="w-6 h-6 rounded-lg flex items-center justify-center text-white/50 hover:text-white hover:bg-white/8 transition-all disabled:opacity-30"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 rounded-lg text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Total</span>
                  <span className="text-xl font-bold text-white">{formatPrice(getTotalPrice())}</span>
                </div>
                <Link to="/checkout" onClick={closeCart}>
                  <Button size="lg" className="w-full gap-2">
                    Proceed to Checkout <ArrowRight size={18} />
                  </Button>
                </Link>
                <p className="text-center text-xs mt-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  License keys delivered after manual verification
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
