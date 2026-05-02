'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useWaitlist } from './WaitlistContext';

export function GlobalShortcuts() {
  const router = useRouter();
  const { openWaitlist } = useWaitlist();
  const [keyBuffer, setKeyBuffer] = useState<string>('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in an input, textarea or contenteditable
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // 1. Meta + J logic - Now opens Waitlist Modal
      if (e.ctrlKey && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        openWaitlist();
        return;
      }

      // 2. Sequence logic (e.g., 'so' for sign out)
      const newBuffer = (keyBuffer + e.key.toLowerCase()).slice(-2);
      setKeyBuffer(newBuffer);

      if (newBuffer === 'so') {
        signOut({ callbackUrl: '/' });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [router, keyBuffer]);

  return null;
}
