'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { UploadZone } from '@/components/UploadZone';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { motion } from 'framer-motion';
import { Code2, AlertCircle, Loader2 } from 'lucide-react';

function UploadContent() {
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');
  
  const [file, setFile] = useState<File | null>(null);
  const [repository, setRepository] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'complete' | 'error'>('idle');
  const [analysisType, setAnalysisType] = useState<'file' | 'github' | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const startAnalysis = async (source: 'file' | 'github', code?: string, fileName?: string, fileObj?: File, repoUrl?: string) => {
    setIsAnalyzing(true);
    setStatus('analyzing');
    setProgress(0);
    setAnalysisType(source);

    // Simulate progress while waiting for API
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + Math.random() * 5;
      });
    }, 500);

    try {
      let response;

      const activeFile = fileObj || file;
      const activeRepoUrl = repoUrl || repository;

      if (source === 'file' && activeFile) {
        if (!projectId) {
          setErrorMessage('Please select a project first.');
          setIsAnalyzing(false);
          setStatus('error');
          return;
        }

        const formData = new FormData();
        formData.append('file', activeFile);
        formData.append('projectId', projectId);

        response = await fetch('/api/analyze/zip', {
          method: 'POST',
          body: formData,
        });
      } else if (source === 'github' && activeRepoUrl) {
        if (!projectId) {
          setErrorMessage('Please select a project first.');
          setIsAnalyzing(false);
          setStatus('error');
          return;
        }

        response = await fetch('/api/analyze/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: activeRepoUrl, projectId }),
        });
      } else {
        throw new Error('Invalid analysis source');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      
      // Store result in localStorage for the analysis page to consume
      localStorage.setItem('latestAnalysis', JSON.stringify(result));
      
      clearInterval(progressInterval);
      setProgress(100);
      setStatus('complete');
      setIsAnalyzing(false);

      // Redirect to analysis page
      setTimeout(() => {
        window.location.href = '/analysis';
      }, 1000);

    } catch (error: any) {
      console.error('Analysis error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred during analysis.');
      clearInterval(progressInterval);
      setStatus('error');
      setIsAnalyzing(false);
    }
  };

  const handleFileSelect = async (selectedFile: File) => {
    setFile(selectedFile);
    startAnalysis('file', undefined, undefined, selectedFile);
  };

  const handleGitHubSubmit = (url: string, token?: string) => {
    setRepository(url);
    startAnalysis('github', undefined, undefined, undefined, url);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="text-center space-y-4 mb-12"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/30 bg-primary/5">
              <span className="w-2 h-2 rounded-full bg-primary"></span>
              <span className="text-xs font-medium text-muted-foreground">Upload Your Code</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Let Orbit Analyze Your Codebase
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload a ZIP file or connect your GitHub repository. We'll analyze it instantly and provide
              intelligent recommendations.
            </p>
          </motion.div>

          {/* Upload Zone */}
          <motion.div
            className="space-y-8"
          >
            <UploadZone
              onFileSelect={handleFileSelect}
              onGitHub={handleGitHubSubmit}
              isLoading={isAnalyzing}
            />

            {/* Progress Indicator */}
            {status !== 'idle' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="p-6 rounded-lg border border-border/30 bg-card/20"
              >
                <ProgressIndicator
                  progress={progress}
                  status={status}
                  message={
                    analysisType === 'file'
                      ? file
                        ? `Analyzing ${file.name}...`
                        : 'Analyzing your code...'
                      : repository
                        ? `Cloning and analyzing ${repository}...`
                        : 'Analyzing repository...'
                  }
                />
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 border-t border-border/30 bg-card/10">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center space-y-12"
          >
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">What We Analyze</h2>
              <p className="text-muted-foreground">
                Orbit examines your entire codebase to identify patterns, issues, and improvements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: 'Code Quality',
                  description:
                    'Detect code smells, duplicate logic, and patterns that reduce maintainability.',
                },
                {
                  title: 'Performance',
                  description:
                    'Identify bottlenecks, inefficient algorithms, and optimization opportunities.',
                },
                {
                  title: 'Security',
                  description:
                    'Spot vulnerabilities, insecure patterns, and compliance issues automatically.',
                },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-lg border border-border/30 bg-card/30 space-y-3"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Code2 className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function UploadPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}>
      <UploadContent />
    </Suspense>
  );
}
