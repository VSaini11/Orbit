'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CodeBlock } from '@/components/CodeBlock';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const sections = [
  {
    id: 'how-it-works',
    title: 'How it Works',
    subsections: [
      {
        id: 'the-process',
        title: 'The Analysis Flow',
        content: 'Orbit uses a multi-stage analysis pipeline powered by advanced AI models (Gemini & Claude).',
        code: `1. Code Ingestion: Raw code or GitHub repos are ingested.
2. Intelligent Chunking: Files are selected based on relevance.
3. AI Processing: Our engine audits code for security, quality, and performance.
4. JSON Generation: A structured report with refactoring suggestions is generated.
5. Real-time Dashboard: View results instantly on your dashboard.`,
      },
      {
        id: 'integration',
        title: 'Integration',
        content: 'You can integrate Orbit directly into your existing workflow using our REST API or by connecting your GitHub account for automated PR analysis.',
        code: `// Example: Automated Integration
- Connect GitHub Repository
- Trigger on Push or Pull Request
- Receive Analysis Report in the PR comments (Coming Soon)`,
      },
    ],
  },
  {
    id: 'getting-started',
    title: 'Getting Started',
    subsections: [
      {
        id: 'overview',
        title: 'Overview',
        content:
          'Vyana Orbit is an intelligent codebase analysis tool that helps you understand, improve, and maintain your code. Upload your code or connect your GitHub repository, and we\'ll provide detailed analysis and recommendations.',
      },
      {
        id: 'quickstart',
        title: 'Quick Start',
        content: 'Get up and running in just 3 steps:',
        code: `1. Visit https://orbit.vyana.io/upload
2. Upload your code as a ZIP file or connect GitHub
3. Wait for analysis to complete (usually 10-30 seconds)
4. Review recommendations and improvements`,
      },
    ],
  },
  {
    id: 'features',
    title: 'Features',
    subsections: [
      {
        id: 'code-analysis',
        title: 'Code Analysis',
        content: 'Orbit analyzes your code for quality metrics, complexity, and potential improvements.',
        code: `The analysis includes:
- Code complexity metrics
- Function analysis
- Component detection
- Duplicate code detection
- Code smell identification`,
      },
      {
        id: 'security',
        title: 'Security Scanning',
        content: 'Automatic security vulnerability detection across your codebase.',
        code: `Security checks include:
- Known vulnerabilities
- Insecure patterns
- SQL injection risks
- XSS vulnerabilities
- Dependency vulnerabilities`,
      },
    ],
  },
  {
    id: 'api',
    title: 'API Reference',
    subsections: [
      {
        id: 'file-analysis',
        title: 'Single File Analysis',
        content: 'Analyze a single file by sending its raw content. This endpoint is ideal for IDE integrations.',
        code: `POST orbit-website-url/api/analyze
Content-Type: application/json

{
  "code": "function hello() { console.log('world'); }",
  "fileName": "hello.js",
  "projectId": "your-project-id",
  "sourceType": "file"
}`,
      },
      {
        id: 'github-analysis',
        title: 'GitHub Analysis',
        content: 'Trigger a full codebase analysis by providing a GitHub repository URL.',
        code: `POST orbit-website-url/api/analyze/github
Content-Type: application/json

{
  "url": "https://github.com/user/repo",
  "projectId": "your-project-id"
}`,
      },
    ],
  },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('how-it-works');
  const [activeSubsection, setActiveSubsection] = useState('the-process');

  const currentSection = sections.find((s) => s.id === activeSection);
  const currentSubsection = currentSection?.subsections.find((ss) => ss.id === activeSubsection);

  // Navigation Logic
  const allSubsections = sections.flatMap(s => 
    s.subsections.map(ss => ({ ...ss, sectionId: s.id }))
  );
  
  const currentIndex = allSubsections.findIndex(ss => ss.id === activeSubsection);

  const handleNext = () => {
    if (currentIndex < allSubsections.length - 1) {
      const next = allSubsections[currentIndex + 1];
      setActiveSection(next.sectionId);
      setActiveSubsection(next.id);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      const prev = allSubsections[currentIndex - 1];
      setActiveSection(prev.sectionId);
      setActiveSubsection(prev.id);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 md:pt-44 pb-12 md:pb-20 px-6 sm:px-10 lg:px-16 relative overflow-hidden flex items-center">
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3"
            >
              <span className="text-[14px] font-medium text-white/40 tracking-wide uppercase">Documentation & Resources</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold text-white leading-[1.1] tracking-tight"
            >
              Everything you need <br />
              to master Orbit.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base md:text-xl text-white/40 leading-relaxed max-w-2xl mx-auto font-medium tracking-tight"
            >
              Learn how to leverage intelligent codebase analysis to improve your systems and streamline your development workflow.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 px-4 sm:px-10 lg:px-16 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-12">
          {/* Sidebar - Horizontal on mobile, Vertical on desktop */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1 w-full overflow-hidden"
          >
            <div className="lg:sticky lg:top-32 space-y-6 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 flex lg:flex-col gap-4 lg:gap-6 no-scrollbar snap-x snap-mandatory">
              {sections.map((section) => (
                <div key={section.id} className="space-y-3 min-w-max lg:min-w-0 snap-start">
                  <button
                    onClick={() => {
                      setActiveSection(section.id);
                      setActiveSubsection(section.subsections[0].id);
                    }}
                    className={`whitespace-nowrap lg:whitespace-normal px-6 py-2.5 rounded-xl font-bold text-sm lg:text-[15px] transition-all ${
                      activeSection === section.id
                        ? 'bg-white/5 border border-white/10 text-white shadow-lg shadow-black/20'
                        : 'text-white/30 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {section.title}
                  </button>

                  {activeSection === section.id && (
                    <div className="hidden lg:block ml-2 space-y-1">
                      {section.subsections.map((subsection) => (
                        <button
                          key={subsection.id}
                          onClick={() => setActiveSubsection(subsection.id)}
                          className={`w-full text-left px-4 py-2 rounded-lg text-xs transition-all flex items-center gap-2 ${
                            activeSubsection === subsection.id
                              ? 'text-white font-semibold'
                              : 'text-white/40 hover:text-white'
                          }`}
                        >
                          {activeSubsection === subsection.id && (
                            <ChevronRight className="w-3 h-3 text-primary" />
                          )}
                          {subsection.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3 space-y-12 w-full max-w-full overflow-hidden"
          >
            {currentSubsection && (
              <>
                <div className="space-y-6 max-w-full">
                  <div className="lg:hidden flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                    {activeSection.replace('-', ' ')} <ChevronRight className="w-3 h-3 shrink-0" /> {currentSubsection.title}
                  </div>
                  <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight break-words">{currentSubsection.title}</h2>
                  <p className="text-lg md:text-xl text-white/60 leading-relaxed font-light whitespace-pre-wrap break-words">
                    {currentSubsection.content}
                  </p>
                </div>

                {currentSubsection.code && (
                  <div className="rounded-3xl overflow-hidden border border-white/5 shadow-2xl bg-black/40 w-full max-w-full">
                    <CodeBlock
                      code={currentSubsection.code}
                      language="bash"
                      title={`${currentSubsection.title} Example`}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="pt-12 border-t border-white/5 flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className={`flex-1 px-8 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md text-white font-bold transition-all active:scale-95 text-sm ${
                      currentIndex === 0 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/10'
                    }`}
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={handleNext}
                    disabled={currentIndex === allSubsections.length - 1}
                    className={`flex-1 px-8 py-4 rounded-2xl bg-white text-black font-bold transition-all active:scale-95 text-sm ${
                      currentIndex === allSubsections.length - 1 ? 'opacity-20 cursor-not-allowed' : 'hover:bg-white/90'
                    }`}
                  >
                    Next →
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-32 px-6 sm:px-10 lg:px-16 relative">
        <div className="max-w-4xl mx-auto space-y-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-4"
          >
            <h2 className="text-4xl md:text-5xl font-semibold text-white leading-[1.2] tracking-tight">Frequently Asked Questions</h2>
          </motion.div>

          <div className="grid gap-6">
            {[
              {
                q: 'What should I do if my analysis is taking too long?',
                a: 'Most analyses complete within 30 seconds. If the progress bar seems stuck for more than 2 minutes, please refresh the page. Your analysis progress is saved, and you can resume from your dashboard.',
              },
              {
                q: 'Why am I unable to connect my GitHub repository?',
                a: 'Please ensure you have authorized Orbit to access your repositories. For private repos, double-check that your GitHub session is active and that you have the required permissions for that specific repository.',
              },
              {
                q: 'Which file formats are supported for direct upload?',
                a: 'We currently support .zip uploads and individual file scanning for web technologies like JavaScript, TypeScript, and JSON. Please ensure your upload does not exceed 50MB.',
              },
              {
                q: 'Where can I find my previous analysis reports?',
                a: 'You can access all your past reports by navigating to the "Projects" or "Dashboard" link in the navigation bar. Ensure you are signed in to see your full history.',
              },
            ].map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel p-8 rounded-2xl space-y-3"
              >
                <h3 className="text-xl font-semibold text-white">{faq.q}</h3>
                <p className="text-white/60 leading-relaxed">{faq.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-panel p-12 text-center space-y-8 rounded-2xl"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Still have questions?</h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Our support team is here to help. Reach out anytime and we'll help you get the most out of Orbit.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <a
                href="mailto:support@vyana.io"
                className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all active:scale-95 inline-flex items-center justify-center gap-2"
              >
                Contact Support
                <span>→</span>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
