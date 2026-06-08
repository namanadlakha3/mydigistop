import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Order, OrderStatus } from '@/types';
import { useAuth } from '@/features/auth/AuthProvider';

export const orderKeys = {
  all: ['orders'] as const,
  mine: (userId: string) => ['orders', 'mine', userId] as const,
  detail: (id: string) => ['orders', 'detail', id] as const,
  admin: (filters?: Record<string, unknown>) => ['orders', 'admin', filters] as const,
};

export function useMyOrders() {
  const { user } = useAuth();
  return useQuery({
    queryKey: orderKeys.mine(user?.id ?? ''),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(title, product_images(*)))')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Order[];
    },
    enabled: !!user,
  });
}

export function useOrder(id: string) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(*, product_images(*)),
            license_keys(*)
          )
        `)
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Order;
    },
    enabled: !!id,
  });
}

export function useAdminOrders(filters?: { status?: OrderStatus; search?: string }) {
  return useQuery({
    queryKey: orderKeys.admin(filters),
    queryFn: async () => {
      let query = supabase
        .from('orders')
        .select(`
          *,
          profile:profiles(full_name, email, avatar_url),
          order_items(*, product:products(title))
        `, { count: 'exact' })
        .order('created_at', { ascending: false });

      if (filters?.status) query = query.eq('status', filters.status);

      const { data, error, count } = await query;
      if (error) throw error;
      return { orders: data as Order[], total: count ?? 0 };
    },
  });
}

export function useCreateOrder() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async ({
      items,
      notes,
      totalAmount,
    }: {
      items: { product_id: string; quantity: number; unit_price: number }[];
      notes?: string;
      totalAmount: number;
    }) => {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({ user_id: user!.id, status: 'pending', total_amount: totalAmount, notes })
        .select()
        .single();
      if (orderError) throw orderError;

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items.map((item) => ({ ...item, order_id: order.id })));
      if (itemsError) throw itemsError;

      return order as Order;
    },
    onSuccess: (_, _vars, _ctx) => {
      if (user) qc.invalidateQueries({ queryKey: orderKeys.mine(user.id) });
    },
  });
}

export function useUpdateOrderStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      orderId,
      status,
      adminNotes,
    }: {
      orderId: string;
      status: OrderStatus;
      adminNotes?: string;
    }) => {
      const { data, error } = await supabase
        .from('orders')
        .update({ status, admin_notes: adminNotes })
        .eq('id', orderId)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}
