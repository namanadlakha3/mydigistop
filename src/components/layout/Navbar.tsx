import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart,
  Menu,
  X,
  Sun,
  Moon,
  Bell,
  User,
  LogOut,
  LayoutDashboard,
  Shield,
  Heart,
  Package,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCartStore } from '@/stores/cartStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';
import { getInitials } from '@/lib/utils';

const navLinks = [
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, profile, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { getTotalItems, toggleCart } = useCartStore();
  const { theme, toggleTheme } = useUIStore();
  const navigate = useNavigate();
  const cartCount = getTotalItems();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass border-b border-white/8 py-3' : 'py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
              style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #00C2CB 100%)' }}
            >
              M
            </div>
            <span className="text-xl font-bold text-white">
              MyDigi<span className="gradient-text">Stop</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive ? 'text-white bg-white/8' : 'text-white/60 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              <ShoppingCart size={18} />
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold"
                  style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
                >
                  {cartCount > 9 ? '9+' : cartCount}
                </motion.span>
              )}
            </button>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/8 transition-all"
                >
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
                    >
                      {getInitials(profile?.full_name || user.email || 'U')}
                    </div>
                  )}
                  <span className="text-sm text-white/80 hidden sm:block max-w-24 truncate">
                    {profile?.full_name?.split(' ')[0] || 'User'}
                  </span>
                  <ChevronDown size={14} className="text-white/40" />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass rounded-2xl p-2 border border-white/10"
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      <div className="px-3 py-2 mb-1">
                        <p className="text-sm font-semibold text-white truncate">{profile?.full_name || 'User'}</p>
                        <p className="text-xs truncate" style={{ color: 'rgba(255,255,255,0.45)' }}>{user.email}</p>
                      </div>
                      <div className="border-t border-white/8 my-1" />
                      {isAdmin && (
                        <button
                          onClick={() => { navigate('/admin'); setProfileOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all text-left"
                        >
                          <Shield size={15} />
                          Admin Panel
                        </button>
                      )}
                      <button
                        onClick={() => { navigate('/dashboard'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all text-left"
                      >
                        <LayoutDashboard size={15} />
                        Dashboard
                      </button>
                      <button
                        onClick={() => { navigate('/dashboard/orders'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all text-left"
                      >
                        <Package size={15} />
                        My Orders
                      </button>
                      <button
                        onClick={() => { navigate('/dashboard/wishlist'); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/70 hover:text-white hover:bg-white/8 transition-all text-left"
                      >
                        <Heart size={15} />
                        Wishlist
                      </button>
                      <div className="border-t border-white/8 my-1" />
                      <button
                        onClick={() => { signOut(); setProfileOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-500/10 transition-all text-left"
                      >
                        <LogOut size={15} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Button
                size="md"
                onClick={signInWithGoogle}
                className="hidden sm:flex items-center gap-2"
              >
                <User size={16} />
                Sign In
              </Button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/8 transition-all"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden glass border-t border-white/8"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'text-white bg-white/8' : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              {!user && (
                <div className="pt-2">
                  <Button onClick={signInWithGoogle} className="w-full">
                    <User size={16} />
                    Sign In with Google
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
