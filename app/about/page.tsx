'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Zap, Users, Code2 } from 'lucide-react';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center text-center space-y-6 md:space-y-10"
          >
            {/* Hero */}
            <motion.div variants={itemVariants} className="space-y-4 md:space-y-6 max-w-3xl">
              <div className="flex items-center justify-center gap-3">
                <span className="text-[12px] md:text-[14px] font-medium text-white/40 tracking-wide uppercase">Our Mission</span>
              </div>

              <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                Architecting the <br className="hidden md:block" />
                future of code.
              </h1>

              <p className="text-base md:text-xl text-white/40 leading-relaxed max-w-2xl mx-auto font-medium tracking-tight">
                Orbit was born out of a simple observation: codebases are growing faster than human ability to audit them. We are building the intelligence layer that makes complex systems understandable.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 md:py-32 px-6 sm:px-10 lg:px-16 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">The Orbit Story</h2>
          <div className="space-y-4 md:space-y-6 text-lg md:text-xl text-white/60 leading-relaxed font-light">
            <p>
              Orbit started as a personal mission to solve a problem I faced every day: the overwhelming complexity of modern codebases. I wanted a tool that didn't just find bugs, but actually understood the "why" behind the code.
            </p>
            <p>
              Built by a single developer with a vision for cleaner, safer software, Orbit is designed to be the ultimate companion for those who build. It's not just a tool; it's a new way of looking at your architecture.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
