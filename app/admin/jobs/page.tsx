'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Plus, Trash2, Lock, Briefcase, Tag, Globe, Clock } from 'lucide-react';

interface Job {
  _id: string;
  title: string;
  category: string;
  type: string;
  location: string;
}

export default function AdminJobsPage() {
  const pathname = usePathname();
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem('orbit_jobs_cache');
      return cached ? JSON.parse(cached) : [];
    } catch { return []; }
  });
  const [loading, setLoading] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    category: 'Engineering',
    type: 'Full-time',
    location: 'Remote'
  });

  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
        localStorage.setItem('orbit_jobs_cache', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) fetchJobs();
    };
    window.addEventListener('pageshow', handlePageShow);

    fetchJobs();

    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [pathname]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a server-side check
    // Here we'll just check if the input exists and then use it in headers for API calls
    setIsAuthorized(true);
  };

  const handleAddJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(newJob)
      });
      
      if (res.ok) {
        setNewJob({ title: '', category: 'Engineering', type: 'Full-time', location: 'Remote' });
        fetchJobs();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Unauthorized'}`);
      }
    } catch (error) {
      console.error('Error adding job:', error);
    }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      const res = await fetch(`/api/jobs/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password
        }
      });
      
      if (res.ok) {
        fetchJobs();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.error || 'Unauthorized'}`);
      }
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-transparent flex flex-col items-center justify-center p-6">
        <Navbar />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-10 rounded-3xl w-full max-w-md space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-white/40" />
            </div>
            <h1 className="text-3xl font-bold text-white">Admin Access</h1>
            <p className="text-white/40">Enter password to manage job openings</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-white/10 transition-all"
              required
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-95"
            >
              Authorize
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <Navbar />
      <div className="pt-32 pb-20 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto space-y-12">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Job Management</h1>
            <p className="text-white/40">Add or remove job openings for Orbit</p>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs font-mono text-white/60">Admin Session Active</span>
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Add Job Form */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="glass-panel p-8 rounded-3xl sticky top-32 space-y-8">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" /> Add New Role
              </h3>
              <form onSubmit={handleAddJob} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">Job Title</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <input
                      type="text"
                      placeholder="e.g. AI ML Developer"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/20 focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">Category</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                    <select
                      value={newJob.category}
                      onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none appearance-none"
                    >
                      <option>Engineering</option>
                      <option>AI Research</option>
                      <option>Product Design</option>
                      <option>Customer Success</option>
                      <option>Marketing</option>
                      <option>Operations</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">Type</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <select
                        value={newJob.type}
                        onChange={(e) => setNewJob({ ...newJob, type: e.target.value })}
                        className="w-full pl-11 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none appearance-none"
                      >
                        <option>Full-time</option>
                        <option>Contract</option>
                        <option>Part-time</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/40 uppercase tracking-widest">Location</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input
                        type="text"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        className="w-full pl-11 pr-3 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-white text-black font-bold hover:bg-white/90 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  Post Job
                </button>
              </form>
            </div>
          </motion.div>

          {/* Jobs List */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-xl font-bold text-white mb-8">Active Openings ({jobs.length})</h3>
            {loading ? (
              <div className="text-white/20 animate-pulse text-center py-20">Loading jobs...</div>
            ) : jobs.length === 0 ? (
              <div className="glass-panel p-20 rounded-3xl text-center space-y-4">
                <Briefcase className="w-12 h-12 text-white/10 mx-auto" />
                <p className="text-white/40">No active job openings found.</p>
              </div>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <motion.div
                    key={job._id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 rounded-2xl flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-white/40" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white">{job.title}</h4>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-xs text-primary font-medium">{job.category}</span>
                          <span className="text-xs text-white/20">•</span>
                          <span className="text-xs text-white/40">{job.type}</span>
                          <span className="text-xs text-white/20">•</span>
                          <span className="text-xs text-white/40">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteJob(job._id)}
                      className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
