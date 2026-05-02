'use client';

import { motion } from 'framer-motion';

type Status = 'clean' | 'optimized' | 'needs-improvement' | 'warning' | 'neutral';

interface StatusTagProps {
  status: Status;
  label: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<Status, { bg: string; text: string; border: string }> = {
  clean: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  optimized: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  'needs-improvement': {
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
  },
  warning: {
    bg: 'bg-red-500/10',
    text: 'text-red-400',
    border: 'border-red-500/30',
  },
  neutral: {
    bg: 'bg-muted',
    text: 'text-muted-foreground',
    border: 'border-border',
  },
};

const sizeConfig = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export function StatusTag({
  status,
  label,
  icon,
  size = 'md',
}: StatusTagProps) {
  const config = statusConfig[status];
  const sizeClass = sizeConfig[size];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex items-center gap-2 rounded-full border font-medium ${sizeClass} ${config.bg} ${config.text} ${config.border}`}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {label}
    </motion.div>
  );
}
