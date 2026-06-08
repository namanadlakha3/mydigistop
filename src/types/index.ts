// ===== Database Types =====

export type UserRole = 'customer' | 'admin';
export type ProductStatus = 'active' | 'inactive' | 'draft';
export type OrderStatus = 'pending' | 'processing' | 'delivered' | 'cancelled';
export type KeyStatus = 'unused' | 'assigned' | 'delivered';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  is_suspended: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  brand: string | null;
  sku: string | null;
  price: number;
  sale_price: number | null;
  inventory: number;
  activation_instructions: string | null;
  featured: boolean;
  status: ProductStatus;
  created_at: string;
  // Relations
  category?: Category;
  product_images?: ProductImage[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export interface LicenseKey {
  id: string;
  product_id: string;
  key_value: string;
  status: KeyStatus;
  assigned_order_id: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  total_amount: number;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  // Relations
  order_items?: OrderItem[];
  profile?: Profile;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  // Relations
  product?: Product;
  license_keys?: LicenseKey[];
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
  product?: Product;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'order_created' | 'order_delivered' | 'inventory_low' | 'new_customer' | 'general';
  read: boolean;
  created_at: string;
}

export interface AdminLog {
  id: string;
  admin_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ===== UI / App Types =====

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'newest' | 'featured';
  featured?: boolean;
  page?: number;
  pageSize?: number;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalCustomers: number;
  totalRevenue: number;
  pendingOrders: number;
  lowInventoryProducts: number;
}
