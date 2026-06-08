import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, getDiscountPercentage, truncate } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function ProductCard({ product, index = 0 }: { product: Product; index?: number }) {
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [hovered, setHovered] = useState(false);

  const displayPrice = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const discountPct = hasDiscount ? getDiscountPercentage(product.price, product.sale_price!) : 0;
  const mainImage = product.product_images?.[0]?.image_url;
  const isOutOfStock = product.inventory === 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock || adding) return;
    setAdding(true);
    addItem(product);
    toast.success('Added to cart');
    setTimeout(() => setAdding(false), 900);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to save items'); return; }
    const next = !wishlisted;
    setWishlisted(next);
    if (next) {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id });
      toast.success('Saved to wishlist');
    } else {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.38, delay: index * 0.04, ease: 'easeOut' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block no-underline group">
        <div
          className="rounded-2xl overflow-hidden border transition-all duration-250"
          style={{
            background: hovered ? '#1E2438' : '#161B27',
            borderColor: hovered ? 'rgba(124,95,255,0.32)' : 'rgba(255,255,255,0.09)',
            boxShadow: hovered ? '0 12px 40px rgba(124,95,255,0.12)' : 'none',
            transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
          }}
        >
          {/* ── Image ── */}
          <div className="relative overflow-hidden" style={{ height: 176 }}>
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500"
                style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2.5"
                style={{ background: 'linear-gradient(145deg, rgba(124,95,255,0.07), rgba(34,211,238,0.04))' }}>
                <div className="w-12 h-12 rounded-[14px] flex items-center justify-center border border-[#7C5FFF]/20 bg-[#7C5FFF]/10">
                  <Package size={22} className="text-[#9D86FF]/60" />
                </div>
                {product.category && (
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-white/20">
                    {product.category.name}
                  </span>
                )}
              </div>
            )}

            {/* Discount badge */}
            {hasDiscount && (
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-[6px] text-[11px] font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}>
                -{discountPct}%
              </span>
            )}

            {/* Wishlist btn */}
            <button
              onClick={handleWishlist}
              className="absolute top-2.5 right-2.5 w-8 h-8 rounded-[8px] flex items-center justify-center border border-white/10 cursor-pointer bg-transparent transition-opacity duration-200"
              style={{
                background: 'rgba(15,17,23,0.75)',
                backdropFilter: 'blur(8px)',
                opacity: hovered ? 1 : 0,
              }}
            >
              <Heart size={13} className={wishlisted ? 'text-rose-400 fill-rose-400' : 'text-white/60'} />
            </button>

            {/* Out of stock */}
            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(15,17,23,0.7)', backdropFilter: 'blur(4px)' }}>
                <span className="text-xs font-semibold text-white/50 px-3 py-1.5 rounded-full border border-white/12">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* ── Content ── */}
          <div className="p-4 pb-4">
            {product.category && (
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-[#9D86FF]/80">
                {product.category.name}
              </p>
            )}

            <h3
              className="text-[13px] font-semibold leading-snug mb-3.5 transition-colors duration-150"
              style={{ color: hovered ? '#C4B5FD' : '#CDD5E0', minHeight: '2.5rem' }}
            >
              {truncate(product.title, 58)}
            </h3>

            <div className="flex items-center justify-between gap-2">
              <div className="flex items-baseline gap-1.5">
                <span className="text-[16px] font-extrabold text-white">{formatPrice(displayPrice)}</span>
                {hasDiscount && (
                  <span className="text-xs text-white/28 line-through">{formatPrice(product.price)}</span>
                )}
              </div>

              <button
                onClick={handleAdd}
                disabled={isOutOfStock || adding}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 shrink-0 cursor-pointer"
                style={{
                  background: adding ? 'rgba(34,211,238,0.1)' : 'rgba(124,95,255,0.12)',
                  border: `1px solid ${adding ? 'rgba(34,211,238,0.28)' : 'rgba(124,95,255,0.28)'}`,
                  color: adding ? '#22D3EE' : '#B8A5FF',
                  opacity: isOutOfStock ? 0.4 : 1,
                  cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                }}
              >
                <ShoppingCart size={11} />
                {adding ? 'Added!' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
