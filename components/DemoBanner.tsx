'use client';

import { AlertCircle, X } from 'lucide-react';
import { useState } from 'react';

export function DemoBanner() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-amber-950/40 border border-amber-700/30 rounded-lg p-4 mb-6 flex items-start gap-3">
      <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-amber-100 text-sm font-medium">Demo Data Active</p>
        <p className="text-amber-100/80 text-sm mt-1">
          This is a demonstration of Vyana Orbit&apos;s analysis capabilities using sample project data. 
          <span className="font-semibold block mt-1">Upload your own code to see real analysis of your project.</span>
        </p>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="flex-shrink-0 text-amber-400 hover:text-amber-300 transition-colors"
        aria-label="Dismiss banner"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
