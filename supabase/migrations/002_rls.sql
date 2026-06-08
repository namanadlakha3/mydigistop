-- =====================================================
-- MyDigiStop — Row Level Security (RLS) Policies
-- Run AFTER 001_schema.sql
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE license_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- Helper function: check if current user is admin
-- =====================================================
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
    AND is_suspended = false
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================
-- Users can read their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (id = auth.uid());

-- Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid() AND role = (SELECT role FROM profiles WHERE id = auth.uid()));

-- Admins can read all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (is_admin());

-- Admins can update all profiles
CREATE POLICY "Admins can update all profiles"
  ON profiles FOR UPDATE
  USING (is_admin());

-- Allow profile creation on sign up (via trigger / upsert)
CREATE POLICY "Enable insert for authenticated users"
  ON profiles FOR INSERT
  WITH CHECK (id = auth.uid());

-- =====================================================
-- CATEGORIES POLICIES
-- =====================================================
-- Anyone can read categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

-- Only admins can manage categories
CREATE POLICY "Admins can manage categories"
  ON categories FOR ALL
  USING (is_admin());

-- =====================================================
-- PRODUCTS POLICIES
-- =====================================================
-- Anyone can read active products
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (status = 'active' OR is_admin());

-- Only admins can insert/update/delete products
CREATE POLICY "Admins can manage products"
  ON products FOR ALL
  USING (is_admin());

-- =====================================================
-- PRODUCT IMAGES POLICIES
-- =====================================================
CREATE POLICY "Anyone can view product images"
  ON product_images FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage product images"
  ON product_images FOR ALL
  USING (is_admin());

-- =====================================================
-- LICENSE KEYS POLICIES
-- =====================================================
-- Customers can only see keys delivered to their orders
CREATE POLICY "Customers see their own delivered keys"
  ON license_keys FOR SELECT
  USING (
    assigned_order_id IN (
      SELECT id FROM orders WHERE user_id = auth.uid()
    )
    AND status = 'delivered'
  );

-- Admins can see and manage all keys
CREATE POLICY "Admins can manage all license keys"
  ON license_keys FOR ALL
  USING (is_admin());

-- =====================================================
-- ORDERS POLICIES
-- =====================================================
-- Customers can view their own orders
CREATE POLICY "Customers can view own orders"
  ON orders FOR SELECT
  USING (user_id = auth.uid());

-- Customers can create orders
CREATE POLICY "Customers can create orders"
  ON orders FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can view and update all orders
CREATE POLICY "Admins can manage all orders"
  ON orders FOR ALL
  USING (is_admin());

-- =====================================================
-- ORDER ITEMS POLICIES
-- =====================================================
-- Customers can view items from their own orders
CREATE POLICY "Customers can view own order items"
  ON order_items FOR SELECT
  USING (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Customers can insert order items
CREATE POLICY "Customers can create order items"
  ON order_items FOR INSERT
  WITH CHECK (
    order_id IN (SELECT id FROM orders WHERE user_id = auth.uid())
  );

-- Admins can manage all order items
CREATE POLICY "Admins can manage all order items"
  ON order_items FOR ALL
  USING (is_admin());

-- =====================================================
-- WISHLIST POLICIES
-- =====================================================
CREATE POLICY "Users manage own wishlist"
  ON wishlist FOR ALL
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all wishlists"
  ON wishlist FOR SELECT
  USING (is_admin());

-- =====================================================
-- NOTIFICATIONS POLICIES
-- =====================================================
CREATE POLICY "Users can view own notifications"
  ON notifications FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
  ON notifications FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all notifications"
  ON notifications FOR ALL
  USING (is_admin());

-- =====================================================
-- ADMIN LOGS POLICIES
-- =====================================================
CREATE POLICY "Admins can manage admin logs"
  ON admin_logs FOR ALL
  USING (is_admin());

-- =====================================================
-- STORAGE POLICIES
-- Create a bucket called 'product-images' in Supabase Storage first
-- =====================================================
-- Run these separately after creating the bucket:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Allow public read access to product images
-- CREATE POLICY "Public read product images"
--   ON storage.objects FOR SELECT
--   USING (bucket_id = 'product-images');

-- Only admins can upload/delete product images
-- CREATE POLICY "Admins can upload product images"
--   ON storage.objects FOR INSERT
--   WITH CHECK (bucket_id = 'product-images' AND is_admin());

-- CREATE POLICY "Admins can delete product images"
--   ON storage.objects FOR DELETE
--   USING (bucket_id = 'product-images' AND is_admin());
