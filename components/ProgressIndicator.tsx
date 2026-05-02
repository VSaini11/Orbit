'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  progress: number;
  status: 'idle' | 'analyzing' | 'complete' | 'error';
  message?: string;
}

export function ProgressIndicator({ progress, status, message }: ProgressIndicatorProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'analyzing':
        return 'from-primary to-secondary';
      case 'complete':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-muted to-muted-foreground';
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'analyzing':
        return 'Analyzing...';
      case 'complete':
        return 'Complete!';
      case 'error':
        return 'Error';
      default:
        return 'Ready to analyze';
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {message || getStatusLabel()}
          </p>
          <p className="text-sm text-muted-foreground">{Math.round(progress)}%</p>
        </div>

        <div className="w-full h-2 rounded-full bg-card overflow-hidden border border-border/30">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
            className={`h-full bg-gradient-to-r ${getStatusColor()}`}
          />
        </div>
      </div>

      {status === 'analyzing' && (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="flex items-center gap-2 text-sm text-muted-foreground"
        >
          <span className="w-2 h-2 rounded-full bg-primary"></span>
          Processing your code...
        </motion.div>
      )}

      {status === 'error' && (
        <div className="text-sm text-red-400">
          An error occurred. Please try again.
        </div>
      )}
    </div>
  );
}
