'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GitBranch, GitMerge, Search, Cpu, CheckCircle2, Terminal } from 'lucide-react';

const terminalOutput = [
  '> initializing orbit engine...',
  '> scanning repository structure...',
  '> identifying key components...',
  '> analyzing dependency graph...',
  '> detecting optimization patterns...',
  '> generating improvement proposal...',
  '> creating pull request #402...',
  '> running safety checks...',
  '> merging changes to main...',
  '> system optimized successfully.'
];

export const IDEAnimation = () => {
  const [status, setStatus] = useState('analyzing');
  const [lines, setLines] = useState<{ id: number, text: string }[]>([]);

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      if (currentLine < terminalOutput.length) {
        setLines(prev => [...prev, { id: Date.now() + currentLine, text: terminalOutput[currentLine] }]);
        currentLine++;
      } else {
        clearInterval(interval);
        setStatus('completed');
      }
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative rounded-2xl border border-white/5 bg-black/40 backdrop-blur-xl overflow-hidden shadow-2xl"
      >
        {/* IDE Header */}
        <div className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b border-white/5 bg-white/5">
          <div className="flex items-center gap-3 md:gap-6">
            <div className="flex gap-1.5 md:gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/20" />
            </div>
            <div className="flex items-center gap-2 md:gap-3 text-[11px] md:text-[13px] text-white/40 font-medium">
              <Terminal className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline opacity-50">orbit-core</span>
              <span className="hidden sm:inline">/</span>
              <span className="text-white/70">analysis.log</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 rounded bg-white/5 text-[9px] md:text-[11px] text-white/50 border border-white/5">
               <span className={`w-1 h-1 md:w-1.5 md:h-1.5 rounded-full ${status === 'completed' ? 'bg-green-500' : 'bg-primary animate-pulse'}`} />
               <span className="whitespace-nowrap">{status === 'completed' ? 'Optimized' : 'Processing'}</span>
             </div>
          </div>
        </div>

        {/* IDE Content */}
        <div className="grid lg:grid-cols-3 gap-px bg-white/5">
          {/* Left Panel - Code Analysis */}
          <div className="lg:col-span-2 bg-black/40 p-4 md:p-8 space-y-6 md:space-y-8 relative overflow-hidden group">
            {/* Scanning Line Animation */}
            <AnimatePresence>
              {status === 'analyzing' && (
                <motion.div 
                  initial={{ top: '-100%' }}
                  animate={{ top: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="absolute left-0 right-0 h-40 bg-gradient-to-b from-transparent via-white/5 to-transparent z-10 pointer-events-none"
                />
              )}
            </AnimatePresence>

            <div className="space-y-4 md:space-y-6 h-[320px] md:h-[400px] overflow-hidden relative">
              <div className="flex items-center justify-between sticky top-0 bg-black/40 z-20 pb-2 md:pb-4">
                <h3 className="text-xs md:text-sm font-semibold text-white/80 flex items-center gap-2">
                  <Search className="w-3 h-3 md:w-4 md:h-4 text-white/40" />
                  Live Code Analysis
                </h3>
                <div className="text-[9px] md:text-[11px] text-white/30 font-mono">v1.2.0-alpha</div>
              </div>
              
              <div className="space-y-2 md:space-y-4 font-mono text-[11px] md:text-[13px] leading-relaxed relative z-10">
                <AnimatePresence mode="popLayout">
                  {lines.slice(-8).map((line, i) => (
                    <motion.div 
                      key={line.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="flex gap-2 md:gap-4 items-start"
                    >
                      <span className="text-white/10 select-none w-3 md:w-4 text-right">{lines.indexOf(line) + 1}</span>
                      <span className={`${line.text?.startsWith('>') ? 'text-white/70' : 'text-primary/80'} break-all md:break-normal`}>
                        {line.text}
                      </span>
                      {i === lines.slice(-8).length - 1 && status === 'analyzing' && (
                        <motion.span 
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ repeat: Infinity, duration: 0.8 }}
                          className="inline-block w-1.5 h-3 md:w-2 md:h-4 bg-white/40 ml-1 translate-y-0.5"
                        />
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Git Branching Visualization */}
            <div className="pt-6 md:pt-10 border-t border-white/5">
               <div className="flex items-center gap-4 md:gap-12 h-16 md:h-20 relative">
                  <div className="flex items-center gap-2 md:gap-3 text-white/30">
                     <GitBranch className="w-3 h-3 md:w-4 md:h-4" />
                     <span className="text-[9px] md:text-[11px] uppercase tracking-widest font-bold">Main</span>
                  </div>
                  
                  <div className="flex-1 h-[1px] md:h-[2px] bg-white/5 relative">
                     <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: '100%' }}
                        transition={{ duration: 15, ease: "linear" }}
                        className="absolute h-full bg-white/10"
                     />
                     
                     {/* Branch Out Animation */}
                     <AnimatePresence>
                        {lines.length > 5 && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 30, opacity: 1 }}
                            className="absolute left-1/4 top-0 w-[1px] md:w-[2px] bg-primary/40 origin-top"
                          >
                             <div className="absolute bottom-0 left-0 w-24 md:w-32 h-[1px] md:h-[2px] bg-primary/40 flex items-center px-2 md:px-3">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: '100%' }}
                                  transition={{ duration: 4 }}
                                  className="h-full bg-primary/60"
                                />
                                <span className="ml-2 md:ml-4 text-[8px] md:text-[10px] text-primary/80 font-bold whitespace-nowrap">fix/opt-402</span>
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>

                     {/* Merge In Animation */}
                     <AnimatePresence>
                        {status === 'completed' && (
                          <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 30, opacity: 1 }}
                            className="absolute right-1/4 bottom-0 w-[1px] md:w-[2px] bg-green-500/40 origin-bottom"
                          >
                             <div className="absolute top-0 right-0 w-24 md:w-32 h-[1px] md:h-[2px] bg-green-500/40 flex items-center justify-end px-2 md:px-3">
                                <span className="mr-2 md:mr-4 text-[8px] md:text-[10px] text-green-500/80 font-bold whitespace-nowrap">merged</span>
                                <GitMerge className="w-2 h-2 md:w-3 md:h-3 text-green-500" />
                             </div>
                          </motion.div>
                        )}
                     </AnimatePresence>
                  </div>

                  <div className="flex items-center gap-3 text-white/30">
                     <CheckCircle2 className={`w-3 h-3 md:w-4 md:h-4 ${status === 'completed' ? 'text-green-500' : ''}`} />
                  </div>
               </div>
            </div>
          </div>

          {/* Right Panel - System Metrics - Hidden on mobile */}
          <div className="hidden lg:flex bg-black/20 p-8 space-y-8 flex-col justify-between">
            <div className="space-y-6">
              <h3 className="text-sm font-semibold text-white/80 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-white/40" />
                Performance Lift
              </h3>
              
              <div className="grid gap-4">
                 {[
                   { label: 'Latency Reduc.', value: '84%', color: 'text-primary' },
                   { label: 'Token Efficiency', value: '+126%', color: 'text-green-500' },
                   { label: 'Safety Score', value: '99.9', color: 'text-white' },
                 ].map((metric, i) => (
                   <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                      <div className="text-[10px] text-white/30 uppercase font-bold tracking-wider">{metric.label}</div>
                      <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-primary/10 border border-primary/20 relative overflow-hidden group">
               <div className="relative z-10 space-y-3">
                  <div className="text-[11px] text-primary font-bold uppercase tracking-widest">Global Status</div>
                  <div className="text-sm text-white/70 leading-relaxed font-medium">
                    {status === 'completed' ? 'All systems operational. Optimization complete.' : 'Running deep-scan on core modules...'}
                  </div>
               </div>
               <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="absolute -right-4 -bottom-4 w-32 h-32 rounded-full bg-primary/20 blur-2xl"
               />
            </div>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent z-10 pointer-events-none" />
      </motion.div>
    </div>
  );
};
