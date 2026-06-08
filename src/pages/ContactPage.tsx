import { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Mail, MessageSquare, Clock, Send, Phone, MapPin, CheckCircle2 } from 'lucide-react';
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

      <div className="min-h-screen pt-24">
        <div className="py-16 text-center" style={{ background: 'rgba(108,71,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-2xl mx-auto px-4">
            <span className="text-sm font-semibold uppercase tracking-wider gradient-text">Contact</span>
            <h1 className="text-4xl font-black text-white mt-3 mb-4">Get In Touch</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>
              Have a question or need support? We're here to help.
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              {[
                { icon: Mail, title: 'Email', value: 'support@mydigistop.com', href: 'mailto:support@mydigistop.com' },
                { icon: Clock, title: 'Response Time', value: 'Within 2-4 hours', href: null },
                { icon: MessageSquare, title: 'Live Chat', value: 'Available Mon-Sat', href: null },
              ].map(({ icon: Icon, title, value, href }) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-start gap-4 p-5 rounded-2xl border"
                  style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(108,71,255,0.12)', border: '1px solid rgba(108,71,255,0.2)' }}>
                    <Icon size={18} style={{ color: '#6C47FF' }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{title}</p>
                    {href ? (
                      <a href={href} className="text-sm text-purple-400 hover:text-purple-300 transition-colors">{value}</a>
                    ) : (
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.55)' }}>{value}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3"
            >
              {sent ? (
                <div className="text-center py-16 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <CheckCircle2 size={48} className="text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">Message Sent!</h3>
                  <p style={{ color: 'rgba(255,255,255,0.55)' }}>We'll get back to you within 2-4 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5 p-6 rounded-2xl border" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }}>
                  <h2 className="text-xl font-bold text-white mb-2">Send us a message</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      id="name" label="Name"
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                    />
                    <Input
                      id="email" label="Email" type="email"
                      value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                    />
                  </div>
                  <Textarea
                    id="message" label="Message"
                    value={message} onChange={(e) => setMessage(e.target.value)}
                    rows={5} placeholder="Describe your issue or question..."
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
