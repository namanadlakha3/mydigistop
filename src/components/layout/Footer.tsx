import { Link } from 'react-router-dom';
import { Mail, Shield, Package } from 'lucide-react';

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
  Account: [
    { label: 'Sign In',   to: '/?signin=1'           },
    { label: 'My Orders', to: '/dashboard/orders'     },
    { label: 'Wishlist',  to: '/dashboard/wishlist'   },
    { label: 'Profile',   to: '/dashboard/profile'    },
  ],
};

export function Footer() {
  return (
    <footer className="bg-[#0D1019] border-t border-white/[0.09]">
      <div className="max-w-[1200px] mx-auto px-6 pt-16 pb-10">

        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-14">

          {/* Brand block */}
          <div className="lg:col-span-2 space-y-5">
            {/* Logo */}
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline">
              <div
                className="w-8 h-8 rounded-[10px] flex items-center justify-center text-white font-black text-[13px]"
                style={{ background: 'linear-gradient(135deg, #6C47FF, #06B6D4)' }}
              >
                M
              </div>
              <span className="text-[15px] font-bold text-white tracking-tight">
                MyDigi<span className="g-text">Stop</span>
              </span>
            </Link>

            {/* Tagline */}
            <p className="text-[13px] text-white/36 leading-relaxed max-w-[240px]">
              Your trusted marketplace for genuine digital licenses and software activation keys.
            </p>

            {/* SSL chip */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold text-emerald-300/85 bg-emerald-500/[0.08] border border-emerald-500/16">
              <Shield size={10} />
              SSL Secured &amp; Verified
            </span>

            {/* Email */}
            <a
              href="mailto:support@mydigistop.com"
              className="flex items-center gap-2 text-xs text-white/28 no-underline hover:text-white/65 transition-colors duration-150 w-fit"
            >
              <Mail size={12} />
              support@mydigistop.com
            </a>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([section, items]) => (
            <div key={section}>
              <p className="text-[11px] font-bold uppercase tracking-widest text-white/50 mb-4">
                {section}
              </p>
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-[13px] text-white/35 no-underline hover:text-white/75 transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/[0.08]" />

        {/* Bottom bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-6">
          <p className="text-xs text-white/22">
            © {new Date().getFullYear()} MyDigiStop. All rights reserved.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-white/20">
            <Package size={11} />
            Digital products · Manual verification
          </div>
        </div>
      </div>
    </footer>
  );
}
