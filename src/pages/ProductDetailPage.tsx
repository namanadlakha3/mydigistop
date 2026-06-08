import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShoppingCart, Heart, Star, Shield, Zap, CheckCircle2,
  ChevronLeft, Package, Info, Key, ArrowRight
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProduct, useProducts } from '@/hooks/useProducts';
import { useCartStore } from '@/stores/cartStore';
import { useAuth } from '@/features/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { Badge, InventoryBadge, SaleBadge } from '@/components/ui/Badge';
import { ProductCard } from '@/features/products/ProductCard';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, getDiscountPercentage } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

const tabs = ['Overview', 'Features', 'Activation'];

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: product, isLoading, error } = useProduct(slug!);
  const { data: related } = useProducts({ category: product?.category?.slug, pageSize: 4 });
  const { addItem } = useCartStore();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('Overview');
  const [activeImage, setActiveImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            <Skeleton className="w-full h-80 rounded-2xl" />
            <div className="flex gap-3">
              {[...Array(3)].map((_, i) => <Skeleton key={i} className="w-20 h-20 rounded-xl" />)}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-white mb-2">Product not found</h2>
          <Link to="/products" className="text-purple-400 hover:text-purple-300">Browse all products</Link>
        </div>
      </div>
    );
  }

  const images = product.product_images ?? [];
  const hasDiscount = product.sale_price !== null && product.sale_price < product.price;
  const displayPrice = product.sale_price ?? product.price;
  const discountPct = hasDiscount ? getDiscountPercentage(product.price, product.sale_price!) : 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) addItem(product);
    toast.success(`${product.title} added to cart`);
  };

  const handleWishlist = async () => {
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
    <>
      <Helmet>
        <title>{product.title} — MyDigiStop</title>
        <meta name="description" content={product.description?.slice(0, 160) || `Buy ${product.title} license key at MyDigiStop`} />
      </Helmet>

      <div className="min-h-screen pt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <Link to="/products" className="flex items-center gap-1.5 hover:text-white transition-colors">
              <ChevronLeft size={15} /> Products
            </Link>
            {product.category && (
              <>
                <span>/</span>
                <Link to={`/products?category=${product.category.slug}`} className="hover:text-white transition-colors">
                  {product.category.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-white/70 truncate max-w-48">{product.title}</span>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Images */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <div
                className="relative rounded-2xl overflow-hidden mb-4 border"
                style={{ height: '380px', background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
              >
                {images[activeImage] ? (
                  <img
                    src={images[activeImage].image_url}
                    alt={product.title}
                    className="w-full h-full object-contain p-6"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package size={80} style={{ color: 'rgba(108,71,255,0.3)' }} />
                  </div>
                )}
                {hasDiscount && (
                  <div className="absolute top-4 left-4">
                    <SaleBadge percentage={discountPct} />
                  </div>
                )}
              </div>

              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {images.map((img, i) => (
                    <button
                      key={img.id}
                      onClick={() => setActiveImage(i)}
                      className={`shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                        activeImage === i ? 'border-purple-500' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              {product.category && (
                <Badge variant="purple">{product.category.name}</Badge>
              )}

              <h1 className="text-3xl font-black text-white leading-tight">{product.title}</h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>4.8 (120 reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-black text-white">{formatPrice(displayPrice)}</span>
                {hasDiscount && (
                  <span className="text-xl line-through" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    {formatPrice(product.price)}
                  </span>
                )}
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400">
                  <Shield size={12} /> Genuine Key
                </div>
                <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-blue-500/20 bg-blue-500/5 text-blue-400">
                  <Zap size={12} /> Fast Delivery
                </div>
                <InventoryBadge count={product.inventory} />
              </div>

              {/* Quantity & Actions */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-0 rounded-xl border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all font-bold"
                  >
                    −
                  </button>
                  <span className="px-4 py-3 text-white font-semibold min-w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.inventory, quantity + 1))}
                    className="px-4 py-3 text-white/60 hover:text-white hover:bg-white/5 transition-all font-bold"
                  >
                    +
                  </button>
                </div>

                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={product.inventory === 0}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart size={18} />
                  {product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlist}
                  className="h-12 w-12"
                >
                  <Heart size={18} className={wishlisted ? 'fill-red-400 text-red-400' : ''} />
                </Button>
              </div>

              {/* Info */}
              <div className="space-y-3 pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
                {[
                  { label: 'Brand', value: product.brand || 'N/A' },
                  { label: 'SKU', value: product.sku || 'N/A' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center gap-2 text-sm">
                    <span style={{ color: 'rgba(255,255,255,0.4)' }}>{label}:</span>
                    <span className="text-white/70 font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <div className="flex gap-1 p-1 rounded-2xl w-fit mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeTab === tab ? 'text-white' : 'text-white/50 hover:text-white'
                  }`}
                  style={activeTab === tab ? { background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' } : undefined}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="p-6 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
              {activeTab === 'Overview' && (
                <div className="prose prose-invert max-w-none text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  {product.description || 'No description available.'}
                </div>
              )}
              {activeTab === 'Features' && (
                <ul className="space-y-3">
                  {(product.description || '').split('\n').filter(Boolean).map((line, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                      <CheckCircle2 size={16} className="text-green-400 shrink-0 mt-0.5" />
                      {line}
                    </li>
                  ))}
                  {!product.description && (
                    <p style={{ color: 'rgba(255,255,255,0.4)' }}>No features listed.</p>
                  )}
                </ul>
              )}
              {activeTab === 'Activation' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Key size={18} style={{ color: '#6C47FF' }} />
                    <h3 className="font-semibold text-white">Activation Instructions</h3>
                  </div>
                  <div
                    className="text-sm leading-relaxed whitespace-pre-wrap"
                    style={{ color: 'rgba(255,255,255,0.7)' }}
                  >
                    {product.activation_instructions || 'Activation instructions will be provided with your license key.'}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {related && related.products.length > 0 && (
            <div className="mt-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Related Products</h2>
                <Link to="/products" className="flex items-center gap-1 text-sm text-purple-400 hover:text-purple-300">
                  View All <ArrowRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {related.products.slice(0, 4).map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
