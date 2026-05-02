'use client';

import { AlertCircle, AlertTriangle, Bug, Package, Zap, Code2, Eye, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { SecurityVulnerability, CodeQualityIssue, Dependency, PerformanceIssue, UpgradeSuggestion, UIAnalysis } from '@/lib/mockData';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative bg-card/40 backdrop-blur-sm border border-border/50 rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:bg-card/60 group overflow-hidden ${className}`}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-primary/20 group-hover:bg-primary transition-colors" />
      {children}
    </motion.div>
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const colorMap: Record<string, { bg: string; text: string; border: string }> = {
    critical: { bg: 'bg-red-950/30', text: 'text-red-400', border: 'border-red-700/30' },
    high: { bg: 'bg-orange-950/30', text: 'text-orange-400', border: 'border-orange-700/30' },
    medium: { bg: 'bg-yellow-950/30', text: 'text-yellow-400', border: 'border-yellow-700/30' },
    low: { bg: 'bg-blue-950/30', text: 'text-blue-400', border: 'border-blue-700/30' },
    none: { bg: 'bg-green-950/30', text: 'text-green-400', border: 'border-green-700/30' },
  };

  const colors = colorMap[severity] || colorMap.low;

  return (
    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold ${colors.bg} ${colors.text} border ${colors.border}`}>
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

export function SecurityVulnerabilityCard({ vulnerability }: { vulnerability: SecurityVulnerability }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{vulnerability.title}</h3>
            <SeverityBadge severity={vulnerability.severity} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{vulnerability.description}</p>
          <p className="text-xs text-muted-foreground font-mono">{vulnerability.file}:{vulnerability.line}</p>
          
          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border space-y-3">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Current Code:</p>
                <pre className="bg-muted p-2 rounded text-xs overflow-x-auto text-muted-foreground">
                  {vulnerability.codeSnippet}
                </pre>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1">Recommendation:</p>
                <p className="text-xs text-foreground">{vulnerability.recommendation}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export function CodeQualityCard({ issue }: { issue: CodeQualityIssue }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Bug className="w-5 h-5 text-orange-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{issue.title}</h3>
            <SeverityBadge severity={issue.severity} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
          <p className="text-xs text-muted-foreground font-mono">{issue.file}</p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Impact:</p>
                <p className="text-xs text-foreground">{issue.impact}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1">Suggestion:</p>
                <p className="text-xs text-foreground">{issue.suggestion}</p>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export function DependencyCard({ dependency }: { dependency: Dependency }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Package className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-mono text-sm font-semibold text-foreground">{dependency.name}</h3>
            <SeverityBadge severity={dependency.severity} />
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span>{dependency.currentVersion}</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="text-green-400 font-semibold">{dependency.latestVersion}</span>
          </div>
          <p className="text-sm text-muted-foreground">{dependency.description}</p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold capitalize text-muted-foreground mb-1">Status: {dependency.status}</p>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            {isExpanded ? 'Hide' : 'Update'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export function PerformanceCard({ issue }: { issue: PerformanceIssue }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Zap className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{issue.title}</h3>
            <SeverityBadge severity={issue.severity} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
          <p className="text-xs text-muted-foreground font-mono">{issue.file}</p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div>
                <p className="text-xs font-semibold text-muted-foreground mb-1">Impact:</p>
                <p className="text-xs text-foreground">{issue.impact}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1">Improvement:</p>
                <p className="text-xs text-foreground">{issue.improvement}</p>
              </div>
              <div className="flex items-center gap-2 p-2 bg-green-950/20 rounded border border-green-700/20">
                <Zap className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-xs font-semibold text-green-400">{issue.estimatedGain}</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export function UpgradeCard({ suggestion }: { suggestion: UpgradeSuggestion }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const difficultyColor = {
    easy: 'bg-green-950/30 text-green-400 border-green-700/30',
    medium: 'bg-yellow-950/30 text-yellow-400 border-yellow-700/30',
    hard: 'bg-red-950/30 text-red-400 border-red-700/30',
  };

  return (
    <Card>
      <div className="flex items-start gap-3">
        <Code2 className="w-5 h-5 text-purple-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{suggestion.category}</h3>
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${difficultyColor[suggestion.difficulty]}`}>
              {suggestion.difficulty.charAt(0).toUpperCase() + suggestion.difficulty.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="font-mono">{suggestion.current}</span>
            <span className="text-muted-foreground/50">→</span>
            <span className="font-mono text-green-400">{suggestion.suggested}</span>
          </div>
          <p className="text-sm text-muted-foreground">{suggestion.reason}</p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border">
              <p className="text-xs font-semibold text-green-400 mb-1">Benefit:</p>
              <p className="text-xs text-foreground">{suggestion.benefit}</p>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        </div>
      </div>
    </Card>
  );
}

export function UIAnalysisCard({ analysis }: { analysis: UIAnalysis }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryIcon = {
    'Accessibility': AlertTriangle,
    'Mobile Responsiveness': Eye,
    'Performance': Zap,
    'UX': Code2,
  };

  const IconComponent = categoryIcon[analysis.category as keyof typeof categoryIcon] || Code2;

  return (
    <Card>
      <div className="flex items-start gap-3">
        <IconComponent className="w-5 h-5 text-cyan-500 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <h3 className="font-semibold text-foreground">{analysis.component}</h3>
            <span className="text-xs px-2 py-0.5 bg-muted rounded text-muted-foreground">{analysis.category}</span>
            <SeverityBadge severity={analysis.severity} />
          </div>
          <p className="text-sm text-muted-foreground mb-2">{analysis.issue}</p>

          {isExpanded && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div>
                <p className="text-xs font-semibold text-green-400 mb-1">Recommendation:</p>
                <p className="text-xs text-foreground">{analysis.recommendation}</p>
              </div>
              <div className="flex gap-3 text-xs">
                {analysis.impactsAccessibility && (
                  <span className="flex items-center gap-1 text-orange-400">
                    <AlertTriangle className="w-3 h-3" /> Accessibility
                  </span>
                )}
                {analysis.impactsPerformance && (
                  <span className="flex items-center gap-1 text-yellow-400">
                    <Zap className="w-3 h-3" /> Performance
                  </span>
                )}
              </div>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            {isExpanded ? 'Show less' : 'Show details'}
          </button>
        </div>
      </div>
    </Card>
  );
}
