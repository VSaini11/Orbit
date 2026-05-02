'use client';

import { useState, useEffect } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Plus, Folder, Calendar, ArrowRight, Loader2, Trash2 } from 'lucide-react';

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

import { useSession } from 'next-auth/react';

export default function ProjectsPage() {
  const { data: session } = useSession();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (Array.isArray(data)) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl font-bold mb-2">
              {session?.user?.name ? `Welcome, ${session.user.name.split(' ')[0]}` : 'My Projects'}
            </h1>
            <p className="text-muted-foreground">Manage and analyze your codebases.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex gap-4">
              {/* Simple inline form for project creation */}
              <form onSubmit={handleCreateProject} className="flex gap-2">
                <input
                  type="text"
                  placeholder="New Project Name"
                  className="bg-card border border-border rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                />
                <button
                  type="submit"
                  disabled={isCreating}
                  className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Create
                </button>
              </form>
            </div>
          </motion.div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : projects.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 border border-dashed border-border rounded-2xl bg-card/30"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Folder className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No projects yet</h2>
            <p className="text-muted-foreground mb-6">Create your first project to start analyzing code.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-6 rounded-2xl border border-border bg-card/50 hover:bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Folder className="w-6 h-6 text-primary" />
                  </div>
                  <button 
                    onClick={() => handleDeleteProject(project._id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-1 mb-6">
                  <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{project.name}</h3>
                  {project.latestAnalysis ? (
                    <div className="flex items-center gap-2 mt-1">
                      <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        project.latestAnalysis.sourceType === 'github' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-primary/10 text-primary border border-primary/20'
                      }`}>
                        {project.latestAnalysis.sourceType}
                      </div>
                      <span className="text-xs text-muted-foreground truncate max-w-[150px] font-mono">
                        {project.latestAnalysis.sourceName}
                      </span>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description || 'No analysis performed yet.'}
                    </p>
                  )}
                </div>
                <div className="flex items-center justify-between pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {new Date(project.createdAt).toLocaleDateString()}
                  </div>
                  {project.latestAnalysis ? (
                    <a
                      href={`/analysis?projectId=${project._id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                    >
                      View Report <ArrowRight className="w-4 h-4" />
                    </a>
                  ) : (
                    <a
                      href={`/upload?projectId=${project._id}`}
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
                    >
                      Analyze <ArrowRight className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
