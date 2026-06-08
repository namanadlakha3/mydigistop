import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Package, Heart, User, LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { getInitials } from '@/lib/utils';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/dashboard/orders', label: 'My Orders', icon: Package },
  { to: '/dashboard/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/dashboard/profile', label: 'Profile', icon: User },
];

export function DashboardLayout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--color-dark-base)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:w-64 shrink-0"
          >
            {/* Profile card */}
            <div
              className="p-5 rounded-2xl mb-4 border"
              style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
            >
              <div className="flex items-center gap-3">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                ) : (
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
                  >
                    {getInitials(profile?.full_name || user?.email || 'U')}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="font-semibold text-white text-sm truncate">{profile?.full_name || 'Customer'}</p>
                  <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{user?.email}</p>
                </div>
              </div>
            </div>

            {/* Nav */}
            <nav className="space-y-1">
              {navItems.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'text-white'
                        : 'text-white/55 hover:text-white hover:bg-white/5'
                    }`
                  }
                  style={({ isActive }) =>
                    isActive ? { background: 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(0,194,203,0.1))', border: '1px solid rgba(108,71,255,0.2)' } : {}
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-3">
                        <Icon size={17} />
                        {label}
                      </div>
                      {isActive && <ChevronRight size={14} style={{ color: '#6C47FF' }} />}
                    </>
                  )}
                </NavLink>
              ))}

              <div className="border-t mt-3 pt-3" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                <button
                  onClick={() => { signOut(); navigate('/'); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all text-left"
                >
                  <LogOut size={17} />
                  Sign Out
                </button>
              </div>
            </nav>
          </motion.aside>

          {/* Content */}
          <main className="flex-1 min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
