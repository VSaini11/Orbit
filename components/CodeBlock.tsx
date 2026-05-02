'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Download, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
}

export function CodeBlock({
  code,
  language = 'typescript',
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([code], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code.${language === 'typescript' ? 'ts' : language}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const lines = code.split('\n');

  return (
    <div className="rounded-lg border border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm">
      {/* Header */}
      {title && (
        <div className="px-4 py-3 border-b border-border/30 flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <span className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
            {language}
          </span>
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto w-full custom-scrollbar">
        <pre className="p-4 text-sm leading-relaxed min-w-max">
          <code className="text-foreground font-mono">
            {lines.map((line, i) => (
              <div key={i} className="flex gap-4">
                {showLineNumbers && (
                  <span className="text-muted-foreground/50 select-none w-8 text-right shrink-0">
                    {i + 1}
                  </span>
                )}
                <span className="flex-1 whitespace-pre">{line || '\n'}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-border/30 flex items-center justify-end gap-2 bg-background/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopy}
          className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          title="Copy"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleDownload}
          className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
          title="Download"
        >
          <Download className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
