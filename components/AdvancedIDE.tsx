'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Copy, Check, Play, Zap, ShieldCheck } from 'lucide-react';

interface AdvancedIDEProps {
  originalCode: string;
  fixedCode: string;
  fileName: string;
  language?: string;
  isSimulating?: boolean;
}

export function AdvancedIDE({ 
  originalCode, 
  fixedCode, 
  fileName, 
  language = 'typescript',
  isSimulating = false 
}: AdvancedIDEProps) {
  const [displayText, setDisplayText] = useState(originalCode);
  const [isTyping, setIsTyping] = useState(false);
  const [copied, setCopied] = useState(false);
  const [phase, setPhase] = useState<'original' | 'refactoring' | 'complete'>('original');

  useEffect(() => {
    if (isSimulating) {
      startSimulation();
    } else {
      setDisplayText(originalCode);
      setPhase('original');
    }
  }, [isSimulating, originalCode, fixedCode]);

  const startSimulation = async () => {
    setIsTyping(true);
    setPhase('refactoring');
    
    // Simple typewriter logic for the fix
    let currentText = '';
    const targetText = fixedCode;
    
    setDisplayText(''); // Clear for typing
    
    for (let i = 0; i <= targetText.length; i++) {
      setDisplayText(targetText.slice(0, i));
      // Speed up for longer code
      const delay = targetText.length > 200 ? 5 : 15;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    
    setIsTyping(false);
    setPhase('complete');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(fixedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple syntax highlighting (regex based to avoid dependencies)
  const highlightCode = (code: string) => {
    if (!code) return '';
    return code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"(.*?)"/g, '<span class="text-green-400">"$1"</span>')
      .replace(/'(.*?)'/g, '<span class="text-green-400">\'$1\'</span>')
      .replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|await|async|try|catch|new|class|extends|interface|type|public|private)\b/g, '<span class="text-purple-400">$1</span>')
      .replace(/\b(string|number|boolean|any|void|unknown|never|Promise)\b/g, '<span class="text-blue-400">$1</span>')
      .replace(/\/\/(.*)/g, '<span class="text-muted-foreground italic">//$1</span>')
      .replace(/\b(\d+)\b/g, '<span class="text-orange-400">$1</span>');
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0e] shadow-2xl shadow-primary/10">
      {/* IDE Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#1a1a1c] border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/50" />
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white/5 border border-white/10">
            <Terminal className="w-3 h-3 text-primary" />
            <span className="text-xs font-mono text-muted-foreground">{fileName}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
            phase === 'refactoring' ? 'bg-primary/20 text-primary animate-pulse' : 
            phase === 'complete' ? 'bg-green-500/20 text-green-400' : 
            'bg-muted/50 text-muted-foreground'
          }`}>
            {phase === 'refactoring' && <Zap className="w-3 h-3" />}
            {phase === 'complete' && <ShieldCheck className="w-3 h-3" />}
            {phase}
          </div>
          <button 
            onClick={handleCopy}
            className="p-1.5 hover:bg-white/10 rounded-lg transition-colors group"
            title="Copy Fixed Code"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-muted-foreground group-hover:text-foreground" />}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative p-6 font-mono text-sm leading-relaxed overflow-hidden min-h-[300px]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10">
          <pre className="whitespace-pre-wrap break-all">
            <code 
              dangerouslySetInnerHTML={{ __html: highlightCode(displayText) }} 
              className="block"
            />
            {isTyping && <motion.span 
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 0.8 }}
              className="inline-block w-2 h-4 bg-primary ml-1 align-middle"
            />}
          </pre>
        </div>

        {/* Floating Action Button */}
        <AnimatePresence>
          {phase === 'original' && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] z-20"
            >
              <button 
                onClick={startSimulation}
                className="group flex items-center gap-3 px-6 py-3 bg-primary text-primary-foreground rounded-full font-bold text-sm hover:scale-105 transition-all shadow-xl shadow-primary/30"
              >
                <Play className="w-4 h-4 fill-current" />
                Simulate AI Fix
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer Info */}
      <div className="px-6 py-2 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[10px] text-muted-foreground font-mono">
        <div className="flex gap-4">
          <span>UTF-8</span>
          <span>{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-2 text-primary/60">
          <Zap className="w-3 h-3" />
          Powered by Vyana Orbit AI
        </div>
      </div>
    </div>
  );
}
