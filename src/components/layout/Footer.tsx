import { Link } from 'react-router-dom';
import { ExternalLink, Mail, Shield, Package, Info, Phone, FileText, Lock } from 'lucide-react';

const footerLinks = {
  Products: [
    { label: 'Windows Licenses', to: '/products?category=windows' },
    { label: 'Microsoft Office', to: '/products?category=office' },
    { label: 'Antivirus', to: '/products?category=antivirus' },
    { label: 'All Products', to: '/products' },
  ],
  Company: [
    { label: 'About Us', to: '/about', icon: Info },
    { label: 'Contact', to: '/contact', icon: Phone },
    { label: 'Terms & Conditions', to: '/terms', icon: FileText },
    { label: 'Privacy Policy', to: '/privacy', icon: Lock },
  ],
  Account: [
    { label: 'Sign In', to: '/?signin=1' },
    { label: 'My Orders', to: '/dashboard/orders' },
    { label: 'Wishlist', to: '/dashboard/wishlist' },
    { label: 'My Profile', to: '/dashboard/profile' },
  ],
};

export function Footer() {
  return (
    <footer className="relative mt-auto" style={{ background: '#0A0B14', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Glow accent */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #6C47FF, #00C2CB, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-xl"
                style={{ background: 'linear-gradient(135deg, #6C47FF 0%, #00C2CB 100%)' }}
              >
                M
              </div>
              <span className="text-2xl font-bold text-white">
                MyDigi<span className="gradient-text">Stop</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Your trusted marketplace for genuine digital licenses and software activation keys. Instant delivery, verified products.
            </p>
            <div className="flex items-center gap-2 text-xs px-3 py-2 rounded-xl border border-green-500/20 bg-green-500/5 text-green-400 w-fit">
              <Shield size={12} />
              SSL Secured & Verified
            </div>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all" title="Twitter">
                <ExternalLink size={16} />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all" title="GitHub">
                <ExternalLink size={16} />
              </a>
              <a href="mailto:support@mydigistop.com" className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/8 transition-all">
                <Mail size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-sm font-semibold text-white mb-4">{section}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm transition-all duration-200 hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.45)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div
          className="mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © {new Date().getFullYear()} MyDigiStop. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
            <Package size={12} />
            <span>Digital products delivered instantly after manual verification</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
