'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ComponentCard } from './ComponentCard';
import { Search } from 'lucide-react';

interface Component {
  id: string;
  name: string;
  path: string;
  status: 'clean' | 'optimized' | 'needs-improvement';
  metrics: {
    complexity: number;
    coverage: number;
    issues: number;
  };
}

interface AnalysisPanelProps {
  components: Component[];
  onComponentSelect: (component: Component) => void;
  selectedId?: string;
}

export function AnalysisPanel({
  components,
  onComponentSelect,
  selectedId,
}: AnalysisPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredComponents = components.filter(
    (comp) =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comp.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: components.length,
    clean: components.filter((c) => c.status === 'clean').length,
    optimized: components.filter((c) => c.status === 'optimized').length,
    needsImprovement: components.filter((c) => c.status === 'needs-improvement').length,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full flex flex-col bg-card/30 rounded-lg border border-border/30 p-6 space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Codebase Analysis</h2>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/10">
            <p className="text-xs text-muted-foreground">Clean</p>
            <p className="text-2xl font-bold text-emerald-400">{stats.clean}</p>
          </div>
          <div className="p-3 rounded-lg bg-blue-500/10">
            <p className="text-xs text-muted-foreground">Optimized</p>
            <p className="text-2xl font-bold text-blue-400">{stats.optimized}</p>
          </div>
          <div className="p-3 rounded-lg bg-orange-500/10">
            <p className="text-xs text-muted-foreground">Issues</p>
            <p className="text-2xl font-bold text-orange-400">{stats.needsImprovement}</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-lg border border-border/50 bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
      </div>

      {/* Component List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {filteredComponents.length > 0 ? (
          filteredComponents.map((component) => (
            <ComponentCard
              key={component.id}
              name={component.name}
              path={component.path}
              status={component.status}
              metrics={component.metrics}
              onClick={() => onComponentSelect(component)}
              isSelected={selectedId === component.id}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No components found
          </div>
        )}
      </div>
    </motion.div>
  );
}
