'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface SystemCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  highlight?: boolean;
  children?: ReactNode;
}

export function SystemCard({
  title,
  description,
  icon,
  href,
  highlight = false,
  children,
}: SystemCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(45, 122, 109, 0.15)' }}
      transition={{ duration: 0.2 }}
      className={`relative group rounded-xl border p-6 transition-all ${
        highlight
          ? 'border-primary/50 bg-gradient-to-br from-card to-card/50 shadow-lg'
          : 'border-border/50 bg-card/30'
      }`}
    >
      {/* Gradient overlay on hover */}
      <div
        className={`absolute inset-0 rounded-xl transition-opacity duration-300 opacity-0 group-hover:opacity-5 ${
          highlight ? 'bg-primary' : 'bg-primary/30'
        }`}
      />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
        </div>

        {children && <div className="mt-4">{children}</div>}

        {href && (
          <a
            href={href}
            className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:text-primary/80 transition-colors group/link"
          >
            Learn more
            <span className="transition-transform group-hover/link:translate-x-1">→</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}
