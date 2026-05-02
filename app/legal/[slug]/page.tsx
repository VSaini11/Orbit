'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, FileText, Lock, Scale, Copyright } from 'lucide-react';
import { useParams } from 'next/navigation';

const legalContent: Record<string, { title: string, icon: any, content: string[] }> = {
  privacy: {
    title: 'Privacy Policy',
    icon: <Lock className="w-8 h-8 text-primary" />,
    content: [
      'We respect your privacy and are committed to protecting your personal data.',
      'Orbit only accesses the code repositories you explicitly authorize.',
      'We do not store your source code on our servers after analysis is complete.',
      'All data transmission is encrypted using industry-standard TLS 1.3.',
      'We never sell your data to third parties.'
    ]
  },
  terms: {
    title: 'Terms of Service',
    icon: <Scale className="w-8 h-8 text-primary" />,
    content: [
      'By using Orbit, you agree to these terms and conditions.',
      'Orbit is provided "as is" without any warranties.',
      'You are responsible for maintaining the security of your account and tokens.',
      'You must not use Orbit for any illegal or unauthorized purposes.',
      'We reserve the right to modify or terminate the service at any time.'
    ]
  },
  security: {
    title: 'Security & Disclosure',
    icon: <Shield className="w-8 h-8 text-primary" />,
    content: [
      'We welcome responsible disclosure of security vulnerabilities through our coordinated program.',
      'Research must be conducted on our main domain and related subdomains only.',
      'Researchers must not access, modify, or delete user data during their investigation.',
      'DDoS, brute-force, and social engineering attacks are strictly prohibited.',
      'We commit to acknowledging all valid reports within 48 hours and fixing issues promptly.',
      'We provide "Safe Harbor" and will not take legal action against researchers acting in good faith.',
      'For all security inquiries and vulnerability reports, please contact: vybex.signal@gmail.com'
    ]
  },
  cookies: {
    title: 'Cookie Policy',
    icon: <FileText className="w-8 h-8 text-primary" />,
    content: [
      'We use cookies to improve your experience and analyze site traffic.',
      'Essential cookies are required for the site to function correctly.',
      'Analytical cookies help us understand how you interact with Orbit.',
      'You can manage your cookie preferences through your browser settings.',
      'Third-party cookies may be used for integrated features like GitHub Auth.'
    ]
  },
  license: {
    title: 'License Agreement',
    icon: <Copyright className="w-8 h-8 text-primary" />,
    content: [
      'The Orbit platform and its original content are protected by copyright laws.',
      'We grant you a non-exclusive, non-transferable license to use the service.',
      'You may not reverse engineer or attempt to extract the source code of the platform.',
      'Usage limits are defined by your current subscription tier.',
      'All rights not explicitly granted are reserved by Orbit.'
    ]
  }
};

export default function LegalPage() {
  const params = useParams();
  const slug = params.slug as string;
  const data = legalContent[slug] || legalContent.privacy;

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      
      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-6 sm:px-10 lg:px-16">
        <div className="max-w-4xl mx-auto space-y-12 md:space-y-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6"
          >
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
              {data.icon}
            </div>
            <div className="space-y-1 md:space-y-2">
              <span className="text-[10px] md:text-xs font-bold text-white/20 uppercase tracking-[0.2em]">Legal & Compliance</span>
              <h1 className="text-3xl md:text-6xl font-bold text-white tracking-tight">{data.title}</h1>
            </div>
          </motion.div>

          <div className="space-y-6 md:space-y-12">
            {data.content.map((text, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl border-white/5 group hover:border-white/10 transition-all"
              >
                <div className="flex gap-4 md:gap-6 items-start">
                  <span className="text-xl md:text-2xl font-mono text-white/10 group-hover:text-primary/40 transition-colors">
                    {(i + 1).toString().padStart(2, '0')}
                  </span>
                  <p className="text-base md:text-xl text-white/60 leading-relaxed font-light group-hover:text-white transition-colors break-words">
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pt-8 md:pt-12 border-t border-white/5 text-center"
          >
            <p className="text-white/20 text-xs md:text-sm italic">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
