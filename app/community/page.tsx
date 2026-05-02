'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { MessageSquare, Github, Twitter, Slack, Users, Star } from 'lucide-react';

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto relative z-10 w-full text-center space-y-6 md:space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4 md:space-y-6 max-w-3xl mx-auto"
          >
            <span className="text-[12px] md:text-[14px] font-medium text-white/40 tracking-wide uppercase">Orbit Community</span>
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Connect with <br className="hidden md:block" />
              the builders.
            </h1>
            <p className="text-base md:text-xl text-white/40 leading-relaxed font-medium tracking-tight">
              Join thousands of developers who are using Orbit to build better systems. Share insights, report bugs, and shape the future of code analysis.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Social Hub */}
      <section className="py-16 md:py-32 px-6 sm:px-10 lg:px-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                icon: <Github className="w-5 h-5 md:w-6 md:h-6" />,
                title: "GitHub Discussions",
                desc: "Ask questions, share ideas, and get help from the community directly in our repository.",
                link: "https://github.com"
              },
              {
                icon: <MessageSquare className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Discord Server",
                desc: "Real-time chat with other Orbit users and the developer (me!). Get instant feedback.",
                link: "#"
              },
              {
                icon: <Twitter className="w-5 h-5 md:w-6 md:h-6" />,
                title: "Twitter / X",
                desc: "Follow us for the latest updates, feature releases, and community spotlights.",
                link: "#"
              }
            ].map((social, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 md:p-10 rounded-[24px] md:rounded-[32px] space-y-4 md:space-y-6 border-white/5 hover:border-white/10 transition-all group"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  {social.icon}
                </div>
                <div className="space-y-2 md:space-y-3">
                  <h3 className="text-xl md:text-2xl font-bold text-white">{social.title}</h3>
                  <p className="text-sm md:text-white/40 leading-relaxed font-medium">
                    {social.desc}
                  </p>
                </div>
                <button className="text-xs md:text-sm font-bold text-white/60 hover:text-white transition-colors flex items-center gap-2">
                  Join Now →
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contribution Section */}
      <section className="py-20 md:py-32 px-6 sm:px-10 lg:px-16 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-xs font-bold text-white/40 uppercase tracking-widest">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> Open Source Spirit
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight">Help us make Orbit better for everyone.</h2>
          <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light">
            We value community contributions. Whether it's fixing a typo in the docs or suggesting a new AI analysis pattern, your input drives the project forward.
          </p>
          <div className="pt-4 md:pt-8">
            <button className="px-8 py-4 md:px-10 md:py-5 rounded-full bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-95 text-sm md:text-[15px]">
              Contribute on GitHub
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
