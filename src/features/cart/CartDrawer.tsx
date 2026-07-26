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
            className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col border-l border-slate-200 bg-white shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' }}
                >
                  <ShoppingCart size={16} className="text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Your Cart</h2>
                  <p className="text-xs text-slate-500">
                    {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all border-none bg-transparent cursor-pointer"
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
                    <div className="w-20 h-20 rounded-2xl flex items-center justify-center bg-indigo-50 border border-indigo-200">
                      <Package size={32} className="text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 mb-1">Your cart is empty</p>
                      <p className="text-sm text-slate-500">
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
                        className="flex gap-4 p-4 rounded-2xl border border-slate-200 bg-white hover:shadow-sm transition-shadow"
                      >
                        <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          {image ? (
                            <img src={image} alt={item.product.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package size={20} className="text-indigo-300" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 leading-snug truncate mb-1">
                            {item.product.title}
                          </p>
                          <p className="text-base font-bold text-indigo-600">
                            {formatPrice(price * item.quantity)}
                          </p>

                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-1 border border-slate-200 rounded-lg overflow-hidden">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all border-none bg-transparent cursor-pointer"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-7 text-center text-sm font-semibold text-slate-800">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                disabled={item.quantity >= item.product.inventory}
                                className="w-7 h-7 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all disabled:opacity-30 border-none bg-transparent cursor-pointer"
                              >
                                <Plus size={12} />
                              </button>
                            </div>

                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-all border-none bg-transparent cursor-pointer"
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
              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-slate-600">Total</span>
                  <span className="text-xl font-bold text-slate-900">{formatPrice(getTotalPrice())}</span>
                </div>
                <Link to="/checkout" onClick={closeCart}>
                  <Button size="lg" className="w-full gap-2">
                    Proceed to Checkout <ArrowRight size={18} />
                  </Button>
                </Link>
                <p className="text-center text-xs mt-3 text-slate-400">
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
