import { Helmet } from 'react-helmet-async';

export function TermsPage() {
  const sections = [
    { title: '1. Acceptance of Terms', content: 'By accessing and using MyDigiStop, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use this service.' },
    { title: '2. Digital Products', content: 'MyDigiStop sells digital license keys and activation codes for software products. All products are delivered electronically through your account dashboard. Physical delivery is not applicable to any of our products.' },
    { title: '3. Order Fulfillment', content: 'Orders are processed manually by our team. License keys are assigned and delivered within 1-24 hours of order placement. Delivery time may vary based on order volume and verification requirements.' },
    { title: '4. Refund Policy', content: 'We offer a replacement or full refund if a delivered license key does not work as described. Claims must be submitted within 14 days of delivery. Keys that have been activated cannot be refunded.' },
    { title: '5. Account Responsibility', content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Please sign out after each session and keep your login information secure.' },
    { title: '6. Prohibited Activities', content: 'You agree not to resell, redistribute, or share license keys purchased through our platform. Each key is licensed for personal use only, unless specified otherwise on the product page.' },
    { title: '7. Changes to Terms', content: 'MyDigiStop reserves the right to modify these terms at any time. Continued use of the service after changes constitutes acceptance of the new terms.' },
  ];

  return (
    <>
      <Helmet>
        <title>Terms & Conditions — MyDigiStop</title>
      </Helmet>

      <div className="min-h-screen pt-24">
        <div className="py-16 text-center" style={{ background: 'rgba(108,71,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-black text-white mb-4">Terms & Conditions</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          {sections.map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export function PrivacyPage() {
  const sections = [
    { title: 'Information We Collect', content: 'We collect information you provide directly to us, such as your name and email address when you create an account. We also collect Google profile information when you sign in with Google.' },
    { title: 'How We Use Information', content: 'We use the information we collect to operate, maintain, and improve our services, process orders, send transactional emails, and provide customer support.' },
    { title: 'Data Storage', content: 'Your data is stored securely using Supabase, a trusted cloud database provider. All data is encrypted at rest and in transit using industry-standard protocols.' },
    { title: 'Google OAuth', content: 'We use Google OAuth for authentication. When you sign in with Google, we receive your public profile information and email address. We do not have access to your Google account password.' },
    { title: 'Cookies', content: 'We use cookies to maintain your session and remember your preferences. You can disable cookies in your browser settings, but this may affect the functionality of certain features.' },
    { title: 'Third Parties', content: 'We do not sell, trade, or share your personal information with third parties for marketing purposes. We may share data with service providers who help us operate our platform.' },
    { title: 'Your Rights', content: 'You have the right to access, correct, or delete your personal data. To exercise these rights, please contact us at privacy@mydigistop.com.' },
  ];

  return (
    <>
      <Helmet>
        <title>Privacy Policy — MyDigiStop</title>
      </Helmet>

      <div className="min-h-screen pt-24">
        <div className="py-16 text-center" style={{ background: 'rgba(108,71,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="max-w-2xl mx-auto px-4">
            <h1 className="text-4xl font-black text-white mb-4">Privacy Policy</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)' }}>Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
          {sections.map(({ title, content }) => (
            <div key={title}>
              <h2 className="text-xl font-bold text-white mb-3">{title}</h2>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{content}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
