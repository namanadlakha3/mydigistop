import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Shield, Target, Users, Heart, Award, Zap, CheckCircle2 } from 'lucide-react';

export function AboutPage() {
  return (
    <>
      <Helmet>
        <title>About — MyDigiStop</title>
        <meta name="description" content="Learn about MyDigiStop — your trusted marketplace for genuine digital licenses." />
      </Helmet>

      <div className="min-h-screen pt-24 bg-slate-50">
        {/* Hero */}
        <div className="py-20 text-center bg-white border-b border-slate-200 relative overflow-hidden">
          {/* Soft background dots */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
          <div className="max-w-3xl mx-auto px-4 relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
                About Us
              </span>
              <h1 className="text-5xl font-black text-slate-900 mt-5 mb-5 leading-tight">
                We Make Software{' '}
                <span style={{
                  background: 'linear-gradient(135deg, #4F46E5, #0EA5E9)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}>Accessible</span>
              </h1>
              <p className="text-lg leading-relaxed text-slate-600 max-w-xl mx-auto">
                MyDigiStop was built with a simple mission: make genuine software licenses accessible, 
                affordable, and reliable — for everyone, not just big businesses.
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
              <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3">Our Mission</p>
              <h2 className="text-3xl font-black text-slate-900 mb-5">Built for real people, not corporations</h2>
              <p className="text-lg leading-relaxed mb-4 text-slate-600">
                We bridge the gap between software publishers and everyday users. Our carefully curated marketplace 
                provides genuine product keys at prices that make sense.
              </p>
              <p className="leading-relaxed text-slate-500">
                Every key sold through MyDigiStop is sourced from authorized distributors, ensuring you get 
                a legitimate product that works as expected — no surprises.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                {['Authorized reseller network', 'No gray market keys', 'Activation guarantee on every order'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, label: 'Genuine Products', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0' },
                { icon: Target, label: 'Best Prices',       color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE' },
                { icon: Users,  label: 'Customer First',    color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD' },
                { icon: Award,  label: 'Quality Assured',   color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A' },
              ].map(({ icon: Icon, label, color, bg, border }) => (
                <div key={label} className="p-5 rounded-2xl border text-center hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                  style={{ background: bg, borderColor: border }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ background: `${color}20` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{label}</p>
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
            <p className="text-sm font-bold uppercase tracking-wider text-indigo-600 mb-3 text-center">Our Values</p>
            <h2 className="text-3xl font-black text-slate-900 mb-8 text-center">The principles we live by</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: Heart,
                  title: 'Customer Trust',
                  desc: 'We build lasting relationships through transparency, honesty, and exceptional service — not just for the first sale, but for every one after.',
                  color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8',
                },
                {
                  icon: Zap,
                  title: 'Speed & Efficiency',
                  desc: 'We process orders quickly and communicate proactively. You\'ve paid for your software — you shouldn\'t have to wait around wondering.',
                  color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A',
                },
                {
                  icon: Shield,
                  title: 'Security First',
                  desc: 'Your personal data and transactions are protected with enterprise-grade security. We take your privacy as seriously as our own.',
                  color: '#4F46E5', bg: '#EEF2FF', border: '#C7D2FE',
                },
              ].map(({ icon: Icon, title, desc, color, bg, border }) => (
                <div key={title} className="p-6 rounded-2xl border hover:-translate-y-1 hover:shadow-md transition-all duration-200"
                  style={{ background: bg, borderColor: border }}>
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                    style={{ background: `${color}20` }}>
                    <Icon size={22} style={{ color }} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>
                  <p className="text-sm leading-relaxed text-slate-600">{desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* A note from us */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center p-10 rounded-3xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-sky-50"
          >
            <p className="text-4xl mb-4">👋</p>
            <h3 className="text-xl font-bold text-slate-900 mb-3">A note from our team</h3>
            <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
              We started MyDigiStop because we were frustrated buying software — unclear pricing, 
              sketchy sellers, no support. We built what we wished existed. 
              Every team member personally reviews our process to keep it human and fair.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
