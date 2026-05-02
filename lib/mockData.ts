// Mock Analysis Data for Vyana Orbit Demo

export interface SecurityVulnerability {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  line: number;
  codeSnippet: string;
  recommendation: string;
}

export interface CodeQualityIssue {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  file: string;
  impact: string;
  suggestion: string;
}

export interface Dependency {
  id: string;
  name: string;
  currentVersion: string;
  latestVersion: string;
  status: 'outdated' | 'unused' | 'vulnerable' | 'ok';
  severity: 'critical' | 'high' | 'medium' | 'low' | 'none';
  description: string;
}

export interface PerformanceIssue {
  id: string;
  title: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  file: string;
  impact: string;
  improvement: string;
  estimatedGain: string;
}

export interface UpgradeSuggestion {
  id: string;
  category: string;
  current: string;
  suggested: string;
  reason: string;
  file: string;
  difficulty: 'easy' | 'medium' | 'hard';
  benefit: string;
}

export interface UIAnalysis {
  id: string;
  component: string;
  category: string;
  issue: string;
  severity: 'high' | 'medium' | 'low';
  file?: string;
  recommendation: string;
  impactsAccessibility: boolean;
  impactsPerformance: boolean;
}

export interface Component {
  id: string;
  name: string;
  type: string;
  file: string;
  lines: number;
  dependencies: string[];
}

export interface AnalysisResult {
  projectName: string;
  timestamp: string;
  isDemoData: boolean;
  repoUrl?: string;
  tokenUsage?: {
    input: number;
    output: number;
    total: number;
  };
  components: Component[];
  securityVulnerabilities: SecurityVulnerability[];
  codeQualityIssues: CodeQualityIssue[];
  dependencies: Dependency[];
  performanceIssues: PerformanceIssue[];
  upgradeSuggestions: UpgradeSuggestion[];
  uiAnalysis: UIAnalysis[];
}

export const mockAnalysisData: AnalysisResult = {
  projectName: 'NextJS E-Commerce Platform',
  timestamp: new Date().toISOString(),
  isDemoData: true,
  components: [
    { id: '1', name: 'ProductCard', type: 'React Component', file: 'components/ProductCard.tsx', lines: 145, dependencies: ['react', 'next/image', '@/lib/utils'] },
    { id: '2', name: 'ShoppingCart', type: 'React Component', file: 'components/ShoppingCart.tsx', lines: 287, dependencies: ['react', 'zustand', '@/hooks/useCart'] },
    { id: '3', name: 'CheckoutForm', type: 'React Component', file: 'components/CheckoutForm.tsx', lines: 412, dependencies: ['react-hook-form', 'stripe-js', 'axios'] },
    { id: '4', name: 'Header', type: 'React Component', file: 'components/Header.tsx', lines: 98, dependencies: ['next/link', 'next/router'] },
    { id: '5', name: 'Footer', type: 'React Component', file: 'components/Footer.tsx', lines: 125, dependencies: ['react'] },
  ],
  securityVulnerabilities: [
    {
      id: 'sec-1',
      type: 'SQL Injection Risk',
      severity: 'critical',
      title: 'Unvalidated User Input in Database Query',
      description: 'User input is directly concatenated into database queries without proper sanitization, allowing potential SQL injection attacks.',
      file: 'app/api/products/route.ts',
      line: 42,
      codeSnippet: `const query = "SELECT * FROM products WHERE name = '" + searchTerm + "'"`,
      recommendation: 'Use parameterized queries or an ORM like Prisma. Example: prisma.product.findMany({ where: { name: searchTerm } })',
    },
    {
      id: 'sec-2',
      type: 'XSS Vulnerability',
      severity: 'high',
      title: 'Unescaped HTML in User Comments',
      description: 'User-generated comments are rendered without sanitization, allowing XSS attacks.',
      file: 'components/ProductReviews.tsx',
      line: 87,
      codeSnippet: `<div>{userReview.comment}</div>`,
      recommendation: 'Use DOMPurify or sanitize-html to clean user input before rendering. Or use React.createElement instead of dangerouslySetInnerHTML.',
    },
    {
      id: 'sec-3',
      type: 'Insecure API Key Storage',
      severity: 'critical',
      title: 'API Keys Exposed in Client-Side Code',
      description: 'Stripe and AWS keys are hardcoded in environment variables accessible from client-side code.',
      file: '.env.local',
      line: 5,
      codeSnippet: `NEXT_PUBLIC_STRIPE_KEY=pk_live_...`,
      recommendation: 'Move sensitive keys to server-only environment variables. Use STRIPE_SECRET_KEY (without NEXT_PUBLIC_ prefix) on the server side only.',
    },
    {
      id: 'sec-4',
      type: 'Missing CSRF Protection',
      severity: 'high',
      title: 'No CSRF Token Validation on State-Changing Operations',
      description: 'POST/PUT/DELETE endpoints do not validate CSRF tokens, making the application vulnerable to cross-site request forgery.',
      file: 'app/api/cart/route.ts',
      line: 15,
      codeSnippet: `export async function POST(request: Request) { const item = await request.json(); // No CSRF validation }`,
      recommendation: 'Implement CSRF token validation using libraries like csrf or next-csrf.',
    },
  ],
  codeQualityIssues: [
    {
      id: 'quality-1',
      type: 'Code Complexity',
      severity: 'high',
      title: 'Excessive Function Complexity in CheckoutForm',
      description: 'The handleSubmit function has cyclomatic complexity of 12, making it difficult to maintain and test.',
      file: 'components/CheckoutForm.tsx',
      impact: 'Hard to test, prone to bugs, difficult for new developers to understand',
      suggestion: 'Break down into smaller, single-responsibility functions. Extract validation, API calls, and state management into separate functions.',
    },
    {
      id: 'quality-2',
      type: 'Prop Drilling',
      severity: 'medium',
      title: 'Deep Prop Drilling in Product Hierarchy',
      description: 'Props are passed through 5+ nested components unnecessarily, making refactoring difficult.',
      file: 'components/ProductCard.tsx, components/ProductDetails.tsx, components/ProductReviews.tsx',
      impact: 'Harder to refactor, performance issues with unnecessary re-renders',
      suggestion: 'Use Context API or Zustand for shared state instead of drilling props through multiple components.',
    },
    {
      id: 'quality-3',
      type: 'Code Duplication',
      severity: 'medium',
      title: 'Duplicated API Fetch Logic',
      description: 'Same fetch pattern repeated in 7 different components without reusable utility.',
      file: 'Multiple files',
      impact: 'Maintenance burden, inconsistent error handling across the app',
      suggestion: 'Create a custom hook `useFetch()` or use SWR/React Query for consistent data fetching across the application.',
    },
    {
      id: 'quality-4',
      type: 'Missing Error Boundaries',
      severity: 'medium',
      title: 'No Error Boundary Wrapping Components',
      description: 'React components lack error boundaries, causing entire app to crash on component errors.',
      file: 'app/layout.tsx',
      impact: 'Poor user experience, app crash on any component error',
      suggestion: 'Implement Error Boundary components to gracefully handle errors and provide fallback UI.',
    },
  ],
  dependencies: [
    {
      id: 'dep-1',
      name: 'react',
      currentVersion: '18.0.0',
      latestVersion: '19.1.0',
      status: 'outdated',
      severity: 'high',
      description: 'Major version update available with performance improvements and new features',
    },
    {
      id: 'dep-2',
      name: 'next',
      currentVersion: '13.4.0',
      latestVersion: '16.2.4',
      status: 'outdated',
      severity: 'high',
      description: 'Multiple major versions behind. Latest includes App Router stability, better performance, and security patches',
    },
    {
      id: 'dep-3',
      name: 'stripe-js',
      currentVersion: '1.26.0',
      latestVersion: '6.13.0',
      status: 'vulnerable',
      severity: 'critical',
      description: 'Security vulnerability (CVE-2024-1234) - payment data exposure risk',
    },
    {
      id: 'dep-4',
      name: 'lodash',
      currentVersion: '4.17.21',
      latestVersion: '4.17.21',
      status: 'unused',
      severity: 'low',
      description: 'Package installed but not used anywhere in the codebase. Can be removed to reduce bundle size.',
    },
    {
      id: 'dep-5',
      name: 'zustand',
      currentVersion: '4.3.2',
      latestVersion: '4.5.0',
      status: 'outdated',
      severity: 'low',
      description: 'Minor version update with bug fixes and performance improvements',
    },
  ],
  performanceIssues: [
    {
      id: 'perf-1',
      title: 'Unoptimized Product Images',
      severity: 'high',
      description: 'Product images are not optimized, loading large uncompressed JPEGs (2-5MB each) without proper responsive sizing.',
      file: 'components/ProductCard.tsx',
      impact: 'Page load time increased by ~3 seconds, high bandwidth usage',
      improvement: 'Use Next.js Image component with proper sizes, srcSet, and WebP format',
      estimatedGain: '+2.8s faster load, 60% reduction in bandwidth',
    },
    {
      id: 'perf-2',
      title: 'Blocking JavaScript',
      severity: 'high',
      description: 'Large JavaScript bundles loaded synchronously, blocking page rendering. Main bundle is 450KB uncompressed.',
      file: 'app/layout.tsx',
      impact: 'Slow First Contentful Paint (FCP), poor Core Web Vitals',
      improvement: 'Code-split components using dynamic imports, defer non-critical JS, enable compression',
      estimatedGain: '+1.5s faster FCP, improved CLS',
    },
    {
      id: 'perf-3',
      title: 'Missing Database Query Optimization',
      severity: 'high',
      description: 'N+1 query problem in product listing - loading products and then making individual queries for each review count.',
      file: 'app/api/products/route.ts',
      impact: 'Database queries increased 100x, response time 5-8 seconds',
      improvement: 'Use database JOINs or batch queries to fetch related data in one query',
      estimatedGain: '+5s faster API response, 99% fewer queries',
    },
    {
      id: 'perf-4',
      title: 'Unoptimized CSS Bundle',
      severity: 'medium',
      description: 'Entire Tailwind CSS included (350KB) even though only 15% is used. No CSS purging configured.',
      file: 'app/globals.css',
      impact: 'Unnecessary CSS bloat increases page size and parsing time',
      improvement: 'Enable Tailwind CSS purging and tree-shaking',
      estimatedGain: '+300KB smaller CSS, faster parsing',
    },
  ],
  upgradeSuggestions: [
    {
      id: 'upgrade-1',
      category: 'Framework',
      current: 'Next.js 13 Pages Router',
      suggested: 'Next.js 16 App Router',
      reason: 'App Router is the modern standard with better performance, type safety, and developer experience',
      file: 'app/',
      difficulty: 'hard',
      benefit: 'Better performance, built-in optimizations, improved developer experience',
    },
    {
      id: 'upgrade-2',
      category: 'Data Fetching',
      current: 'Axios + useState',
      suggested: 'SWR or TanStack Query',
      reason: 'Modern data fetching libraries provide caching, revalidation, and better error handling',
      file: 'Multiple components',
      difficulty: 'medium',
      benefit: 'Better data caching, automatic revalidation, reduced boilerplate code',
    },
    {
      id: 'upgrade-3',
      category: 'State Management',
      current: 'Redux',
      suggested: 'Zustand (or keep Zustand)',
      reason: 'Redux is overkill for this project. Zustand is lighter and more suitable.',
      file: 'Redux store files',
      difficulty: 'medium',
      benefit: 'Smaller bundle, simpler API, better performance',
    },
    {
      id: 'upgrade-4',
      category: 'Database',
      current: 'Raw SQL queries',
      suggested: 'Prisma ORM',
      reason: 'ORM provides type safety, query optimization, and protection against SQL injection',
      file: 'app/api/',
      difficulty: 'medium',
      benefit: 'Type safety, automatic SQL injection prevention, better query optimization',
    },
  ],
  uiAnalysis: [
    {
      id: 'ui-1',
      component: 'ProductCard',
      category: 'Accessibility',
      issue: 'Missing alt text on product images',
      severity: 'high',
      recommendation: 'Add descriptive alt text: <img alt="Red wool sweater, size M" />',
      impactsAccessibility: true,
      impactsPerformance: false,
    },
    {
      id: 'ui-2',
      component: 'CheckoutForm',
      category: 'Accessibility',
      issue: 'Form inputs missing associated labels',
      severity: 'high',
      recommendation: 'Use <label htmlFor="email"> tags or add aria-label attributes',
      impactsAccessibility: true,
      impactsPerformance: false,
    },
    {
      id: 'ui-3',
      component: 'Header',
      category: 'Mobile Responsiveness',
      issue: 'Navigation menu not visible on mobile screens (<640px)',
      severity: 'high',
      recommendation: 'Add responsive hamburger menu using media queries or responsive component',
      impactsAccessibility: false,
      impactsPerformance: false,
    },
    {
      id: 'ui-4',
      component: 'ProductReviews',
      category: 'Performance',
      issue: 'Loading all reviews at once (pagination missing)',
      severity: 'medium',
      recommendation: 'Implement pagination or infinite scroll to load reviews on demand',
      impactsAccessibility: false,
      impactsPerformance: true,
    },
    {
      id: 'ui-5',
      component: 'ShoppingCart',
      category: 'UX',
      issue: 'No empty state message when cart is empty',
      severity: 'low',
      recommendation: 'Show a friendly message and suggest products when cart is empty',
      impactsAccessibility: false,
      impactsPerformance: false,
    },
  ],
};

export function getAnalysisSummary(data: AnalysisResult) {
  return {
    totalComponents: data.components.length,
    criticalVulnerabilities: data.securityVulnerabilities.filter(v => v.severity === 'critical').length,
    highSeverityIssues: data.securityVulnerabilities.filter(v => v.severity === 'high').length,
    codeQualityIssues: data.codeQualityIssues.length,
    outdatedDependencies: data.dependencies.filter(d => d.status === 'outdated').length,
    vulnerableDependencies: data.dependencies.filter(d => d.status === 'vulnerable').length,
    performanceIssues: data.performanceIssues.length,
    uiIssues: data.uiAnalysis.length,
  };
}
