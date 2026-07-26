import { Link } from 'react-router-dom';
import { Mail, Shield, Package, Heart } from 'lucide-react';

const LINKS = {
  Products: [
    { label: 'Windows',          to: '/products?category=windows' },
    { label: 'Microsoft Office', to: '/products?category=office'  },
    { label: 'Antivirus',        to: '/products?category=antivirus' },
    { label: 'All Products',     to: '/products' },
  ],
  Company: [
    { label: 'About Us',  to: '/about'   },
    { label: 'Contact',   to: '/contact' },
    { label: 'Terms',     to: '/terms'   },
    { label: 'Privacy',   to: '/privacy' },
  ],
  Tools: [
    { label: 'CID Generator', to: '/tools' },
    { label: 'Key Checker',   to: '/tools' },
    { label: 'O365 Checker',  to: '/tools' },
  ],
  Account: [
    { label: 'Sign In',   to: '/?signin=1'         },
    { label: 'My Orders', to: '/dashboard/orders'   },
    { label: 'Wishlist',  to: '/dashboard/wishlist' },
    { label: 'Profile',   to: '/dashboard/profile'  },
  ],
};

export function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">

          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-black text-[13px] shadow-sm"
                style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}
              >
                M
              </div>
              <span className="text-[15px] font-bold text-white tracking-tight">
                MyDigi<span style={{
                  background: 'linear-gradient(135deg, #818CF8, #38BDF8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Stop</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-[13px] text-slate-400 leading-relaxed max-w-[240px]">
              Your trusted marketplace for genuine digital licenses and software activation keys.
            </p>

            {/* Made with love */}
            <p className="text-[12px] text-slate-500 flex items-center gap-1.5">
              Made with <Heart size={11} className="text-rose-400 fill-rose-400" /> for software enthusiasts
            </p>

            {/* SSL chip */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
              <Shield size={10} />
              SSL Secured &amp; Verified
            </span>

            {/* Email */}
            <a
              href="mailto:support@mydigistop.com"
              className="flex items-center gap-2 text-xs text-slate-500 no-underline hover:text-slate-300 transition-colors duration-150 w-fit"
            >
              <Mail size={12} />
              support@mydigistop.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">
                {section}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <Link
                    key={item.to + item.label}
                    to={item.to}
                    className="text-[13px] text-slate-400 no-underline hover:text-white transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-6">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} MyDigiStop. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Package size={11} />
            Digital products · Manual verification
          </div>
        </div>
      </div>
    </footer>
  );
}
