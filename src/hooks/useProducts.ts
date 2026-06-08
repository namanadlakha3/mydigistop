import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Product, ProductFilters } from '@/types';

export const productKeys = {
  all: ['products'] as const,
  list: (filters?: ProductFilters) => [...productKeys.all, 'list', filters] as const,
  detail: (slug: string) => [...productKeys.all, 'detail', slug] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
};

async function fetchProducts(filters: ProductFilters = {}) {
  const { search, category, sortBy = 'newest', featured, page = 1, pageSize = 12 } = filters;

  let categoryId: string | undefined;
  if (category) {
    const { data: cat } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', category)
      .single();
    categoryId = cat?.id;
  }

  let query = supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)', { count: 'exact' })
    .eq('status', 'active');

  if (search) query = query.ilike('title', `%${search}%`);
  if (categoryId) query = query.eq('category_id', categoryId);
  if (featured) query = query.eq('featured', true);

  switch (sortBy) {
    case 'price_asc': query = query.order('price', { ascending: true }); break;
    case 'price_desc': query = query.order('price', { ascending: false }); break;
    case 'featured': query = query.order('featured', { ascending: false }); break;
    default: query = query.order('created_at', { ascending: false });
  }

  const from = (page - 1) * pageSize;
  query = query.range(from, from + pageSize - 1);

  const { data, error, count } = await query;
  if (error) throw error;
  return { products: data as Product[], total: count ?? 0 };
}

async function fetchProductBySlug(slug: string) {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*), product_images(*)')
    .eq('slug', slug)
    .eq('status', 'active')
    .single();
  if (error) throw error;
  return data as Product;
}

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => fetchProducts({ featured: true, pageSize: 8 }),
  });
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: productKeys.detail(slug),
    queryFn: () => fetchProductBySlug(slug),
    enabled: !!slug,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase.from('categories').select('*').order('name');
      if (error) throw error;
      return data;
    },
  });
}

// Admin mutations
export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: Partial<Product>) => {
      const { data, error } = await supabase.from('products').insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...product }: Partial<Product> & { id: string }) => {
      const { data, error } = await supabase.from('products').update(product).eq('id', id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.all }),
  });
}

export function useAdminProducts(filters?: Partial<ProductFilters>) {
  return useQuery({
    queryKey: [...productKeys.all, 'admin', filters],
    queryFn: async () => {
      let query = supabase
        .from('products')
        .select('*, category:categories(*), product_images(*)', { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.search) query = query.ilike('title', `%${filters.search}%`);
      if (filters?.category) query = query.eq('category_id', filters.category);

      const { data, error, count } = await query;
      if (error) throw error;
      return { products: data as Product[], total: count ?? 0 };
    },
  });
}
