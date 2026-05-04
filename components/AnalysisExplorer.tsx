'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  Code2, 
  Terminal, 
  ShieldAlert, 
  Zap, 
  Package, 
  Lightbulb,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Play
} from 'lucide-react';
import { AdvancedIDE } from './AdvancedIDE';

interface ExplorerItem {
  id: string;
  title: string;
  description: string;
  severity: string;
  file?: string;
  line?: number;
  codeSnippet?: string;
  recommendation?: string;
  impact?: string;
  [key: string]: any;
}

interface AnalysisExplorerProps {
  items: ExplorerItem[];
  type: 'security' | 'quality' | 'dependencies' | 'performance' | 'upgrades' | 'ui';
  repoUrl?: string;
  projectName?: string;
}

export function AnalysisExplorer({ items, type, repoUrl, projectName }: AnalysisExplorerProps) {
  const [selectedId, setSelectedId] = useState(items[0]?.id || '');
  const [copied, setCopied] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  const selectedItem = items.find(item => item.id === selectedId) || items[0];

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleApplyFix = async (item: ExplorerItem) => {
    setIsApplying(true);
    
    try {
      if (repoUrl) {
        // Real PR Integration
        const response = await fetch('/api/projects/fix', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            projectName,
            repoUrl,
            file: item.file,
            codeSnippet: item.codeSnippet,
            fixedCode: item.fixedCode || item.recommendation || item.suggestion || item.suggested,
            title: item.title,
            description: item.description
          })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Failed to create PR');
        
        setAppliedIds([...appliedIds, item.id]);
        // Open PR in new tab if user wants
        if (data.prUrl) {
          window.open(data.prUrl, '_blank');
        }
      } else {
        // Simulate PR creation delay for demo/ZIP data
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAppliedIds([...appliedIds, item.id]);
      }
    } catch (e: any) {
      alert(`PR Error: ${e.message}`);
    } finally {
      setIsApplying(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-border rounded-3xl bg-card/10">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Check className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold">All Clear!</h3>
        <p className="text-muted-foreground">No issues detected in this category.</p>
      </div>
    );
  }

  const severityColors = {
    critical: 'text-red-500 bg-red-500/10 border-red-500/20',
    high: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    medium: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    low: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    none: 'text-green-500 bg-green-500/10 border-green-500/20',
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[600px]">
      {/* Sidebar - List of Issues */}
      <div className="lg:w-1/3 space-y-3 overflow-y-auto max-h-[800px] pr-2 custom-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setSelectedId(item.id)}
            className={`w-full text-left p-4 rounded-2xl border transition-all duration-300 relative group ${
              selectedId === item.id 
                ? 'bg-primary/10 border-primary shadow-lg shadow-primary/5' 
                : 'bg-card/40 border-border/50 hover:border-primary/30 hover:bg-card/60'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider border ${severityColors[item.severity as keyof typeof severityColors]}`}>
                    {item.severity}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono truncate">
                    {item.file?.split('/').pop()}
                  </span>
                </div>
                <h4 className={`text-sm font-bold truncate ${selectedId === item.id ? 'text-primary' : 'text-foreground'}`}>
                  {item.title}
                </h4>
              </div>
              <ChevronRight className={`w-4 h-4 transition-transform ${selectedId === item.id ? 'translate-x-1 text-primary' : 'text-muted-foreground'}`} />
            </div>
          </button>
        ))}
      </div>

      {/* Main Content - Detail View */}
      <div className="lg:w-2/3">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="h-full flex flex-col"
          >
            {selectedItem && (
              <div className="bg-card/40 backdrop-blur-md border border-border/50 rounded-3xl p-8 h-full flex flex-col">
                {/* Detail Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                  <div className="space-y-4 max-w-2xl">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl bg-opacity-20 ${severityColors[selectedItem.severity as keyof typeof severityColors].split(' ')[1]}`}>
                        <ShieldAlert className={`w-6 h-6 ${severityColors[selectedItem.severity as keyof typeof severityColors].split(' ')[0]}`} />
                      </div>
                      <h2 className="text-xl font-bold tracking-tight break-words">{selectedItem.title}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {selectedItem.description}
                    </p>
                <div className="flex flex-wrap items-center gap-3 text-[10px] font-mono text-muted-foreground">
                  <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full border border-primary/20 max-w-full overflow-hidden">
                    <Terminal className="w-3 h-3 shrink-0" />
                    <span className="truncate break-all">{selectedItem.file || 'root-file'}</span>
                  </div>
                  {selectedItem.line && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full border border-border/50 shrink-0">
                      Line {selectedItem.line}
                    </div>
                  )}
                </div>
                  </div>
                  
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-muted/30 border border-border/50 min-w-[120px]">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Severity</span>
                    <span className={`text-xl font-black uppercase ${severityColors[selectedItem.severity as keyof typeof severityColors].split(' ')[0]}`}>
                      {selectedItem.severity}
                    </span>
                  </div>
                </div>

                {/* Advanced IDE Simulation */}
                <div className="mb-8">
                  <AdvancedIDE 
                    originalCode={selectedItem.codeSnippet || '// No code context available'} 
                    fixedCode={selectedItem.fixedCode || selectedItem.recommendation || selectedItem.suggestion || selectedItem.suggested || '// Fix suggested by AI'} 
                    fileName={selectedItem.file || 'vulnerability.ts'}
                    isSimulating={selectedId === selectedItem.id}
                  />
                </div>

                {/* Impact & Fix */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-auto">
                  <div className="p-6 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                    <div className="flex items-center gap-2 mb-3 text-orange-400 font-bold text-sm uppercase tracking-wider">
                      <Zap className="w-4 h-4" /> Risk Analysis
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {selectedItem.impact || 'Failure to address this could lead to security compromises or significant performance bottlenecks in production.'}
                    </p>
                  </div>
                  
                  <div className="p-6 rounded-2xl bg-green-500/5 border border-green-500/10">
                    <div className="flex items-center gap-2 mb-3 text-green-400 font-bold text-sm uppercase tracking-wider">
                      <Lightbulb className="w-4 h-4" /> Recommended Fix
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedItem.recommendation || selectedItem.suggestion || 'Apply standard security patterns and ensure proper validation at the entry points.'}
                    </p>
                    <button 
                      onClick={() => handleApplyFix(selectedItem)}
                      disabled={isApplying || appliedIds.includes(selectedItem.id) || !selectedItem.file || selectedItem.file === 'N/A' || selectedItem.file === 'Multiple files'}
                      className={`w-full py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        appliedIds.includes(selectedItem.id)
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : (!selectedItem.file || selectedItem.file === 'N/A' || selectedItem.file === 'Multiple files')
                            ? 'bg-muted text-muted-foreground border border-border cursor-not-allowed opacity-70'
                            : 'bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/20'
                      }`}
                    >
                      {isApplying ? (
                        <>
                          <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full"
                          />
                          Creating Pull Request...
                        </>
                      ) : appliedIds.includes(selectedItem.id) ? (
                        <>
                          <Check className="w-3 h-3" />
                          Fix Applied (PR Created)
                        </>
                      ) : (!selectedItem.file || selectedItem.file === 'N/A' || selectedItem.file === 'Multiple files') ? (
                        <>
                          Manual Fix Required
                        </>
                      ) : (
                        <>
                          <Check className="w-3 h-3" />
                          Apply Resolution
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-border/30">
                  <div className="flex gap-4">
                    <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <MessageSquare className="w-4 h-4" /> Discuss with AI
                    </button>
                    <button className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors">
                      <ExternalLink className="w-4 h-4" /> View Docs
                    </button>
                  </div>
                  <button className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-primary/10 text-primary text-sm font-bold border border-primary/20 hover:bg-primary hover:text-white transition-all">
                    Generate Pull Request
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
