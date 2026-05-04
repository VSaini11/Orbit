'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DemoBanner } from '@/components/DemoBanner';
import { motion } from 'framer-motion';
import { mockAnalysisData, getAnalysisSummary, type AnalysisResult } from '@/lib/mockData';
import {
  SecurityVulnerabilityCard,
  CodeQualityCard,
  DependencyCard,
  PerformanceCard,
  UpgradeCard,
  UIAnalysisCard,
} from '@/components/AnalysisCards';
import { AnalysisExplorer } from '@/components/AnalysisExplorer';
import { BarChart3, Shield, Bug, Package, Zap, Code2, Eye, Download, Share2, ArrowRight, Terminal } from 'lucide-react';
import { AnalysisOverview } from '@/components/AnalysisOverview';

function AnalysisContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('projectId');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'security' | 'quality' | 'dependencies' | 'performance' | 'upgrades' | 'ui'
  >('overview');

  const [analysisData, setAnalysisData] = useState<AnalysisResult>(() => {
    if (typeof window === 'undefined') return mockAnalysisData;
    try {
      const saved = localStorage.getItem('latestAnalysis');
      return saved ? JSON.parse(saved) : mockAnalysisData;
    } catch { return mockAnalysisData; }
  });
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const handleExportPDF = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Orbit Analysis: ${analysisData.projectName}`,
          text: `Check out the security and quality analysis for ${analysisData.projectName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const loadAnalysis = async () => {
      setIsLoading(true);
      
      // 1. Try to load from Database if projectId exists
      if (projectId) {
        try {
          const response = await fetch(`/api/projects/${projectId}/analysis`);
          if (response.ok) {
            const data = await response.json();
            setAnalysisData(data);
            setIsLoaded(true);
            setIsLoading(false);
            return;
          }
        } catch (e) {
          console.error('Failed to fetch analysis from DB:', e);
        }
      }

      // 2. Fallback to localStorage for fresh uploads
      const saved = localStorage.getItem('latestAnalysis');
      if (saved) {
        try {
          setAnalysisData(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse saved analysis:', e);
        }
      }
      setIsLoaded(true);
      setIsLoading(false);
    };

    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) loadAnalysis();
    };
    window.addEventListener('pageshow', handlePageShow);

    loadAnalysis();

    return () => window.removeEventListener('pageshow', handlePageShow);
  }, [projectId, pathname]);

  // Only show blank loading state if we have no data at all
  if (isLoading && projectId && !analysisData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full"
          />
          <p className="text-muted-foreground animate-pulse font-medium">Restoring Orbit Intelligence...</p>
        </div>
      </div>
    );
  }

  const summary = getAnalysisSummary(analysisData);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3, count: 0 },
    { id: 'security', label: 'Security', icon: Shield, count: summary.criticalVulnerabilities + summary.highSeverityIssues },
    { id: 'quality', label: 'Quality', icon: Bug, count: summary.codeQualityIssues },
    { id: 'dependencies', label: 'Dependencies', icon: Package, count: summary.outdatedDependencies + summary.vulnerableDependencies },
    { id: 'performance', label: 'Performance', icon: Zap, count: summary.performanceIssues },
    { id: 'upgrades', label: 'Upgrades', icon: Code2, count: analysisData.upgradeSuggestions.length },
    { id: 'ui', label: 'UI/UX', icon: Eye, count: summary.uiIssues },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <motion.div
              className="space-y-2"
            >
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-[9px] font-bold uppercase tracking-wider">
                  <Zap className="w-2.5 h-2.5" /> Analysis Complete
                </div>
                {analysisData.tokenUsage && (
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground text-[9px] font-bold uppercase tracking-wider" title={`Input: ${analysisData.tokenUsage.input} | Output: ${analysisData.tokenUsage.output}`}>
                    <Terminal className="w-2.5 h-2.5 text-primary" />
                    {analysisData.tokenUsage.total.toLocaleString()} Tokens
                  </div>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">Orbit Analysis Report</h1>
              <p className="text-sm text-muted-foreground flex flex-wrap items-center gap-2">
                <span className="font-medium text-foreground">{analysisData.projectName}</span>
                <span className="opacity-30">•</span>
                <span>{mounted ? new Date(analysisData.timestamp).toLocaleDateString(undefined, { dateStyle: 'long' }) : '---'}</span>
              </p>
            </motion.div>

            <motion.div 
              className="flex gap-2 print:hidden"
            >
              <button 
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-border bg-card/50 hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button 
                onClick={handleExportPDF}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-bold hover:shadow-lg hover:shadow-primary/20 transition-all active:scale-95"
              >
                <Download className="w-4 h-4" /> Export PDF
              </button>
            </motion.div>
          </div>



          <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md py-4 -mx-4 px-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as typeof activeTab)}
                    className={`relative px-4 py-2 flex items-center gap-2 whitespace-nowrap rounded-xl transition-all duration-300 ${
                      isActive
                        ? 'text-primary-foreground font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-card'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-xl -z-10"
                        transition={{ type: "spring", duration: 0.6 }}
                      />
                    )}
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-primary'}`} />
                    <span className="text-sm">{tab.label}</span>
                    {tab.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                        isActive ? 'bg-white/20 text-white' : 'bg-primary/10 text-primary'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {activeTab === 'overview' && (
            <motion.div
              className="space-y-12"
            >
              <AnalysisOverview data={{
                security: analysisData.securityVulnerabilities,
                quality: analysisData.codeQualityIssues,
                dependencies: analysisData.dependencies,
                performance: analysisData.performanceIssues,
                upgrades: analysisData.upgradeSuggestions,
                ui: analysisData.uiAnalysis,
              }} />

              {/* Components Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-foreground">Infrastructure Graph</h2>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-3 py-1 rounded-full uppercase tracking-widest">
                    {analysisData.components.length} Modules
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {analysisData.components.map((component, i) => (
                    <motion.div 
                      key={component.id} 
                      className="group p-6 rounded-2xl border border-border bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 blur-2xl -mr-12 -mt-12 rounded-full group-hover:bg-primary/10 transition-colors" />
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Code2 className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-bold text-foreground">{component.name}</h3>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono mb-4 bg-muted/30 p-2 rounded truncate break-all">
                        {component.file}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                        <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> {component.lines} lines</span>
                        <span className="bg-primary/5 text-primary px-2 py-0.5 rounded font-bold uppercase tracking-tighter">{component.dependencies.length} deps</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <AnalysisExplorer 
              items={analysisData.securityVulnerabilities.map(v => ({ ...v, title: v.title }))} 
              type="security" 
              repoUrl={analysisData.repoUrl}
              projectName={analysisData.projectName}
            />
          )}

          {/* Code Quality Tab */}
          {activeTab === 'quality' && (
            <AnalysisExplorer 
              items={analysisData.codeQualityIssues.map(i => ({ ...i, title: i.title }))} 
              type="quality" 
              repoUrl={analysisData.repoUrl}
              projectName={analysisData.projectName}
            />
          )}

          {/* Dependencies Tab */}
          {activeTab === 'dependencies' && (
            <AnalysisExplorer 
              items={analysisData.dependencies.map(d => ({ ...d, title: d.name, severity: d.severity || 'low' }))} 
              type="dependencies" 
              repoUrl={analysisData.repoUrl}
              projectName={analysisData.projectName}
            />
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <AnalysisExplorer 
              items={analysisData.performanceIssues.map(i => ({ ...i, title: i.title }))} 
              type="performance" 
              repoUrl={analysisData.repoUrl}
              projectName={analysisData.projectName}
            />
          )}

          {/* Upgrades Tab */}
          {activeTab === 'upgrades' && (
            <AnalysisExplorer 
              items={analysisData.upgradeSuggestions.map(s => ({ ...s, id: s.id, title: s.category, description: s.reason, severity: s.difficulty === 'hard' ? 'high' : 'medium' }))} 
              type="upgrades" 
              repoUrl={analysisData.repoUrl}
              projectName={analysisData.projectName}
            />
          )}

          {/* UI/UX Tab */}
          {activeTab === 'ui' && (
            <AnalysisExplorer 
              items={analysisData.uiAnalysis.map(a => ({ ...a, title: a.component, description: a.issue }))} 
              type="ui" 
              repoUrl={analysisData.repoUrl}
              projectName={analysisData.projectName}
            />
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 pt-6"
          >
            <Link
              href="/preview"
              className="flex-1 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors text-center"
            >
              View Improvements & Diffs
            </Link>
            <button className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card/50 transition-colors">
              Download Full Report
            </button>
            <Link
              href="/upload"
              className="flex-1 px-6 py-3 rounded-lg border border-border text-foreground font-medium hover:bg-card/50 transition-colors text-center"
            >
              Upload New Code
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <Suspense fallback={<div>Loading Analysis...</div>}>
      <AnalysisContent />
    </Suspense>
  );
}
