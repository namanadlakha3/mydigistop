import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingCart, Menu, X, User, LogOut,
  LayoutDashboard, Shield, Heart, Package, ChevronDown,
} from 'lucide-react';
import { useAuth } from '@/features/auth/AuthProvider';
import { useCartStore } from '@/stores/cartStore';
import { getInitials } from '@/lib/utils';

const NAV = [
  { to: '/products', label: 'Products' },
  { to: '/tools',    label: 'Tools'    },
  { to: '/about',    label: 'About'    },
  { to: '/contact',  label: 'Contact'  },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  const { user, profile, isAdmin, signInWithGoogle, signOut } = useAuth();
  const { getTotalItems, toggleCart } = useCartStore();
  const navigate = useNavigate();
  const cartCount = getTotalItems();

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node))
        setProfileOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const menuItems = [
    ...(isAdmin ? [{ icon: Shield,          label: 'Admin Panel', path: '/admin'              }] : []),
    { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard'           },
    { icon: Package,         label: 'My Orders',  path: '/dashboard/orders'    },
    { icon: Heart,           label: 'Wishlist',   path: '/dashboard/wishlist'  },
  ];

  return (
    <motion.header
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-2xl shadow-sm border-b border-slate-200 py-3'
          : 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-8">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 no-underline group">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-black text-[13px] transition-transform duration-200 group-hover:scale-105 shadow-sm"
            style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}
          >
            M
          </div>
          <span className="text-[15px] font-bold text-slate-800 tracking-tight">
            MyDigi<span className="g-text">Stop</span>
          </span>
        </Link>

        {/* ── Desktop nav ── */}
        <nav className="hidden md:flex items-center gap-0.5 flex-1 justify-center">
          {NAV.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-[13.5px] font-medium no-underline transition-all duration-150 ${
                  isActive
                    ? 'text-indigo-600 bg-indigo-50'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-1.5 ml-auto">

          {/* Cart */}
          <button
            onClick={toggleCart}
            aria-label="Cart"
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-150 border-none bg-transparent cursor-pointer"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}
              >
                {cartCount > 9 ? '9+' : cartCount}
              </motion.span>
            )}
          </button>

          {/* ── Auth ── */}
          {user ? (
            <div ref={dropRef} className="relative">
              <button
                onClick={() => setProfileOpen(p => !p)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-slate-100 transition-all duration-150 border-none bg-transparent cursor-pointer"
              >
                {/* Avatar */}
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-200"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}
                  >
                    {getInitials(profile?.full_name || user.email || 'U')}
                  </div>
                )}
                <span className="hidden sm:block text-[13px] font-medium text-slate-700 max-w-[90px] truncate">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-slate-400 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* ── Dropdown ── */}
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.97 }}
                    transition={{ duration: 0.14 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl p-1.5 border border-slate-200 z-50 bg-white shadow-xl"
                    style={{ boxShadow: '0 8px 32px rgba(15,23,42,0.12), 0 2px 8px rgba(15,23,42,0.06)' }}
                  >
                    {/* User info */}
                    <div className="flex items-center gap-2.5 px-3 py-3 border-b border-slate-100 mb-1">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-indigo-100"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}
                        >
                          {getInitials(profile?.full_name || user.email || 'U')}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-slate-800 truncate leading-tight">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    {menuItems.map(({ icon: Icon, label, path }) => (
                      <button key={path}
                        onClick={() => { navigate(path); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-all duration-100 border-none bg-transparent cursor-pointer text-left"
                      >
                        <Icon size={13} className="shrink-0 text-slate-400" /> {label}
                      </button>
                    ))}

                    <div className="border-t border-slate-100 mx-1 my-1" />
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-500 hover:text-red-600 hover:bg-red-50 transition-all duration-100 border-none bg-transparent cursor-pointer text-left"
                    >
                      <LogOut size={13} className="shrink-0" /> Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="hidden sm:flex items-center gap-1.5 ml-1 px-4 py-2 rounded-xl text-[13px] font-semibold text-indigo-600 border border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 transition-all duration-150 cursor-pointer bg-transparent"
            >
              <User size={13} /> Sign In
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(p => !p)}
            className="md:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-all duration-150 border-none bg-transparent cursor-pointer ml-1"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden border-t border-slate-200 bg-white"
          >
            <div className="px-6 py-3 flex flex-col gap-0.5">
              {NAV.map(l => (
                <NavLink key={l.to} to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-[13.5px] font-medium no-underline transition-all duration-150 ${
                      isActive ? 'text-indigo-600 bg-indigo-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!user && (
                <button
                  onClick={signInWithGoogle}
                  className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 cursor-pointer"
                >
                  <User size={14} /> Sign In with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
