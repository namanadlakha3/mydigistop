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
          ? 'bg-[#0F1117]/92 backdrop-blur-2xl border-b border-white/[0.09] py-3'
          : 'bg-transparent border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-6 flex items-center gap-8">

        {/* ── Logo ── */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 no-underline group">
          <div
            className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-black text-[13px] transition-transform duration-200 group-hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
          >
            M
          </div>
          <span className="text-[15px] font-bold text-white/90 tracking-tight">
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
                    ? 'text-white bg-white/[0.08]'
                    : 'text-white/50 hover:text-white/90 hover:bg-white/[0.05]'
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
            className="relative p-2 rounded-lg text-white/45 hover:text-white/90 hover:bg-white/[0.07] transition-all duration-150 border-none bg-transparent cursor-pointer"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
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
                className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.07] transition-all duration-150 border-none bg-transparent cursor-pointer"
              >
                {/* Avatar — always visible */}
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'User'}
                    referrerPolicy="no-referrer"
                    className="w-7 h-7 rounded-full object-cover ring-2 ring-white/20"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0"
                    style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
                  >
                    {getInitials(profile?.full_name || user.email || 'U')}
                  </div>
                )}
                {/* Name — visible on sm+ */}
                <span className="hidden sm:block text-[13px] font-medium text-white/75 max-w-[90px] truncate">
                  {profile?.full_name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown
                  size={12}
                  className={`text-white/30 transition-transform duration-200 ${profileOpen ? 'rotate-180' : ''}`}
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
                    className="absolute right-0 top-full mt-2 w-52 rounded-2xl p-1.5 border border-white/[0.12] z-50"
                    style={{
                      background: 'rgba(19,22,35,0.98)',
                      backdropFilter: 'blur(24px)',
                      boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(124,95,255,0.08)',
                    }}
                  >
                    {/* User info */}
                    <div className="flex items-center gap-2.5 px-3 py-3 border-b border-white/[0.07] mb-1">
                      {profile?.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt=""
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-white/15"
                        />
                      ) : (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                          style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
                        >
                          {getInitials(profile?.full_name || user.email || 'U')}
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-white truncate leading-tight">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-[11px] text-white/38 truncate mt-0.5">{user.email}</p>
                      </div>
                    </div>

                    {menuItems.map(({ icon: Icon, label, path }) => (
                      <button key={path}
                        onClick={() => { navigate(path); setProfileOpen(false); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-white/58 hover:text-white hover:bg-white/[0.07] transition-all duration-100 border-none bg-transparent cursor-pointer text-left"
                      >
                        <Icon size={13} className="shrink-0" /> {label}
                      </button>
                    ))}

                    <div className="border-t border-white/[0.07] mx-1 my-1" />
                    <button
                      onClick={() => { signOut(); setProfileOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] text-red-400/75 hover:text-red-300 hover:bg-red-500/[0.08] transition-all duration-100 border-none bg-transparent cursor-pointer text-left"
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
              className="hidden sm:flex items-center gap-1.5 ml-1 px-4 py-2 rounded-xl text-[13px] font-semibold text-[#9D86FF] border border-[#7C5FFF]/28 hover:bg-[#7C5FFF]/10 hover:border-[#7C5FFF]/45 transition-all duration-150 cursor-pointer bg-transparent"
            >
              <User size={13} /> Sign In
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(p => !p)}
            className="md:hidden p-2 rounded-lg text-white/45 hover:text-white/90 hover:bg-white/[0.07] transition-all duration-150 border-none bg-transparent cursor-pointer ml-1"
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
            className="md:hidden overflow-hidden border-t border-white/[0.07]"
            style={{ background: 'rgba(15,17,23,0.97)', backdropFilter: 'blur(24px)' }}
          >
            <div className="px-6 py-3 flex flex-col gap-0.5">
              {NAV.map(l => (
                <NavLink key={l.to} to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-xl text-[13.5px] font-medium no-underline transition-all duration-150 ${
                      isActive ? 'text-white bg-white/[0.08]' : 'text-white/55 hover:text-white'
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!user && (
                <button
                  onClick={signInWithGoogle}
                  className="mt-2 flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-[#9D86FF] border border-[#7C5FFF]/28 bg-[#7C5FFF]/[0.08] cursor-pointer"
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
