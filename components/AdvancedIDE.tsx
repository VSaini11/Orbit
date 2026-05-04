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
    
    // 1. Escape HTML first
    let text = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // 2. High-density coloring (ordered to prevent tag interference)
    // We use placeholders for strings to avoid double-processing
    const strings: string[] = [];
    text = text.replace(/"(.*?)"/g, (m, p1) => {
      const i = strings.length;
      strings.push(`<span class="text-green-400">"${p1}"</span>`);
      return `__STR_${i}__`;
    });
    
    // Comments
    text = text.replace(/(#|\/\/)(.*)/g, '<span class="text-muted-foreground italic">$1$2</span>');
    
    // Keywords
    text = text.replace(/\b(const|let|var|function|return|if|else|for|while|import|export|from|await|async|try|catch|new|class|extends|interface|type|public|private|def|with|as|yield|lambda|pass|break|continue|None|True|False)\b/g, '<span class="text-purple-400">$1</span>');
    
    // Numbers (safe version without lookbehind)
    text = text.replace(/\b(\d+)\b/g, (m) => `<span class="text-orange-400">${m}</span>`);
    
    // Restore strings
    strings.forEach((s, i) => {
      text = text.replace(`__STR_${i}__`, s);
    });
    
    return text;
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-[#0d0d0e] shadow-2xl shadow-primary/10">
      {/* IDE Header */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a1a1c] border-b border-white/5">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
        </div>
        
        <div className="flex items-center gap-2 px-2 py-0.5 rounded bg-white/5 border border-white/10 max-w-[150px] md:max-w-xs overflow-hidden">
          <Terminal className="w-3 h-3 text-primary shrink-0" />
          <span className="text-[10px] font-mono text-muted-foreground truncate">{fileName}</span>
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded transition-all ${
            phase === 'refactoring' ? 'text-primary' : 
            phase === 'complete' ? 'text-green-400' : 
            'text-muted-foreground'
          }`}>
            {phase === 'refactoring' && <Zap className="w-3 h-3 animate-pulse" />}
            {phase === 'complete' && <ShieldCheck className="w-3 h-3" />}
            <span className="text-[9px] font-bold uppercase tracking-tighter hidden sm:inline">{phase}</span>
          </div>
          <button 
            onClick={handleCopy}
            className="p-1 hover:bg-white/10 rounded transition-colors text-muted-foreground hover:text-foreground"
          >
            {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="relative p-4 font-mono text-[11px] md:text-xs leading-relaxed overflow-hidden min-h-[250px]">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        
        <div className="relative z-10">
          <pre className="whitespace-pre-wrap break-words">
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
      <div className="px-4 py-1.5 bg-white/[0.02] border-t border-white/5 flex justify-between items-center text-[9px] text-muted-foreground font-mono">
        <div className="flex gap-3">
          <span className="hidden xs:inline">UTF-8</span>
          <span className="text-primary/60">{language.toUpperCase()}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500/50 animate-pulse" />
          <span>Vyana Engine 2.5</span>
        </div>
      </div>
    </div>
  );
}
