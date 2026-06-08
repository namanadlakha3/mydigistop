import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Package, Key, ShoppingBag, Users, Tag,
  LogOut, Menu, X, Shield, Bell, ChevronRight, Settings
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { getInitials } from '@/lib/utils';

const adminNav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/keys', label: 'License Keys', icon: Key },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: Users },
  { to: '/admin/categories', label: 'Categories', icon: Tag },
];

export function AdminLayout() {
  const { profile, user, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen flex" style={{ background: '#080910' }}>
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed lg:relative z-40 flex flex-col w-64 h-screen border-r"
            style={{ background: '#0D0F1E', borderColor: 'rgba(255,255,255,0.07)' }}
          >
            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg shrink-0"
                style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
              >
                M
              </div>
              <div>
                <p className="font-bold text-white text-sm">MyDigiStop</p>
                <div className="flex items-center gap-1">
                  <Shield size={10} style={{ color: '#6C47FF' }} />
                  <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Admin Panel</p>
                </div>
              </div>
            </div>

            {/* Profile */}
            <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-9 h-9 rounded-xl object-cover shrink-0" />
                ) : (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
                  >
                    {getInitials(profile?.full_name || user?.email || 'A')}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{profile?.full_name || 'Admin'}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>Administrator</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {adminNav.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-white/50 hover:text-white hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) =>
                    isActive ? { background: 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(0,194,203,0.08))', border: '1px solid rgba(108,71,255,0.2)' } : {}
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon size={16} />
                        {label}
                      </div>
                      {isActive && <ChevronRight size={13} style={{ color: '#6C47FF' }} />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            {/* Bottom */}
            <div className="px-4 py-4 border-t space-y-1" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <Settings size={16} /> View Store
              </button>
              <button
                onClick={() => { signOut(); navigate('/'); }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b" style={{ background: '#0D0F1E', borderColor: 'rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all"
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>

          <div className="flex items-center gap-3">
            <button className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/8 transition-all">
              <Bell size={18} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
