import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageSquare, Clock, Send, CheckCircle2 } from 'lucide-react';
import { Input, Textarea } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) { toast.error('Please fill all fields'); return; }
    setSent(true);
    toast.success('Message sent! We\'ll get back to you soon.');
  };

  return (
    <>
      <Helmet>
        <title>Contact — MyDigiStop</title>
        <meta name="description" content="Get in touch with the MyDigiStop team for support or inquiries." />
      </Helmet>

      <div className="min-h-screen pt-24 bg-slate-50">
        {/* Header */}
        <div className="py-16 text-center bg-white border-b border-slate-200 relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #4F46E5 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }} />
          <div className="max-w-2xl mx-auto px-4 relative z-10">
            <span className="text-sm font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
              Contact
            </span>
            <h1 className="text-4xl font-black text-slate-900 mt-5 mb-3">Let's talk 💬</h1>
            <p className="text-slate-600 text-lg">
              Have a question or need support? We're real humans — and we actually read every message.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-5">
              <div>
                <h2 className="text-lg font-bold text-slate-800 mb-1">We'd love to hear from you</h2>
                <p className="text-sm text-slate-500">Reach out and we'll get back to you quickly.</p>
              </div>
              {[
                { icon: Mail,         title: 'Email',         value: 'support@mydigistop.com', href: 'mailto:support@mydigistop.com', bg: '#EEF2FF', border: '#C7D2FE', color: '#4F46E5' },
                { icon: Clock,        title: 'Response Time', value: 'Within 2-4 hours',        href: null,                             bg: '#FFFBEB', border: '#FDE68A', color: '#F59E0B' },
                { icon: MessageSquare,title: 'Live Chat',     value: 'Available Mon–Sat',       href: null,                             bg: '#ECFDF5', border: '#A7F3D0', color: '#10B981' },
              ].map(({ icon: Icon, title, value, href, bg, border, color }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 rounded-2xl border hover:-translate-y-0.5 hover:shadow-sm transition-all duration-200"
                  style={{ background: bg, borderColor: border }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: `${color}20` }}>
                    <Icon size={18} style={{ color }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{title}</p>
                    {href ? (
                      <a href={href} className="text-sm text-indigo-600 hover:text-indigo-700 transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm text-slate-600">{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-sky-50 border border-indigo-200">
                <p className="text-sm font-semibold text-slate-800 mb-1">🙌 Quick note</p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We prioritize support queries over general inquiries. If you have an issue with an order, 
                  include your order ID and we'll sort it out fast.
                </p>
              </div>
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              {sent ? (
                <div className="text-center py-16 rounded-2xl border border-emerald-200 bg-emerald-50">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Message sent! 🎉</h3>
                  <p className="text-slate-600">We'll get back to you within 2–4 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}
                  className="space-y-5 p-7 rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 mb-1">Send us a message</h2>
                    <p className="text-sm text-slate-500">We reply to every message — promise.</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="name" label="Your name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Rahul"
                    />
                    <Input
                      id="email" label="Email address" type="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="rahul@example.com"
                    />
                  </div>
                  <Textarea
                    id="message" label="What's on your mind?"
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    rows={5} placeholder="Describe your issue or question — the more detail, the faster we can help..."
                  />
                  <Button type="submit" size="lg" className="w-full gap-2">
                    <Send size={16} /> Send Message
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
