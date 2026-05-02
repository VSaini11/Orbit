'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SystemCard } from '@/components/SystemCard';
import { motion } from 'framer-motion';
import {
  Code2,
  Zap,
  GitBranch,
  TrendingUp,
  Shield,
  Cpu,
  Settings,
  BarChart3,
  Lock,
  Workflow,
  AlertCircle,
  Lightbulb,
} from 'lucide-react';

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

export default function FeaturesPage() {
  const features = [
    {
      title: 'Code Analysis',
      description: 'Deep analysis of your codebase to detect patterns and issues',
      icon: <Code2 className="w-6 h-6" />,
    },
    {
      title: 'Performance Metrics',
      description: 'Get detailed insights into code complexity and performance',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: 'Security Scan',
      description: 'Identify security vulnerabilities and compliance issues',
      icon: <Shield className="w-6 h-6" />,
    },
    {
      title: 'Component Detection',
      description: 'Automatically identify and categorize code components',
      icon: <Cpu className="w-6 h-6" />,
    },
    {
      title: 'Version Control',
      description: 'Compare before and after improvements with detailed diffs',
      icon: <GitBranch className="w-6 h-6" />,
    },
    {
      title: 'Smart Recommendations',
      description: 'Get context-aware improvement suggestions tailored to your code',
      icon: <Lightbulb className="w-6 h-6" />,
    },
    {
      title: 'Real-time Processing',
      description: 'Analyze large codebases instantly with fast processing',
      icon: <Zap className="w-6 h-6" />,
    },
    {
      title: 'Integration Support',
      description: 'Works with GitHub, GitLab, and other popular platforms',
      icon: <Workflow className="w-6 h-6" />,
    },
    {
      title: 'Test Coverage Analysis',
      description: 'View and improve test coverage metrics across your project',
      icon: <BarChart3 className="w-6 h-6" />,
    },
    {
      title: 'Configuration',
      description: 'Customize analysis rules and improvement suggestions',
      icon: <Settings className="w-6 h-6" />,
    },
    {
      title: 'Issue Tracking',
      description: 'Track and manage all detected issues in one place',
      icon: <AlertCircle className="w-6 h-6" />,
    },
    {
      title: 'Security First',
      description: 'Your code is analyzed privately and securely',
      icon: <Lock className="w-6 h-6" />,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5 mx-auto"
          >
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-xs font-medium text-muted-foreground">Comprehensive Features</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-6xl font-bold text-foreground leading-tight"
          >
            Everything You Need to Analyze Your Code
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Vyana Orbit provides a comprehensive suite of tools to understand, analyze, and improve your
            codebase with intelligence.
          </motion.p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={itemVariants}>
                <SystemCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  highlight={i % 4 === 3}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Detailed Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30">
        <div className="max-w-4xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4 mb-12"
          >
            <h2 className="text-3xl font-bold text-foreground">Dive Deeper</h2>
            <p className="text-muted-foreground">
              Learn more about Orbit's advanced capabilities
            </p>
          </motion.div>

          {[
            {
              title: 'Intelligent Code Analysis',
              description:
                'Our AI-powered analysis engine examines your entire codebase to identify patterns, detect code smells, and suggest improvements. We analyze function complexity, code duplication, and potential bugs.',
            },
            {
              title: 'Performance Optimization',
              description:
                'Get detailed insights into performance bottlenecks. We identify slow algorithms, inefficient loops, and other performance issues. Recommendations include specific code changes to improve speed.',
            },
            {
              title: 'Security & Compliance',
              description:
                'Automatically scan for security vulnerabilities, insecure patterns, and compliance issues. Works with common security standards and best practices.',
            },
            {
              title: 'Team Collaboration',
              description:
                'Share analysis reports with your team. Comment on suggestions, track improvements over time, and collaborate on code quality.',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-lg border border-border/30 bg-card/20 space-y-4"
            >
              <h3 className="text-xl font-semibold text-foreground">{item.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{item.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center space-y-8 rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 p-12"
        >
          <h2 className="text-3xl font-bold text-foreground">Ready to analyze your code?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start using Vyana Orbit today. Upload your codebase and get instant, intelligent analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/upload"
              className="px-8 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              Get Started Free
              <span>→</span>
            </a>
            <a
              href="/docs"
              className="px-8 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card/50 transition-colors inline-flex items-center justify-center"
            >
              View Documentation
            </a>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
