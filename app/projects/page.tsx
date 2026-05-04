'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Folder, 
  Calendar, 
  ArrowRight, 
  Loader2, 
  Trash2, 
  Search,
  Github,
  FileCode,
  LayoutDashboard,
  Sparkles,
  Command
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface Project {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  latestAnalysis?: {
    sourceName: string;
    sourceType: string;
    createdAt: string;
  };
}

export default function ProjectsPage() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Hydration-safe cache loading
  useEffect(() => {
    try {
      const cached = localStorage.getItem('orbit_projects_cache');
      if (cached) {
        setProjects(JSON.parse(cached));
      }
    } catch (e) {
      console.error('Failed to load cache:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [initialLoadDone, setInitialLoadDone] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const fetchProjects = useCallback(async (showFullLoader = false) => {
    if (showFullLoader) setIsLoading(true);
    setIsSyncing(true);
    try {
      const response = await fetch('/api/projects');
      if (response.ok) {
        const data = await response.json();
        if (Array.isArray(data)) {
          setProjects(data);
          localStorage.setItem('orbit_projects_cache', JSON.stringify(data));
        }
      }
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
      setIsSyncing(false);
      setInitialLoadDone(true);
    }
  }, []); // Remove projects.length to avoid dependency cycle

  // 1. Fetch on Auth success
  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Projects: Auth state changed to authenticated, fetching...');
      fetchProjects(projects.length === 0);
    }
  }, [status, fetchProjects]);

  // 2. BFCache & History Wake-up
  useEffect(() => {
    const wakeUp = () => {
      console.log('Projects: Wake-up event detected (pageshow/popstate)');
      fetchProjects();
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        console.log('Projects: Page restored from BFCache');
        wakeUp();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('Projects: Visibility changed to visible');
        wakeUp();
      }
    };
    
    window.addEventListener('pageshow', handlePageShow);
    window.addEventListener('popstate', wakeUp);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
      window.removeEventListener('popstate', wakeUp);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchProjects]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project? This will also delete all analysis history.')) {
      return;
    }

    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        await fetchProjects();
      } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
      }
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, description: newDescription }),
      });
      if (response.ok) {
        setNewName('');
        setNewDescription('');
        await fetchProjects();
      }
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.latestAnalysis?.sourceName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen text-white selection:bg-white/10">
      <Navbar />

      <main className="relative pt-32 pb-24 px-6 sm:px-10 lg:px-16 max-w-7xl mx-auto z-10">
        {/* Top Navigation / Breadcrumbs */}
        <div 
          className="flex items-center gap-2 text-[11px] font-bold text-white/20 mb-8 uppercase tracking-widest"
        >
          <span>Workspace</span>
          <ArrowRight className="w-2.5 h-2.5" />
          <span className="text-white/60">All Projects</span>
        </div>

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
          <div
            className="max-w-2xl space-y-4"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight leading-tight">
              Hello, {session?.user?.name ? session.user.name.split(' ')[0] : 'Explorer'}.
            </h1>
            <p className="text-base text-white/40 leading-relaxed max-w-lg font-medium tracking-tight">
              Manage your systems and architectural intelligence.
            </p>
          </div>

          <div
            className="flex flex-col gap-4 w-full lg:w-auto"
          >
            <form onSubmit={handleCreateProject} className="flex flex-col sm:flex-row gap-2 p-1 bg-white/[0.03] border border-white/10 rounded-[16px] backdrop-blur-xl shadow-xl">
              <div className="relative flex-1 lg:w-64">
                <input
                  type="text"
                  placeholder="Create new project..."
                  className="w-full bg-transparent border-none rounded-xl pl-4 pr-4 py-2.5 text-[14px] focus:ring-0 placeholder:text-white/20 transition-all font-medium"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isCreating}
                className="bg-white text-black px-5 py-2.5 rounded-[12px] text-[13px] font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95 shadow-lg"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Add System
              </button>
            </form>
          </div>
        </div>

        {/* Action Bar */}
        <motion.div 
          className="flex flex-col md:flex-row items-center gap-4 mb-8"
        >
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20 group-focus-within:text-white/60 transition-colors" />
            <input 
              type="text"
              placeholder="Filter by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/[0.02] border border-white/5 rounded-lg pl-10 pr-6 py-2 text-[13px] font-medium focus:border-white/10 focus:bg-white/[0.04] transition-all outline-none"
            />
          </div>
        </motion.div>

        {/* Dashboard Content - prioritize showing cached projects */}
        {projects.length > 0 ? (
          <div className="relative">
            {/* Subtle Syncing Indicator */}
            <AnimatePresence>
              {isSyncing && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -top-12 right-0 flex items-center gap-2 text-[10px] font-bold text-white/20 tracking-widest uppercase"
                >
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Syncing
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project._id}
                    className="group"
                  >
                  <div className="h-full flex flex-col p-4 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 shadow-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-all">
                        {project.latestAnalysis?.sourceType === 'github' ? (
                          <Github className="w-3.5 h-3.5 text-white/60" />
                        ) : (
                          <FileCode className="w-3.5 h-3.5 text-white/60" />
                        )}
                      </div>
                      <button 
                        onClick={() => handleDeleteProject(project._id)}
                        className="p-1.5 text-white/10 hover:text-red-400 hover:bg-red-400/5 rounded-md transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="space-y-1 mb-4 flex-1">
                      <h3 className="text-[15px] font-bold text-white tracking-tight leading-tight truncate group-hover:text-primary transition-colors">{project.name}</h3>
                      {project.latestAnalysis ? (
                        <div className="flex flex-col gap-1 pt-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] font-mono font-bold text-white/20 tracking-wider">
                              {project.latestAnalysis.sourceType.toUpperCase()}
                            </span>
                            <span className="text-[10px] text-white/20 truncate font-medium max-w-[100px]">
                              {project.latestAnalysis.sourceName}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-[12px] text-white/20 font-medium leading-relaxed truncate">
                          {project.description || 'Pending...'}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/10 uppercase tracking-widest">
                        {new Date(project.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </div>
                      
                      <Link
                        href={project.latestAnalysis ? `/analysis?projectId=${project._id}` : `/upload?projectId=${project._id}`}
                        className={`flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-[11px] font-bold transition-all ${
                          project.latestAnalysis 
                            ? 'bg-white text-black hover:bg-white/90' 
                            : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        {project.latestAnalysis ? 'Report' : 'Analyze'}
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 border border-white/5 rounded-2xl bg-white/[0.01]">
            {(status === 'loading' || (isLoading && !initialLoadDone)) ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin text-white/10 mb-4" />
                <p className="text-white/20 text-[10px] font-bold tracking-widest uppercase italic">Re-establishing Orbit</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-4 border border-white/10 text-white/20">
                  <Folder className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold mb-1 tracking-tight text-white">No systems</h2>
                <p className="text-white/40 mb-6 max-w-xs mx-auto text-xs font-medium text-center">
                  Initialize your first project to begin.
                </p>
                {/* Fallback Sync Button if no projects showing */}
                <button 
                  onClick={() => fetchProjects(true)}
                  className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                >
                  Force Sync
                </button>
              </>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
