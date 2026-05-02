'use client';

import { motion } from 'framer-motion';
import { Shield, Zap, Code2, Package, Layout, ArrowUpCircle } from 'lucide-react';

interface AnalysisOverviewProps {
  data: {
    security: any[];
    quality: any[];
    dependencies: any[];
    performance: any[];
    upgrades: any[];
    ui: any[];
  };
}

export function AnalysisOverview({ data }: AnalysisOverviewProps) {
  const counts = {
    security: data.security.length,
    quality: data.quality.length,
    dependencies: data.dependencies.length,
    performance: data.performance.length,
    upgrades: data.upgrades.length,
    ui: data.ui.length,
  };

  const totalIssues = Object.values(counts).reduce((a, b) => a + b, 0);
  
  // Calculate health score (0-100)
  // Penalize critical and high severity issues more
  const calculateHealth = () => {
    let penalty = 0;
    data.security.forEach(s => penalty += (s.severity === 'critical' ? 15 : s.severity === 'high' ? 10 : 5));
    data.quality.forEach(q => penalty += (q.severity === 'high' ? 5 : 2));
    data.performance.forEach(p => penalty += (p.severity === 'high' ? 5 : 2));
    
    return Math.max(0, Math.min(100, 100 - penalty));
  };

  const healthScore = calculateHealth();

  const categories = [
    { name: 'Security', count: counts.security, icon: Shield, color: 'text-red-400', bg: 'bg-red-400/10' },
    { name: 'Quality', count: counts.quality, icon: Code2, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { name: 'Performance', count: counts.performance, icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { name: 'Dependencies', count: counts.dependencies, icon: Package, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { name: 'UI/UX', count: counts.ui, icon: Layout, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { name: 'Upgrades', count: counts.upgrades, icon: ArrowUpCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
      {/* Health Score Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-1 p-8 rounded-3xl border border-border bg-gradient-to-br from-card to-card/50 flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        <h3 className="text-lg font-medium text-muted-foreground mb-8 text-center w-full">Orbit Health Score</h3>
        
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-muted/10"
            />
            <motion.circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={552}
              initial={{ strokeDashoffset: 552 }}
              animate={{ strokeDashoffset: 552 - (552 * healthScore) / 100 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={healthScore > 80 ? "text-green-500" : healthScore > 50 ? "text-yellow-500" : "text-red-500"}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-bold tracking-tighter">{healthScore}</span>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Grade A</span>
          </div>
        </div>
        
        <p className="mt-8 text-sm text-center text-muted-foreground">
          Detected <span className="text-foreground font-bold">{totalIssues}</span> items that need your attention.
        </p>
      </motion.div>

      {/* Category Breakdown */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="lg:col-span-2 p-8 rounded-3xl border border-border bg-card/50"
      >
        <h3 className="text-lg font-medium text-muted-foreground mb-8">Analysis Summary</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.div 
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="p-4 rounded-2xl bg-muted/30 border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className={`w-10 h-10 ${cat.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <cat.icon className={`w-5 h-5 ${cat.color}`} />
              </div>
              <div className="text-2xl font-bold mb-1">{cat.count}</div>
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{cat.name}</div>
              
              <div className="mt-3 w-full bg-muted/50 h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (cat.count / 10) * 100)}%` }}
                  className={`h-full ${cat.color.replace('text-', 'bg-')}`}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
