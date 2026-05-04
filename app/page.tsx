'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { SystemCard } from '@/components/SystemCard';
import { AnimatedGraph } from '@/components/AnimatedGraph';
import { IDEAnimation } from '@/components/IDEAnimation';
import { motion } from 'framer-motion';
import { Code2, Zap, GitBranch, TrendingUp, Shield, Cpu } from 'lucide-react';

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

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      <section className="pt-44 pb-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden min-h-[85vh] flex items-center">
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-start text-left space-y-10"
          >
            {/* Content */}
            <motion.div variants={itemVariants} className="space-y-6 max-w-3xl">
              <div className="flex items-center gap-3">
                <span className="text-[14px] font-medium text-white/40 tracking-wide uppercase">Good things need to be improved</span>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight">
                Not everything <br />
                needs change.
              </h1>

              <p className="text-lg md:text-xl text-white/40 leading-relaxed max-w-2xl font-medium tracking-tight">
                Analyze your codebase with intelligence. Detect components that need improvement, skip what works, and understand the system as a whole.
              </p>

              <div className="flex flex-wrap gap-5 pt-8">
                <button
                  onClick={() => router.push('/projects')}
                  className="pl-4 pr-5 py-2.5 rounded-full bg-[#0a0a0a] border border-white/10 text-white font-semibold hover:bg-white/5 transition-all hover:scale-[1.02] active:scale-95 inline-flex items-center gap-4 group"
                >
                  <img src="/logo.png" alt="Orbit" className="w-6 h-6 object-contain" />
                  <span className="text-[15px]">Start Analyzing</span>
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] font-mono text-white/40">
                    <span className="text-[12px]">⌘</span>
                    <span>+</span>
                    <span>J</span>
                  </div>
                </button>
                <Link
                  href="/docs"
                  className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-foreground font-bold hover:bg-white/10 transition-all inline-flex items-center justify-center text-[15px]"
                >
                  View Documentation
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* IDE Animation Section */}
      <div className="-mt-16 relative z-20">
        <IDEAnimation />
      </div>

      {/* Why We Built Orbit Section */}
      <section id="why" className="py-32 px-6 sm:px-10 lg:px-16 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-12"
          >
            {/* Sub-header */}
            <motion.div variants={itemVariants} className="flex items-center gap-3 opacity-50">
              <img src="/logo.png" alt="Orbit" className="w-5 h-5 object-contain" />
              <span className="text-[14px] font-medium text-white tracking-wide">Why we built Orbit</span>
            </motion.div>

            {/* Main Headline with Inline Icons */}
            <motion.div variants={itemVariants} className="max-w-4xl">
              <h2 className="text-4xl md:text-5xl font-semibold text-white leading-[1.2] tracking-tight">
                You write the code
                <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 mx-3 align-middle group hover:border-primary/50 transition-colors">
                  <Code2 className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-primary transition-colors" />
                </span>
                and Orbit
                <br />
                manages your improvements
                <span className="inline-flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 mx-3 align-middle group hover:border-green-500/50 transition-colors">
                  <Cpu className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-green-500 transition-colors" />
                </span>
              </h2>
            </motion.div>

            {/* Description */}
            <div className="max-w-3xl pt-8">
              <p className="text-xl md:text-2xl text-white/60 leading-relaxed font-light">
                We built Orbit because codebase evolution meant choosing between two bad options. Manual reviews created bottlenecks and fatigue. Automation-heavy tools led to shallow insights and disconnected fixes. We fix this by bringing deep architectural intelligence to every workflow.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-12 text-center space-y-6 rounded-2xl"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Ready to analyze your codebase?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Upload your code or connect your GitHub repository. Orbit will analyze it instantly.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => router.push('/projects')}
                className="px-8 py-3 rounded-lg bg-white text-black font-semibold hover:bg-white/90 transition-all active:scale-95 inline-flex items-center justify-center gap-2"
              >
                Get Started Free
                <span>→</span>
              </button>
              <Link
                href="/docs"
                className="px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card/50 transition-colors inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
