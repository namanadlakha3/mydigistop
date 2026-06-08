import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Heart, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { supabase } from '@/lib/supabase';
import { ProductCard } from '@/features/products/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';

export function WishlistPage() {
  const { user } = useAuth();

  const { data: wishlist, isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wishlist')
        .select('*, product:products(*, product_images(*), category:categories(*))')
        .eq('user_id', user!.id);
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  return (
    <>
      <Helmet><title>Wishlist — MyDigiStop</title></Helmet>

      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Heart size={24} style={{ color: '#6C47FF' }} />
          <div>
            <h1 className="text-3xl font-black text-white">Wishlist</h1>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {wishlist?.length ?? 0} saved products
            </p>
          </div>
        </div>

        {isLoading ? (
          <ProductGridSkeleton count={4} />
        ) : wishlist?.length === 0 ? (
          <div className="text-center py-20 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
            <Heart size={48} className="mx-auto mb-4" style={{ color: 'rgba(108,71,255,0.3)' }} />
            <h2 className="text-xl font-bold text-white mb-2">Nothing saved yet</h2>
            <p className="mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>Browse products and click the heart icon to save them</p>
            <Link to="/products"><Button>Explore Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist?.map((item: any, i: number) => (
              item.product && <ProductCard key={item.id} product={item.product} index={i} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
