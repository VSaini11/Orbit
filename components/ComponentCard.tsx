'use client';

import { motion } from 'framer-motion';
import { StatusTag } from './StatusTag';
import { ChevronRight } from 'lucide-react';

interface ComponentCardProps {
  name: string;
  path: string;
  status: 'clean' | 'optimized' | 'needs-improvement';
  metrics: {
    complexity: number;
    coverage: number;
    issues: number;
  };
  onClick?: () => void;
  isSelected?: boolean;
}

export function ComponentCard({
  name,
  path,
  status,
  metrics,
  onClick,
  isSelected = false,
}: ComponentCardProps) {
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'clean':
        return 'No Changes Needed';
      case 'optimized':
        return 'Optimized';
      case 'needs-improvement':
        return 'Needs Improvement';
      default:
        return status;
    }
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? 'border-primary/50 bg-primary/10 shadow-lg shadow-primary/20'
          : 'border-border/50 bg-card/30 hover:bg-card/50'
      }`}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{name}</h3>
            <p className="text-xs text-muted-foreground truncate">{path}</p>
          </div>
          <ChevronRight className={`w-5 h-5 text-muted-foreground flex-shrink-0 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
        </div>

        {/* Status Tag */}
        <div className="flex items-center gap-2">
          <StatusTag
            status={status}
            label={getStatusLabel(status)}
            size="sm"
          />
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Complexity</p>
            <p className="text-sm font-semibold text-foreground">{metrics.complexity}/10</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Coverage</p>
            <p className="text-sm font-semibold text-foreground">{metrics.coverage}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Issues</p>
            <p className="text-sm font-semibold text-foreground">{metrics.issues}</p>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
