import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Shield, Zap, Headphones, Award,
  Package, Key, CheckCircle2, ChevronDown, Star,
} from 'lucide-react';
import { ProductCard } from '@/features/products/ProductCard';
import { useFeaturedProducts } from '@/hooks/useProducts';
import { Helmet } from 'react-helmet-async';
import { useState } from 'react';

/* ── Data ── */
const CATEGORIES = [
  { name: 'Windows',   icon: '🪟', slug: 'windows'  },
  { name: 'Office',    icon: '📊', slug: 'office'   },
  { name: 'Antivirus', icon: '🛡️', slug: 'antivirus'},
  { name: 'VPN',       icon: '🔒', slug: 'vpn'      },
  { name: 'Adobe',     icon: '🎨', slug: 'adobe'    },
  { name: 'Gaming',    icon: '🎮', slug: 'gaming'   },
];

const WHY_US = [
  { icon: Shield,     title: 'Genuine Products',      desc: 'Sourced exclusively from authorized distributors.' },
  { icon: Zap,        title: 'Fast Delivery',          desc: 'Most orders fulfilled within 1–4 hours.'           },
  { icon: Headphones, title: '24/7 Support',           desc: 'Expert help available around the clock.'           },
  { icon: Award,      title: 'Activation Guarantee',  desc: 'Full refund if any key doesn\'t work.'             },
];

const STEPS = [
  { n: '01', icon: Package,      title: 'Browse & Select', desc: 'Find software from our verified catalog.'         },
  { n: '02', icon: Key,          title: 'Place Your Order', desc: 'Checkout and add any notes for our team.'         },
  { n: '03', icon: CheckCircle2, title: 'Get Your Key',     desc: 'License key delivered straight to your dashboard.'},
];

const FAQS = [
  { q: 'How do I receive my license key?',
    a: 'After placing your order, our team assigns a verified key. You\'ll find it in your dashboard under "My Orders".' },
  { q: 'Are the keys genuine?',
    a: 'Yes. All keys come from authorized resellers and Microsoft Volume Licensing partners, with activation guarantees.' },
  { q: 'How long does delivery take?',
    a: 'Most orders are processed within 1–4 hours. During peak periods it may take up to 24 hours.' },
  { q: 'What if my key doesn\'t work?',
    a: 'Contact support with your order ID. We offer a full replacement or refund — no questions asked.' },
  { q: 'Can I use on multiple devices?',
    a: 'Depends on the license type. Single-user covers one device; multi-device options are clearly marked.' },
];

const STATS = [
  { value: '10,000+', label: 'Happy Customers' },
  { value: '500+',    label: 'Products'         },
  { value: '4.9',     label: 'Avg. Rating'      },
  { value: '99.8%',   label: 'Success Rate'     },
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
    <div className="rounded-2xl overflow-hidden border border-white/[0.09] bg-[#161B27]">
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
        <meta name="description" content="Buy genuine Windows, Office, Antivirus and software license keys. Fast delivery, guaranteed activation." />
      </Helmet>

      {/* ════════════════════════════════════
                         HERO
          ════════════════════════════════════ */}
      <section className="relative hero-glow min-h-screen flex items-center bg-[#0F1117]">

        {/* Subtle grid overlay */}
        <div className="absolute inset-0 opacity-[0.028] pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.5) 1px, transparent 1px)',
            backgroundSize: '72px 72px',
          }} />

        <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-36 w-full">
          <div className="max-w-[640px] mx-auto text-center">

            {/* Pill */}
            <motion.div {...fadeUp(0)} className="flex justify-center mb-9">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold border border-[#7C5FFF]/28 bg-[#7C5FFF]/[0.09] text-[#B8A5FF]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0 pulse-dot" />
                Trusted by 10,000+ customers worldwide
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 {...fadeUp(0.06)}
              className="font-black text-white leading-[1.06] tracking-[-0.04em] mb-5"
              style={{ fontSize: 'clamp(42px, 6vw, 70px)' }}
            >
              Premium Software<br />
              <span className="g-text">License Keys</span>
            </motion.h1>

            {/* Sub */}
            <motion.p {...fadeUp(0.12)}
              className="text-[17px] text-white/48 leading-relaxed mb-10 max-w-[440px] mx-auto"
            >
              Windows, Office, Antivirus &amp; more — genuine keys,
              fast delivery, guaranteed activation.
            </motion.p>

            {/* CTAs */}
            <motion.div {...fadeUp(0.18)} className="flex items-center justify-center gap-3 flex-wrap mb-14">
              <Link to="/products"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(124,95,255,0.38)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
              >
                Browse Products <ArrowRight size={16} />
              </Link>
              <Link to="/about"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-medium text-white/55 no-underline border border-white/[0.12] hover:text-white/90 hover:border-white/[0.24] hover:bg-white/[0.04] transition-all duration-200"
              >
                How it works
              </Link>
            </motion.div>

            {/* Trust chips */}
            <motion.div {...fadeUp(0.24)} className="flex items-center justify-center gap-6 flex-wrap">
              {['Genuine Keys', 'SSL Secured', 'Fast Delivery', 'Activation Guarantee'].map(t => (
                <span key={t} className="flex items-center gap-1.5 text-[12px] text-white/32 font-medium">
                  <span className="w-1 h-1 rounded-full bg-[#7C5FFF]/60 shrink-0" />
                  {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2.4 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/18">
          <ChevronDown size={20} />
        </motion.div>
      </section>

      {/* ════════════════════════════════════
                        STATS
          ════════════════════════════════════ */}
      <section className="border-y border-white/[0.08]" style={{ background: 'rgba(124,95,255,0.04)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map(({ value, label }, i) => (
              <motion.div key={label} {...fadeUp(i * 0.06)} className="text-center">
                <div className="text-3xl font-black text-white tracking-tight mb-1 g-text">{value}</div>
                <div className="text-[13px] text-white/42 font-medium">{label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                      CATEGORIES
          ════════════════════════════════════ */}
      <section className="bg-[#0F1117] border-b border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="mb-10">
            <p className="text-[11px] font-bold uppercase tracking-widest g-text mb-2">Browse</p>
            <h2 className="text-[28px] font-extrabold text-white/90 tracking-tight">Software Categories</h2>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <motion.div key={cat.slug} {...fadeUp(i * 0.04)}>
                <Link to={`/products?category=${cat.slug}`}
                  className="flex flex-col items-center gap-3 py-6 px-3 rounded-2xl no-underline border border-white/[0.08] bg-[#161B27] hover:border-[#7C5FFF]/35 hover:bg-[#1E2438] hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <span className="text-[28px]">{cat.icon}</span>
                  <span className="text-[12px] font-semibold text-white/60 group-hover:text-white/90 transition-colors duration-150 text-center">
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
      <section className="border-b border-white/[0.08] bg-[#0D1019]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest g-text mb-2">Top Picks</p>
              <h2 className="text-[28px] font-extrabold text-white/90 tracking-tight">Featured Products</h2>
            </div>
            <Link to="/products"
              className="hidden md:flex items-center gap-1.5 text-[13px] font-semibold text-[#9D86FF] hover:text-[#B8A5FF] no-underline transition-colors duration-150 shrink-0 mb-1"
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
      <section className="bg-[#0F1117] border-b border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="text-center max-w-md mx-auto mb-14">
            <p className="text-[11px] font-bold uppercase tracking-widest g-text mb-2">Why Us</p>
            <h2 className="text-[28px] font-extrabold text-white/90 tracking-tight">Built on trust &amp; speed</h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {WHY_US.map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={title} {...fadeUp(i * 0.08)}
                className="p-6 rounded-2xl border border-white/[0.08] bg-[#161B27] hover:border-[#7C5FFF]/28 hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5 border border-[#7C5FFF]/22 bg-[#7C5FFF]/10">
                  <Icon size={18} className="text-[#9D86FF]" />
                </div>
                <h3 className="text-[14px] font-bold text-white/88 mb-2">{title}</h3>
                <p className="text-[13px] text-white/42 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                    HOW IT WORKS
          ════════════════════════════════════ */}
      <section className="border-b border-white/[0.08]" style={{ background: 'rgba(124,95,255,0.04)' }}>
        <div className="max-w-[1200px] mx-auto px-6 py-20">

          <motion.div {...fadeUp()} className="text-center mb-14">
            <p className="text-[11px] font-bold uppercase tracking-widest g-text mb-2">Process</p>
            <h2 className="text-[28px] font-extrabold text-white/90 tracking-tight">How it works</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-3xl mx-auto">
            {STEPS.map(({ n, icon: Icon, title, desc }, i) => (
              <motion.div key={n} {...fadeUp(i * 0.1)} className="flex flex-col items-center text-center">
                <div className="relative mb-5">
                  <div
                    className="w-16 h-16 rounded-[18px] flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
                  >
                    <Icon size={26} className="text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-black border-2 border-[#7C5FFF] bg-[#0F1117] text-[#9D86FF]">
                    {n}
                  </div>
                </div>
                <h3 className="text-[14px] font-bold text-white/88 mb-2">{title}</h3>
                <p className="text-[13px] text-white/42 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
                         FAQ
          ════════════════════════════════════ */}
      <section className="bg-[#0F1117] border-b border-white/[0.08]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <div className="max-w-[600px] mx-auto">

            <motion.div {...fadeUp()} className="text-center mb-12">
              <p className="text-[11px] font-bold uppercase tracking-widest g-text mb-2">FAQ</p>
              <h2 className="text-[28px] font-extrabold text-white/90 tracking-tight">Common questions</h2>
            </motion.div>

            <div className="space-y-2">
              {FAQS.map((faq, i) => (
                <motion.div key={i} {...fadeUp(i * 0.04)}
                  className="rounded-xl overflow-hidden transition-colors duration-200"
                  style={{
                    border: `1px solid ${openFaq === i ? 'rgba(124,95,255,0.3)' : 'rgba(255,255,255,0.09)'}`,
                    background: openFaq === i ? 'rgba(124,95,255,0.04)' : '#161B27',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left gap-4 bg-transparent border-none cursor-pointer"
                  >
                    <span className="text-[13.5px] font-semibold text-white/85">{faq.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 180 : 0 }} transition={{ duration: 0.2 }} className="shrink-0">
                      <ChevronDown size={15} className="text-white/30" />
                    </motion.span>
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.22 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-[13px] text-white/48 leading-relaxed border-t border-white/[0.07] pt-3.5">
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
      <section className="bg-[#0D1019]">
        <div className="max-w-[1200px] mx-auto px-6 py-20">
          <motion.div {...fadeUp()}
            className="max-w-[620px] mx-auto text-center rounded-3xl px-10 py-16 relative overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(124,95,255,0.15) 0%, rgba(34,211,238,0.08) 100%)',
              border: '1px solid rgba(124,95,255,0.22)',
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(124,95,255,0.2) 0%, transparent 70%)' }} />

            <div className="relative z-10">
              {/* Icon */}
              <div className="flex justify-center mb-5">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}>
                  <Star size={22} className="text-white" />
                </div>
              </div>

              <h2 className="text-[28px] font-extrabold text-white tracking-tight mb-3">
                Ready to get started?
              </h2>
              <p className="text-[15px] text-white/48 mb-8 leading-relaxed">
                Join thousands who trust MyDigiStop for their software needs.
              </p>
              <Link to="/products"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-semibold text-white no-underline transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: 'linear-gradient(135deg, #7C5FFF, #22D3EE)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 28px rgba(124,95,255,0.4)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; }}
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
