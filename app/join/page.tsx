'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Cpu, Globe, Rocket, Star, Briefcase, Info } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  category: string;
  type: string;
  location: string;
}

export default function JoinPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch('/api/jobs');
        const data = await res.json();
        setJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const categories = ['Engineering', 'AI Research', 'Product Design', 'Customer Success', 'Marketing', 'Operations'];
  const jobsByCategory = (category: string) => jobs.filter(j => j.category === category);

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
            <span className="text-[12px] md:text-[14px] font-medium text-white/40 tracking-wide uppercase">Careers</span>
            <h1 className="text-4xl md:text-7xl font-bold text-white leading-[1.1] tracking-tight">
              Build the core <br className="hidden md:block" />
              of intelligence.
            </h1>
            <p className="text-base md:text-xl text-white/40 leading-relaxed font-medium tracking-tight">
              Join a remote-first team of engineers, designers, and AI researchers dedicated to making the world's code better.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Jobs Section */}
      <section className="py-16 md:py-32 px-6 sm:px-10 lg:px-16 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto space-y-16 md:space-y-24">
          <div className="max-w-2xl space-y-2 md:space-y-4">
            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight">Open Positions</h2>
            <p className="text-base md:text-xl text-white/40 font-light">We are hiring across all departments to support our rapid growth.</p>
          </div>

          {loading ? (
            <div className="grid gap-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 glass-panel rounded-2xl md:rounded-3xl" />
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="glass-panel p-10 md:p-20 rounded-[32px] md:rounded-[40px] text-center space-y-6 md:space-y-8 relative overflow-hidden border-white/5"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
              <div className="w-16 h-16 md:w-20 md:h-20 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex items-center justify-center mx-auto relative z-10">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 text-white/20" />
              </div>
              <div className="space-y-3 md:space-y-4 relative z-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white">No current openings</h3>
                <p className="text-white/40 max-w-md mx-auto text-base md:text-lg leading-relaxed">
                  We don't have any active roles at the moment, but we're always looking for exceptional talent. Feel free to reach out.
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-16 md:space-y-20">
              {categories.map(category => {
                const categoryJobs = jobsByCategory(category);
                if (categoryJobs.length === 0) return null;

                return (
                  <div key={category} className="space-y-6 md:space-y-8">
                    <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-4">
                      {category}
                      <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] md:text-[11px] font-bold text-white/40 tracking-widest uppercase">
                        {categoryJobs.length} Roles
                      </span>
                    </h3>
                    <div className="grid gap-4">
                      {categoryJobs.map((job) => (
                        <motion.div
                          key={job._id}
                          initial={{ opacity: 0, y: 10 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          className="glass-panel p-6 md:p-8 rounded-2xl md:rounded-3xl flex flex-col md:flex-row md:items-center justify-between group hover:bg-white/[0.04] border-white/5 transition-all cursor-pointer"
                        >
                          <div className="space-y-2">
                            <h4 className="text-xl md:text-2xl font-bold text-white group-hover:text-primary transition-colors">{job.title}</h4>
                            <div className="flex flex-wrap items-center gap-4 md:gap-6 text-xs md:text-sm font-medium text-white/40">
                              <span className="flex items-center gap-2">
                                <Globe className="w-3.5 h-3.5 md:w-4 md:h-4" /> {job.location}
                              </span>
                              <span className="flex items-center gap-2">
                                <Rocket className="w-3.5 h-3.5 md:w-4 md:h-4" /> {job.type}
                              </span>
                            </div>
                          </div>
                          <div className="mt-6 md:mt-0 flex items-center gap-4">
                            <span className="text-[11px] md:text-[13px] font-bold text-white/20 uppercase tracking-widest group-hover:text-white/40 transition-colors">Apply Now</span>
                            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white text-white group-hover:text-black transition-all">
                              <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

