import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Star, Package } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, getDiscountPercentage, truncate } from '@/lib/utils';
import { useCartStore } from '@/stores/cartStore';
import { Badge, SaleBadge, FeaturedBadge, InventoryBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { useAuth } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const [wishlisted, setWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const displayPrice = product.sale_price ?? product.price;
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const discountPct = hasDiscount ? getDiscountPercentage(product.price, product.sale_price!) : 0;
  const mainImage = product.product_images?.[0]?.image_url;
  const isOutOfStock = product.inventory === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isOutOfStock) return;
    setIsAddingToCart(true);
    addItem(product);
    toast.success(`${product.title} added to cart`);
    setTimeout(() => setIsAddingToCart(false), 800);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { toast.error('Sign in to save to wishlist'); return; }
    setWishlisted(!wishlisted);
    if (!wishlisted) {
      await supabase.from('wishlist').insert({ user_id: user.id, product_id: product.id });
      toast.success('Added to wishlist');
    } else {
      await supabase.from('wishlist').delete().eq('user_id', user.id).eq('product_id', product.id);
      toast.success('Removed from wishlist');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Link to={`/products/${product.slug}`} className="block group">
        <div
          className="overflow-hidden rounded-2xl border transition-all duration-300"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
            borderColor: 'rgba(255,255,255,0.08)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(108, 71, 255, 0.3)';
            e.currentTarget.style.boxShadow = '0 20px 60px rgba(108, 71, 255, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {/* Image */}
          <div className="relative overflow-hidden" style={{ height: '200px', background: 'rgba(255,255,255,0.03)' }}>
            {mainImage ? (
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package size={48} style={{ color: 'rgba(108,71,255,0.3)' }} />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.featured && <FeaturedBadge />}
              {hasDiscount && <SaleBadge percentage={discountPct} />}
            </div>

            {/* Wishlist Button */}
            <button
              onClick={handleWishlist}
              className="absolute top-3 right-3 p-2 rounded-xl glass opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white/10"
            >
              <Heart
                size={16}
                className={wishlisted ? 'text-red-400 fill-red-400' : 'text-white/70'}
              />
            </button>

            {isOutOfStock && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <span className="text-sm font-semibold text-white/70 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            {product.category && (
              <span className="text-xs font-medium mb-2 block" style={{ color: 'rgba(108,71,255,0.8)' }}>
                {product.category.name}
              </span>
            )}
            <h3 className="font-semibold text-white text-sm leading-snug mb-2 group-hover:text-purple-300 transition-colors">
              {truncate(product.title, 60)}
            </h3>

            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
              ))}
              <span className="text-xs ml-1" style={{ color: 'rgba(255,255,255,0.4)' }}>(4.8)</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-white">{formatPrice(displayPrice)}</span>
                  {hasDiscount && (
                    <span className="text-sm line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>
                <InventoryBadge count={product.inventory} />
              </div>

              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAddingToCart}
                className="shrink-0 gap-1.5"
              >
                <ShoppingCart size={14} />
                {isAddingToCart ? 'Added!' : 'Add'}
              </Button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
