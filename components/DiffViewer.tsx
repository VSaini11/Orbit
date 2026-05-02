'use client';

import { motion } from 'framer-motion';

interface DiffViewerProps {
  originalCode: string;
  improvedCode: string;
  language?: string;
}

export function DiffViewer({
  originalCode,
  improvedCode,
  language = 'typescript',
}: DiffViewerProps) {
  const originalLines = originalCode.split('\n');
  const improvedLines = improvedCode.split('\n');
  const maxLines = Math.max(originalLines.length, improvedLines.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid lg:grid-cols-2 gap-4 rounded-lg overflow-hidden border border-border/30"
    >
      {/* Original Code */}
      <div className="bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border/30 bg-red-500/10">
          <p className="text-sm font-medium text-red-400">Before</p>
        </div>
        <div className="flex-1 overflow-x-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code className="text-foreground">
              {originalLines.map((line, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-muted-foreground/50 select-none w-8 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 group-hover:bg-red-500/10 transition-colors px-2 rounded">
                    {line || '\n'}
                  </span>
                </div>
              ))}
              {/* Padding to match height */}
              {Array.from({ length: Math.max(0, improvedLines.length - originalLines.length) }).map(
                (_, i) => (
                  <div key={`pad-orig-${i}`} className="h-6" />
                )
              )}
            </code>
          </pre>
        </div>
      </div>

      {/* Improved Code */}
      <div className="bg-card/30 backdrop-blur-sm overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-border/30 bg-emerald-500/10">
          <p className="text-sm font-medium text-emerald-400">After</p>
        </div>
        <div className="flex-1 overflow-x-auto">
          <pre className="p-4 text-sm leading-relaxed">
            <code className="text-foreground">
              {improvedLines.map((line, i) => (
                <div key={i} className="flex gap-4 group">
                  <span className="text-muted-foreground/50 select-none w-8 text-right flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="flex-1 group-hover:bg-emerald-500/10 transition-colors px-2 rounded">
                    {line || '\n'}
                  </span>
                </div>
              ))}
              {/* Padding to match height */}
              {Array.from({ length: Math.max(0, originalLines.length - improvedLines.length) }).map(
                (_, i) => (
                  <div key={`pad-imp-${i}`} className="h-6" />
                )
              )}
            </code>
          </pre>
        </div>
      </div>
    </motion.div>
  );
}
