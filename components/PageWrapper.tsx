'use client';

import { ReactNode } from 'react';

export function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="w-full h-full min-h-screen relative">
      {children}
    </div>
  );
}
