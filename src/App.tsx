import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { queryClient } from '@/lib/queryClient';
import { AuthProvider } from '@/features/auth/AuthProvider';
import { ProtectedRoute, AdminRoute } from '@/features/auth/RouteGuards';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/features/cart/CartDrawer';
import { AuthCallback } from '@/features/auth/AuthCallback';
import { CidApp } from '@/features/cid/CidApp';

// Lazy-loaded pages
const HomePage = lazy(() => import('@/pages/HomePage').then(m => ({ default: m.HomePage })));
const ProductsPage = lazy(() => import('@/pages/ProductsPage').then(m => ({ default: m.ProductsPage })));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('@/pages/ContactPage').then(m => ({ default: m.ContactPage })));
const TermsPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.TermsPage })));
const PrivacyPage = lazy(() => import('@/pages/LegalPages').then(m => ({ default: m.PrivacyPage })));

// Dashboard
const DashboardLayout = lazy(() => import('@/features/dashboard/DashboardLayout').then(m => ({ default: m.DashboardLayout })));
const DashboardHome = lazy(() => import('@/features/dashboard/DashboardHome').then(m => ({ default: m.DashboardHome })));
const MyOrdersPage = lazy(() => import('@/features/dashboard/MyOrdersPage').then(m => ({ default: m.MyOrdersPage })));
const OrderDetailPage = lazy(() => import('@/features/dashboard/OrderDetailPage').then(m => ({ default: m.OrderDetailPage })));
const WishlistPage = lazy(() => import('@/features/dashboard/WishlistPage').then(m => ({ default: m.WishlistPage })));
const ProfilePage = lazy(() => import('@/features/dashboard/ProfilePage').then(m => ({ default: m.ProfilePage })));

// Admin
const AdminLayout = lazy(() => import('@/features/admin/AdminLayout').then(m => ({ default: m.AdminLayout })));
const AdminDashboard = lazy(() => import('@/features/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('@/features/admin/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminLicenseKeys = lazy(() => import('@/features/admin/AdminLicenseKeys').then(m => ({ default: m.AdminLicenseKeys })));
const AdminOrders = lazy(() => import('@/features/admin/AdminOrders').then(m => ({ default: m.AdminOrders })));
const AdminCustomers = lazy(() => import('@/features/admin/AdminCustomers').then(m => ({ default: m.AdminCustomers })));
const AdminCategories = lazy(() => import('@/features/admin/AdminCategories').then(m => ({ default: m.AdminCategories })));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-12 h-12 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: '#6C47FF', borderTopColor: 'transparent' }}
        />
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Loading...</p>
      </div>
    </div>
  );
}

// Layout wrapper for public pages (with Navbar + Footer)
function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default function App() {
  // Force enable the CID app for now without needing a dev server restart
  const isCidAppEnabled = true; // import.meta.env.VITE_ENABLE_CID_APP === 'true';

  if (isCidAppEnabled) {
    return (
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <CidApp />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#12152A',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
              },
            }}
          />
        </QueryClientProvider>
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Auth Callback */}
                <Route path="/auth/callback" element={<AuthCallback />} />

                {/* Public Routes */}
                <Route path="/" element={
                  <PublicLayout>
                    <HomePage />
                  </PublicLayout>
                } />
                <Route path="/products" element={
                  <PublicLayout>
                    <ProductsPage />
                  </PublicLayout>
                } />
                <Route path="/products/:slug" element={
                  <PublicLayout>
                    <ProductDetailPage />
                  </PublicLayout>
                } />
                <Route path="/checkout" element={
                  <PublicLayout>
                    <CheckoutPage />
                  </PublicLayout>
                } />
                <Route path="/about" element={
                  <PublicLayout>
                    <AboutPage />
                  </PublicLayout>
                } />
                <Route path="/contact" element={
                  <PublicLayout>
                    <ContactPage />
                  </PublicLayout>
                } />
                <Route path="/terms" element={
                  <PublicLayout>
                    <TermsPage />
                  </PublicLayout>
                } />
                <Route path="/privacy" element={
                  <PublicLayout>
                    <PrivacyPage />
                  </PublicLayout>
                } />

                {/* Customer Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <PublicLayout>
                      <DashboardLayout />
                    </PublicLayout>
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardHome />} />
                  <Route path="orders" element={<MyOrdersPage />} />
                  <Route path="orders/:id" element={<OrderDetailPage />} />
                  <Route path="wishlist" element={<WishlistPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>

                {/* Admin Routes */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <AdminLayout />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="keys" element={<AdminLicenseKeys />} />
                  <Route path="orders" element={<AdminOrders />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="categories" element={<AdminCategories />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={
                  <PublicLayout>
                    <div className="min-h-screen flex items-center justify-center text-center">
                      <div>
                        <div className="text-8xl mb-6">🔍</div>
                        <h1 className="text-4xl font-black text-white mb-3">Page Not Found</h1>
                        <p className="mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
                          The page you're looking for doesn't exist.
                        </p>
                        <a href="/" className="btn-brand text-base px-8 py-3">Go Home</a>
                      </div>
                    </div>
                  </PublicLayout>
                } />
              </Routes>
            </Suspense>

            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: '#12152A',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: '#fff',
                },
              }}
            />
          </AuthProvider>
        </BrowserRouter>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </HelmetProvider>
  );
}
