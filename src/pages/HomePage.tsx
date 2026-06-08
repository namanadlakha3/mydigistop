import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Zap, Star, ChevronDown, Package, Key, CheckCircle2,
  Headphones, Award, Clock, Users, TrendingUp
} from 'lucide-react';
import { AnimatedButton } from '@/components/ui/Button';
import { ProductCard } from '@/features/products/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useFeaturedProducts, useCategories } from '@/hooks/useProducts';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useState } from 'react';

// Animated gradient orb
function GradientOrb({ className }: { className?: string }) {
  return (
    <div
      className={`absolute rounded-full blur-3xl opacity-20 pointer-events-none ${className}`}
      style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
    />
  );
}

const trustFeatures = [
  { icon: Shield, title: 'Genuine Products', desc: 'All keys are sourced from authorized distributors' },
  { icon: Zap, title: 'Quick Delivery', desc: 'Receive your license key within hours' },
  { icon: Headphones, title: '24/7 Support', desc: 'Our team is ready to assist you anytime' },
  { icon: Award, title: 'Money-Back Promise', desc: 'Full refund if the key doesn\'t work' },
];

const stats = [
  { value: '10,000+', label: 'Happy Customers', icon: Users },
  { value: '500+', label: 'Products', icon: Package },
  { value: '4.9★', label: 'Avg. Rating', icon: Star },
  { value: '99.8%', label: 'Success Rate', icon: TrendingUp },
];

const faqs = [
  {
    q: 'How do I receive my license key?',
    a: 'After placing your order, our team reviews it and manually assigns a verified license key. You\'ll receive it directly in your dashboard under "My Orders".',
  },
  {
    q: 'Are the keys genuine?',
    a: 'Yes! All our license keys are sourced from authorized resellers and Microsoft Volume Licensing partners. Each key comes with an activation guarantee.',
  },
  {
    q: 'How long does delivery take?',
    a: 'Most orders are processed within 1-4 hours. In some cases, especially during high volume, it may take up to 24 hours.',
  },
  {
    q: 'What if my key doesn\'t work?',
    a: 'We offer a full replacement or refund. Simply contact our support team with your order ID and we\'ll resolve it immediately.',
  },
  {
    q: 'Can I use the software on multiple devices?',
    a: 'This depends on the specific license type. Single-user licenses are for one device. Multi-device options are clearly marked on the product page.',
  },
];

const categories = [
  { name: 'Windows', icon: '🪟', count: '12 Products', slug: 'windows' },
  { name: 'Microsoft Office', icon: '📊', count: '8 Products', slug: 'office' },
  { name: 'Antivirus', icon: '🛡️', count: '15 Products', slug: 'antivirus' },
  { name: 'VPN', icon: '🔒', count: '10 Products', slug: 'vpn' },
  { name: 'Adobe', icon: '🎨', count: '6 Products', slug: 'adobe' },
  { name: 'Gaming', icon: '🎮', count: '20 Products', slug: 'gaming' },
];

export function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProducts();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Helmet>
        <title>MyDigiStop — Premium Digital License Keys & Software</title>
        <meta name="description" content="Buy genuine Windows, Office, Antivirus and software license keys at the best prices. Instant delivery, verified products, 24/7 support." />
        <meta property="og:title" content="MyDigiStop — Premium Digital License Keys" />
        <meta property="og:description" content="Your trusted marketplace for genuine digital licenses." />
      </Helmet>

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden animated-gradient-bg">
        <GradientOrb className="w-96 h-96 -top-48 -left-48" />
        <GradientOrb className="w-80 h-80 top-1/2 -right-40" />

        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(108,71,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 relative z-10">
          <motion.div
            className="text-center max-w-4xl mx-auto"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="flex justify-center mb-8">
              <div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border"
                style={{
                  background: 'rgba(108,71,255,0.12)',
                  borderColor: 'rgba(108,71,255,0.3)',
                  color: '#9B7FFF',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Trusted by 10,000+ customers worldwide
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={itemVariants}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.1] mb-6"
            >
              Your Digital
              <br />
              <span className="gradient-text">License Hub</span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Premium Windows, Office, Antivirus, and software licenses at unbeatable prices.
              Genuine keys, verified delivery, guaranteed activation.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-16">
              <Link to="/products">
                <AnimatedButton size="xl" className="gap-3">
                  Browse Products <ArrowRight size={20} />
                </AnimatedButton>
              </Link>
              <Link
                to="/about"
                className="flex items-center gap-2 px-7 py-3.5 rounded-xl text-base font-semibold text-white/70 hover:text-white border border-white/15 hover:border-white/30 transition-all"
              >
                How it works
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-6"
            >
              {[
                { icon: Shield, text: 'SSL Secured' },
                { icon: CheckCircle2, text: 'Genuine Keys' },
                { icon: Clock, text: 'Fast Delivery' },
                { icon: Key, text: 'Verified Licenses' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  <Icon size={16} style={{ color: '#6C47FF' }} />
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            className="flex justify-center mt-16"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown size={24} style={{ color: 'rgba(255,255,255,0.25)' }} />
          </motion.div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="py-16 relative" style={{ background: 'rgba(108,71,255,0.05)', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                  style={{ background: 'rgba(108,71,255,0.12)', border: '1px solid rgba(108,71,255,0.2)' }}
                >
                  <Icon size={22} style={{ color: '#6C47FF' }} />
                </div>
                <div className="text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-sm font-semibold uppercase tracking-wider gradient-text">Categories</span>
          <h2 className="text-4xl font-black text-white mt-2">Browse by Category</h2>
          <p className="mt-3 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Find the exact software you need
          </p>
        </motion.div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4, scale: 1.03 }}
            >
              <Link
                to={`/products?category=${cat.slug}`}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border text-center transition-all duration-300 group"
                style={{
                  background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                  borderColor: 'rgba(255,255,255,0.08)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(108,71,255,0.3)';
                  e.currentTarget.style.boxShadow = '0 12px 40px rgba(108,71,255,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <span className="text-3xl">{cat.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">{cat.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{cat.count}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== FEATURED PRODUCTS ===== */}
      <section className="py-20" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <span className="text-sm font-semibold uppercase tracking-wider gradient-text">Featured</span>
              <h2 className="text-4xl font-black text-white mt-2">Top Picks</h2>
              <p className="mt-3 text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Most popular software licenses
              </p>
            </div>
            <Link
              to="/products"
              className="hidden md:flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition-colors"
            >
              View All <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredLoading
              ? Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : featuredData?.products.map((product, i) => (
                  <ProductCard key={product.id} product={product} index={i} />
                ))}
          </div>
        </div>
      </section>

      {/* ===== WHY MYDIGISTOP ===== */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wider gradient-text">Why Us</span>
          <h2 className="text-4xl font-black text-white mt-2">Why Choose MyDigiStop</h2>
          <p className="mt-3 text-lg max-w-2xl mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
            We've built a platform around trust, speed, and reliability
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustFeatures.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl border text-center"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%)',
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(0,194,203,0.2))', border: '1px solid rgba(108,71,255,0.2)' }}
              >
                <Icon size={24} style={{ color: '#6C47FF' }} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'rgba(108,71,255,0.04)' }}>
        <GradientOrb className="w-64 h-64 -right-32 top-1/2" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm font-semibold uppercase tracking-wider gradient-text">Process</span>
            <h2 className="text-4xl font-black text-white mt-2">How It Works</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: Package, title: 'Browse & Add', desc: 'Find your desired software license and add it to your cart' },
              { step: '02', icon: Key, title: 'Place Order', desc: 'Submit your order with any specific notes for our team' },
              { step: '03', icon: CheckCircle2, title: 'Get Your Key', desc: 'Receive your verified license key directly in your dashboard' },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative flex flex-col items-center text-center p-8"
              >
                <div className="relative mb-6">
                  <div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6C47FF, #00C2CB)' }}
                  >
                    <Icon size={32} className="text-white" />
                  </div>
                  <div
                    className="absolute -top-3 -right-3 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black border-2"
                    style={{ background: '#0A0B14', borderColor: '#6C47FF', color: '#6C47FF' }}
                  >
                    {step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-sm font-semibold uppercase tracking-wider gradient-text">FAQ</span>
          <h2 className="text-4xl font-black text-white mt-2">Common Questions</h2>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl border overflow-hidden"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <span className="font-semibold text-white pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown size={18} style={{ color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
                </motion.div>
              </button>

              <motion.div
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="pt-4">{faq.a}</div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(0,194,203,0.1))', border: '1px solid rgba(108,71,255,0.25)' }}
        >
          <GradientOrb className="w-64 h-64 -top-32 -left-32 opacity-30" />
          <GradientOrb className="w-64 h-64 -bottom-32 -right-32 opacity-20" />
          <div className="relative z-10">
            <h2 className="text-4xl font-black text-white mb-4">
              Ready to get your software?
            </h2>
            <p className="text-lg mb-8" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Join thousands of customers who trust MyDigiStop for their software needs
            </p>
            <Link to="/products">
              <AnimatedButton size="xl" className="gap-3">
                Shop Now <ArrowRight size={20} />
              </AnimatedButton>
            </Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
