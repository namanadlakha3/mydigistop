import { useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import { useProducts, useCategories } from '@/hooks/useProducts';
import { ProductCard } from '@/features/products/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Input } from '@/components/ui/Input';
import type { ProductFilters } from '@/types';
import { useEffect } from 'react';

const sortOptions = [
  { value: 'newest',    label: 'Newest First'       },
  { value: 'featured',  label: 'Featured'            },
  { value: 'price_asc', label: 'Price: Low to High'  },
  { value: 'price_desc',label: 'Price: High to Low'  },
];

export function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [filterOpen, setFilterOpen] = useState(false);

  const currentPage = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || '';
  const sortBy = (searchParams.get('sort') || 'newest') as ProductFilters['sortBy'];
  const search = searchParams.get('search') || '';
  const PAGE_SIZE = 12;

  const filters: ProductFilters = {
    search: search || undefined,
    category: category || undefined,
    sortBy,
    page: currentPage,
    pageSize: PAGE_SIZE,
  };

  const { data, isLoading } = useProducts(filters);
  const { data: categories } = useCategories();

  const totalPages = data ? Math.ceil(data.total / PAGE_SIZE) : 1;

  const updateParam = useCallback((key: string, value: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (value) next.set(key, value); else next.delete(key);
      next.set('page', '1');
      return next;
    });
  }, [setSearchParams]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => updateParam('search', searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput, updateParam]);

  return (
    <>
      <Helmet>
        <title>Products — MyDigiStop</title>
        <meta name="description" content="Browse our catalog of genuine digital license keys for Windows, Office, Antivirus, and more." />
      </Helmet>

      <div className="min-h-screen bg-slate-50">
        {/* Header */}
        <div className="pt-28 pb-12 border-b border-slate-200 bg-white">
          <div className="max-w-[1200px] mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Catalog</p>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-1.5">All Products</h1>
              <p className="text-sm text-slate-500">{data?.total ?? 0} products available — all genuine, all guaranteed</p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1200px] mx-auto px-6 py-10">
          {/* Search & Filter Bar */}
          <div className="flex flex-wrap gap-4 mb-8">
            <div className="flex-1 min-w-64">
              <Input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                icon={<Search size={16} />}
                className="h-11"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="h-11 px-4 rounded-xl text-sm text-slate-700 border border-slate-300 bg-white focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 h-11 px-4 rounded-xl text-sm font-medium border transition-all ${
                filterOpen || category
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                  : 'border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filters
              {category && <span className="w-2 h-2 rounded-full bg-indigo-500" />}
            </button>
          </div>

          {/* Category Filters */}
          {filterOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wider mb-4 text-slate-400">
                  Filter by Category
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => updateParam('category', '')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                      !category
                        ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                        : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white'
                    }`}
                  >
                    All
                  </button>
                  {categories?.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => updateParam('category', cat.slug)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
                        category === cat.slug
                          ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                          : 'border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 bg-white'
                      }`}
                    >
                      {cat.icon} {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Active Filters */}
          {(search || category) && (
            <div className="flex flex-wrap gap-2 mb-6">
              {search && (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-indigo-50 border border-indigo-200 text-indigo-700">
                  Search: "{search}"
                  <button onClick={() => { setSearchInput(''); updateParam('search', ''); }} className="hover:text-indigo-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {category && (
                <span className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs bg-sky-50 border border-sky-200 text-sky-700">
                  Category: {category}
                  <button onClick={() => updateParam('category', '')} className="hover:text-sky-900">
                    <X size={12} />
                  </button>
                </span>
              )}
            </div>
          )}

          {/* Products Grid */}
          {isLoading ? (
            <ProductGridSkeleton count={PAGE_SIZE} />
          ) : data?.products.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No products found</h3>
              <p className="text-slate-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data?.products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-12">
              <button
                onClick={() => updateParam('page', String(currentPage - 1))}
                disabled={currentPage <= 1}
                className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-all bg-white"
              >
                <ChevronLeft size={18} />
              </button>

              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => updateParam('page', String(page))}
                    className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all ${
                      currentPage === page
                        ? 'text-white shadow-sm'
                        : 'border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 bg-white'
                    }`}
                    style={currentPage === page ? { background: 'linear-gradient(135deg, #4F46E5, #7C3AED)' } : undefined}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => updateParam('page', String(currentPage + 1))}
                disabled={currentPage >= totalPages}
                className="p-2.5 rounded-xl border border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 transition-all bg-white"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
