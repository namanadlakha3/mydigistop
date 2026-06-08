import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, Target, Users, Heart, Award, Zap } from 'lucide-react';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — MyDigiStop</title>
        <meta name="description" content="Learn about MyDigiStop — your trusted marketplace for genuine digital licenses." />
      </Helmet>

      <div className="min-h-screen pt-24">
        {/* Hero */}
        <div className="py-20 relative overflow-hidden text-center" style={{ background: 'rgba(108,71,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(108,71,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(108,71,255,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-sm font-semibold uppercase tracking-wider gradient-text">About Us</span>
              <h1 className="text-5xl font-black text-white mt-3 mb-5">We Make Software <br /><span className="gradient-text">Accessible</span></h1>
              <p className="text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                MyDigiStop was founded with a simple mission: make genuine software licenses accessible, affordable, and reliable for everyone.
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-20">
          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            <div>
              <h2 className="text-3xl font-black text-white mb-5">Our Mission</h2>
              <p className="text-lg leading-relaxed mb-4" style={{ color: 'rgba(255,255,255,0.65)' }}>
                We bridge the gap between software publishers and everyday users. Our carefully curated marketplace provides genuine product keys at competitive prices.
              </p>
              <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Every key sold through MyDigiStop is sourced from authorized distributors, ensuring you get a legitimate product that works as expected.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'Genuine Products', color: '#10B981' },
                { icon: Target, label: 'Best Prices', color: '#6C47FF' },
                { icon: Users, label: 'Customer First', color: '#00C2CB' },
                { icon: Award, label: 'Quality Assured', color: '#F59E0B' },
              ].map(({ icon: Icon, label, color }) => (
                <div key={label} className="p-5 rounded-2xl border text-center" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${color}15` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-black text-white mb-8 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Heart, title: 'Customer Trust', desc: 'We build lasting relationships through transparency, honesty, and exceptional service.' },
                { icon: Zap, title: 'Speed & Efficiency', desc: 'We process orders quickly and communicate proactively so you\'re never left waiting.' },
                { icon: Shield, title: 'Security First', desc: 'Your personal data and transactions are protected with enterprise-grade security.' },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="p-6 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, rgba(108,71,255,0.2), rgba(0,194,203,0.2))' }}>
                    <Icon size={22} style={{ color: '#6C47FF' }} />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
