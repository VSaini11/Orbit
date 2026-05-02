'use client';

import { SessionProvider } from "next-auth/react";
import { WaitlistProvider } from "./WaitlistContext";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <WaitlistProvider>
        {children}
      </WaitlistProvider>
    </SessionProvider>
  );
}
