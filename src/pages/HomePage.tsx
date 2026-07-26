import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Zap, Headphones, Award,
  Package, Key, CheckCircle2, ChevronDown, Star,
  Sparkles, Clock, BadgeCheck,
} from 'lucide-react';
import { ProductCard } from '@/features/products/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

/* ── Data ── */
const CATEGORIES = [
  { name: 'Windows',   icon: '🪟', slug: 'windows',  color: '#EEF2FF', border: '#C7D2FE' },
  { name: 'Office',    icon: '📊', slug: 'office',    color: '#F0FDF4', border: '#BBF7D0' },
  { name: 'Antivirus', icon: '🛡️', slug: 'antivirus', color: '#FFF7ED', border: '#FED7AA' },
  { name: 'VPN',       icon: '🔒', slug: 'vpn',       color: '#F0F9FF', border: '#BAE6FD' },
  { name: 'Adobe',     icon: '🎨', slug: 'adobe',     color: '#FFF1F2', border: '#FECDD3' },
  { name: 'Gaming',    icon: '🎮', slug: 'gaming',    color: '#F5F3FF', border: '#DDD6FE' },
];

const WHY_US = [
  {
    icon: Shield,
    title: 'Genuine Products',
    desc: 'Every key comes from authorized distributors — no grays, no fakes. Your purchase is always protected.',
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    desc: 'Most orders are fulfilled within 1–4 hours. We don\'t make you wait for what you\'ve already paid for.',
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
  {
    icon: Headphones,
    title: '24/7 Support',
    desc: 'Real humans answer your queries — not bots. We\'re here whenever you need us.',
    color: '#4F46E5',
    bg: '#EEF2FF',
    border: '#C7D2FE',
  },
  {
    icon: Award,
    title: 'Activation Guarantee',
    desc: 'If a key doesn\'t work, we\'ll replace it or refund you. No questions, no hassle.',
    color: '#EC4899',
    bg: '#FDF2F8',
    border: '#FBCFE8',
  },
];

const STEPS = [
  { n: '01', icon: Package,      title: 'Browse & Select',  desc: 'Find exactly what you need from our verified catalog of 500+ products.' },
  { n: '02', icon: Key,          title: 'Place Your Order',  desc: 'Checkout securely and add any notes for our team — we read every one.'  },
  { n: '03', icon: CheckCircle2, title: 'Get Your Key',      desc: 'Your license key lands in your dashboard. Activate and you\'re done!'   },
];

const FAQS = [
  { q: 'How do I receive my license key?',
    a: 'After placing your order, our team assigns a verified key from our inventory. You\'ll find it waiting in your dashboard under "My Orders" — usually within a few hours.' },
  { q: 'Are the keys genuine?',
    a: 'Absolutely. All our keys come from authorized resellers and Microsoft Volume Licensing partners. We offer activation guarantees and our track record speaks for itself — 10,000+ happy customers.' },
  { q: 'How long does delivery take?',
    a: 'Most orders are processed within 1–4 hours during business hours. During peak periods it may occasionally stretch to 24 hours, but we\'ll keep you updated.' },
  { q: 'What if my key doesn\'t work?',
    a: 'Get in touch with your order ID and we\'ll make it right — full replacement or refund. We\'ve built our reputation on this promise.' },
  { q: 'Can I use the key on multiple devices?',
    a: 'This depends on the license type. Single-user covers one device; multi-device options are clearly labeled. When in doubt, just ask us before buying.' },
];

const STATS = [
  { value: '10,000+', label: 'Happy Customers',  emoji: '😊' },
  { value: '500+',    label: 'Products',           emoji: '📦' },
  { value: '4.9★',    label: 'Average Rating',     emoji: '⭐' },
  { value: '99.8%',   label: 'Success Rate',       emoji: '✅' },
];

const REVIEWS = [
  { name: 'Rahul M.',    rating: 5, text: 'Got my Windows key within 2 hours. Activated without any issues. Will definitely come back!', location: 'Mumbai' },
  { name: 'Priya K.',    rating: 5, text: 'Best prices I found online, and the support team was super helpful. Totally legit.',           location: 'Bangalore' },
  { name: 'Arjun S.',    rating: 5, text: 'Third time buying here. Never had an issue. The activation guarantee gives me real confidence.', location: 'Delhi' },
];

/* ── Animation preset ── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
  transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const, delay },
});

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white">
      <div className="skeleton h-44 rounded-none" />
      <div className="p-4 space-y-3">
        <div className="skeleton h-3 w-1/3" />
        <div className="skeleton h-4 w-5/6" />
        <div className="skeleton h-4 w-2/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="skeleton h-5 w-20" />
          <div className="skeleton h-8 w-16 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

export function HomePage() {
  const { data: featured, isLoading } = useFeaturedProducts();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Helmet>
        <title>MyDigiStop — Premium Digital License Keys</title>
        <meta name="description" content="Buy genuine Windows, Office, Antivirus and software license keys. Fast delivery, guaranteed activation. Trusted by 10,000+ customers." />
      </Helmet>

      {/* ════════════════════════════════════
                          HERO
          ════════════════════════════════════ */}
      <section className="relative hero-glow min-h-screen flex items-center bg-gradient-to-br from-slate-50 via-indigo-50/40 to-sky-50/30 overflow-hidden">

        {/* Decorative blobs */}
        <div className="hero-blob-1" />
        <div className="hero-blob-2" />

        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-36 w-full">
          <div className="max-w-[680px] mx-auto text-center">

            {/* Pill badge */}
            <motion.div {...fadeUp(0)} className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold bg-white border border-indigo-200 text-indigo-700 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 pulse-dot" />
                Trusted by 10,000+ customers across India
                <Sparkles size={12} className="text-indigo-400" />
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.06)}
              className="font-black text-slate-900 leading-[1.05] tracking-[-0.03em] mb-6"
              style={{ fontSize: 'clamp(40px, 6vw, 68px)' }}
            >
              Software Keys That{' '}
              <br className="hidden sm:block" />
              <span className="g-text-warm">Actually Work.</span>
            </motion.h1>

            {/* Subheadline — warm, personal */}
            <motion.p {...fadeUp(0.12)}
              className="text-[17px] text-slate-600 leading-relaxed mb-4 max-w-[500px] mx-auto"
            >
              No bots, no middlemen — just genuine Windows, Office, Antivirus & more keys, 
              delivered fast, with a real team backing every purchase.
            </motion.p>

            <motion.p {...fadeUp(0.15)}
              className="text-sm text-slate-400 mb-10"
            >
              Orders typically delivered within 1–4 hours ⚡
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.18)} className="flex items-center justify-center gap-3 flex-wrap mb-14">
              <Link to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-bold text-white no-underline transition-all duration-200 hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
                  boxShadow: '0 4px 20px rgba(79,70,229,0.35)',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 30px rgba(79,70,229,0.5)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(79,70,229,0.35)'; }}
              >
                Browse Products <ArrowRight size={16} />
              </Link>
              <Link to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-medium text-slate-600 no-underline border border-slate-300 hover:text-slate-900 hover:border-slate-400 hover:bg-white transition-all duration-200 bg-white/70"
              >
                How it works
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div {...fadeUp(0.24)} className="flex items-center justify-center gap-5 flex-wrap">
              {[
                { icon: BadgeCheck, label: 'Genuine Keys',         color: '#10B981' },
                { icon: Shield,     label: 'SSL Secured',           color: '#4F46E5' },
                { icon: Clock,      label: 'Fast Delivery',         color: '#F59E0B' },
                { icon: Award,      label: 'Activation Guarantee',  color: '#EC4899' },
              ].map(({ icon: Icon, label, color }) => (
                <span key={label} className="flex items-center gap-1.5 text-[12.5px] text-slate-500 font-medium">
                  <Icon size={13} style={{ color }} />
                  {label}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400">
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════
                        STATS
          ════════════════════════════════════ */}
      <section className="border-y border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label, emoji }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)} className="text-center">
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</div>
                <div className="text-[13px] text-slate-500 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                      CATEGORIES
          ════════════════════════════════════ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Browse</p>
            <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Shop by Category</h2>
            <p className="text-slate-500 mt-1 text-sm">Find software built for your needs</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.slug} {...fadeUp(i * 0.04)}>
                <Link to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 py-6 px-3 rounded-2xl no-underline transition-all duration-200 group hover:-translate-y-1 hover:shadow-md"
                  style={{
                    background: cat.color,
                    border: `1px solid ${cat.border}`,
                  }}
                >
                  <span className="text-[28px]">{cat.icon}</span>
                  <span className="text-[12px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors duration-150 text-center">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                    FEATURED PRODUCTS
          ════════════════════════════════════ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Top Picks</p>
              <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Featured Products</h2>
            </div>
            <Link to="/products"
              className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-indigo-600 hover:text-indigo-700 no-underline transition-colors duration-150 shrink-0 mb-1"
            >
              View all <ArrowRight size={14} />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {isLoading
              ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
              : featured?.products.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)
            }
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                       WHY US
          ════════════════════════════════════ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="text-center max-w-md mx-auto mb-14">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Why Us</p>
            <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">We take the stress out of software</h2>
            <p className="text-slate-500 mt-2 text-sm">Real commitments, not just marketing copy.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {WHY_US.map(({ icon: Icon, title, desc, color, bg, border }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.08)}
                className="p-6 rounded-2xl border hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                style={{ background: bg, borderColor: border }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${color}20`, border: `1px solid ${color}30` }}
                >
                  <Icon size={18} style={{ color }} />
                </div>
                <h3 className="text-[14px] font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                    HOW IT WORKS
          ════════════════════════════════════ */}
      <section className="border-b border-slate-200 bg-white">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Process</p>
            <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Three easy steps</h2>
            <p className="text-slate-500 mt-2 text-sm">From browsing to activating — it's that simple.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div
                    className="w-16 h-16 rounded-[18px] flex items-center justify-center shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-white text-indigo-600"
                    style={{ background: '#EEF2FF' }}
                  >
                    {n}
                  </div>
                </div>
                <h3 className="text-[14px] font-bold text-slate-800 mb-2">{title}</h3>
                <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                    SOCIAL PROOF
          ════════════════════════════════════ */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="text-center mb-12">
            <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">Reviews</p>
            <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">What customers say</h2>
            <p className="text-slate-500 mt-2 text-sm">Real people. Real orders. Real results.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REVIEWS.map((r, i) => (
              <motion.div key={r.name} {...fadeUp(i * 0.08)}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="flex gap-0.5 mb-3">
                  {[...Array(r.rating)].map((_, j) => (
                    <Star key={j} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[13.5px] text-slate-700 leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)' }}>
                    {r.name[0]}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-slate-800">{r.name}</p>
                    <p className="text-[11px] text-slate-400">{r.location}</p>
                  </div>
                  <CheckCircle2 size={14} className="ml-auto text-emerald-500" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                         FAQ
          ════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="max-w-[640px] mx-auto">

            <motion.div {...fadeUp()} className="text-center mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest text-indigo-500 mb-2">FAQ</p>
              <h2 className="text-[28px] font-extrabold text-slate-900 tracking-tight">Questions we actually get asked</h2>
              <p className="text-slate-500 mt-2 text-sm">Straight answers — no corporate fluff.</p>
            </motion.div>

            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <motion.div key={i} {...fadeUp(i * 0.04)}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    border: `1px solid ${openFaq === i ? 'rgba(79,70,229,0.3)' : '#E2E8F0'}`,
                    background: openFaq === i ? '#EEF2FF' : '#fff',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-[13.5px] font-semibold text-slate-800">{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                      <ChevronDown size={15} className="text-slate-400" />
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[13px] text-slate-600 leading-relaxed border-t border-slate-200 pt-3.5">
                      {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                       CTA BANNER
          ════════════════════════════════════ */}
      <section className="bg-slate-50">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.div {...fadeUp()}
            className="max-w-[640px] mx-auto text-center rounded-3xl px-10 py-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0EA5E9 100%)',
              boxShadow: '0 20px 60px rgba(79,70,229,0.3)',
            }}
          >
            {/* Shine overlay */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(255,255,255,0.18) 0%, transparent 60%)' }} />

            <div className="relative z-10">
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-white/20 backdrop-blur-sm">
                  <Star size={22} className="text-white" />
                </div>
              </div>

              <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-3">
                Ready when you are 🙌
              </h2>
              <p className="text-[15px] text-white/80 mb-8 leading-relaxed">
                Join the thousands of people who get their software sorted with MyDigiStop. 
                Quick, genuine, and hassle-free.
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-bold bg-white text-indigo-600 no-underline transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Shop Now <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
