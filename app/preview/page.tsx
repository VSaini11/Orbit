'use client';

import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { DiffViewer } from '@/components/DiffViewer';
import { DemoBanner } from '@/components/DemoBanner';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Copy, Download, Zap, Shield, AlertCircle } from 'lucide-react';

const mockImprovements = [
  {
    id: 1,
    title: 'Fix SQL Injection Vulnerability',
    category: 'security',
    impact: 'Fixes Critical Vulnerability',
    before: `// app/api/products/route.ts
export async function GET(request: Request) {
  const searchTerm = request.nextUrl.searchParams.get('q') || '';
  
  // VULNERABLE: Direct string concatenation
  const query = "SELECT * FROM products WHERE name = '" + searchTerm + "'";
  const results = await db.query(query);
  
  return Response.json(results);
}`,
    after: `// app/api/products/route.ts
import { db } from '@/lib/db';

export async function GET(request: Request) {
  const searchTerm = request.nextUrl.searchParams.get('q') || '';
  
  // SAFE: Using parameterized query
  const results = await db.query(
    'SELECT * FROM products WHERE name = ?',
    [searchTerm]
  );
  
  return Response.json(results);
}`,
    explanation: 'Use parameterized queries instead of string concatenation. This prevents SQL injection attacks and protects your database from malicious input.'
  },
  {
    id: 2,
    title: 'Optimize DataTable Component',
    category: 'performance',
    impact: '+35% Performance',
    before: `export const DataTable = ({ data, columns }) => {
  const [sorted, setSorted] = useState(null);
  
  const handleSort = (col) => {
    const newSort = sorted === col ? null : col;
    setSorted(newSort);
  };
  
  const sortedData = sorted 
    ? data.sort((a, b) => a[sorted] > b[sorted] ? 1 : -1)
    : data;
    
  return (
    <table>
      <thead>
        {columns.map(col => (
          <th key={col} onClick={() => handleSort(col)}>
            {col}
          </th>
        ))}
      </thead>
      <tbody>
        {sortedData.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};`,
    after: `const DataTable = memo(({ data, columns }) => {
  const [sortColumn, setSortColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');
  
  const sortedData = useMemo(() => {
    if (!sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      const comparison = aVal > bVal ? 1 : -1;
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [data, sortColumn, sortOrder]);
  
  const handleSort = useCallback((col) => {
    if (sortColumn === col) {
      setSortOrder(order => order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(col);
      setSortOrder('asc');
    }
  }, [sortColumn]);
  
  return (
    <table>
      <thead>
        {columns.map(col => (
          <th key={col} onClick={() => handleSort(col)}>
            {col}
            {sortColumn === col && (sortOrder === 'asc' ? '↑' : '↓')}
          </th>
        ))}
      </thead>
      <tbody>
        {sortedData.map(row => (
          <tr key={row.id}>
            {columns.map(col => (
              <td key={col}>{row[col]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
});`,
    explanation: 'Added memoization with useMemo for sorting logic, useCallback for event handlers, and sort order control. This prevents unnecessary re-renders and improves performance with large datasets.'
  },
  {
    id: 3,
    title: 'Extract API Logic to Custom Hook',
    category: 'quality',
    impact: '-12 Lines, Better Reusability',
    before: `export const UserProfile = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  return <div>{user.name}</div>;
};`,
    after: `const useUser = (userId) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    fetch(\`/api/users/\${userId}\`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [userId]);
  
  return { user, loading, error };
};

export const UserProfile = ({ userId }) => {
  const { user, loading, error } = useUser(userId);
  
  if (loading) return <Spinner />;
  if (error) return <Error />;
  
  return <div>{user.name}</div>;
};`,
    explanation: 'Extracted API logic into a reusable custom hook. This improves code organization, enables better testing, and allows the hook to be used in other components.'
  },
];

export default function PreviewPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const improvement = mockImprovements[currentIndex];

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mockImprovements.length - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < mockImprovements.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Preview Section */}
      <section className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <h1 className="text-3xl font-bold text-foreground">Improvement Preview</h1>
            <p className="text-muted-foreground max-w-2xl">
              Review the suggested improvements side-by-side and understand the changes.
            </p>
          </motion.div>

          {/* Demo Banner */}
          <DemoBanner />

          {/* Navigation Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex items-center justify-between p-4 rounded-lg border border-border/30 bg-card/30"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-lg font-semibold text-foreground truncate">
                  {improvement.title}
                </h2>
                <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-semibold border ${
                  improvement.category === 'security'
                    ? 'bg-red-950/30 text-red-400 border-red-700/30'
                    : improvement.category === 'performance'
                      ? 'bg-yellow-950/30 text-yellow-400 border-yellow-700/30'
                      : 'bg-blue-950/30 text-blue-400 border-blue-700/30'
                }`}>
                  {improvement.category?.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{improvement.impact}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {currentIndex + 1} / {mockImprovements.length}
              </span>
              <button
                onClick={goToPrevious}
                className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={goToNext}
                className="p-2 rounded-lg hover:bg-card transition-colors text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>

          {/* Diff Viewer */}
          <motion.div
            key={improvement.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <DiffViewer
              originalCode={improvement.before}
              improvedCode={improvement.after}
              language="typescript"
            />
          </motion.div>

          {/* Explanation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-lg border border-primary/30 bg-gradient-to-br from-primary/10 to-primary/5 space-y-4"
          >
            <h3 className="text-lg font-semibold text-foreground">Why This Change?</h3>
            <p className="text-muted-foreground leading-relaxed">
              {improvement.explanation}
            </p>

            <div className="pt-4 border-t border-primary/20 flex gap-3">
              <button className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2">
                <Copy className="w-4 h-4" />
                Copy Improved Code
              </button>
              <button className="flex-1 px-4 py-2 rounded-lg border border-border text-foreground font-medium hover:bg-card/50 transition-colors inline-flex items-center justify-center gap-2">
                <Download className="w-4 h-4" />
                Download
              </button>
            </div>
          </motion.div>

          {/* Summary */}
          <div className="grid md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="p-4 rounded-lg border border-border/30 bg-card/30 space-y-2"
            >
              <p className="text-sm text-muted-foreground">Performance Impact</p>
              <p className="text-2xl font-bold text-primary">+35%</p>
              <p className="text-xs text-muted-foreground">Estimated improvement</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="p-4 rounded-lg border border-border/30 bg-card/30 space-y-2"
            >
              <p className="text-sm text-muted-foreground">Complexity Reduction</p>
              <p className="text-2xl font-bold text-secondary">-12 lines</p>
              <p className="text-xs text-muted-foreground">Code cleanup</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-4 rounded-lg border border-border/30 bg-card/30 space-y-2"
            >
              <p className="text-sm text-muted-foreground">Maintainability</p>
              <p className="text-2xl font-bold text-emerald-400">Improved</p>
              <p className="text-xs text-muted-foreground">Better structure</p>
            </motion.div>
          </div>

          {/* All Improvements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 border-t border-border/30"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4">All Improvements</h3>
            <div className="space-y-2">
              {mockImprovements.map((imp, i) => (
                <button
                  key={imp.id}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    i === currentIndex
                      ? 'border-primary/50 bg-primary/10'
                      : 'border-border/50 bg-card/30 hover:bg-card/50'
                  }`}
                >
                  <div>
                    <p className="font-medium text-foreground">{imp.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{imp.explanation.substring(0, 50)}...</p>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
