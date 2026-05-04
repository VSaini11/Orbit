'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useSession, signOut } from 'next-auth/react';
import { LogOut, LayoutDashboard, Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { status } = useSession();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'About', href: '/about' },
    { name: 'Docs', href: '/docs' },
    { name: 'Join Us', href: '/join' },
    { name: 'Community', href: '/community' },
  ];

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/40 backdrop-blur-md border-b border-white/5 py-2' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/logo.png" alt="Orbit Logo" className="w-7 h-7 object-contain" />
          <span className="font-bold text-2xl tracking-tighter text-white lowercase">
            orbit
          </span>
        </Link>

        {/* Desktop Nav links - hidden on mobile */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name}
              href={link.href} 
              className="text-white/50 hover:text-white transition-colors text-[13px] font-medium tracking-tight"
            >
              {link.name === 'Docs' ? 'Doc' : link.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop Auth - hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            {status === 'authenticated' ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/projects"
                  className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium hover:bg-white/10 transition-all"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2 group"
                >
                  <LogOut className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => router.push('/projects')}
                className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium hover:bg-white/10 transition-all flex items-center gap-2"
              >
                Get Started
                <span className="text-[10px] opacity-40 px-1 py-0.5 border border-white/20 rounded ml-1">⌘ + J</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button - visible only on small screens */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center text-white/60 hover:text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay - triggered only on small screens */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 mt-2 px-4 md:hidden"
          >
            <div className="glass-panel p-8 rounded-2xl border-white/10 space-y-6 bg-black/90 backdrop-blur-2xl">
              <div className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link 
                    key={link.name}
                    href={link.href} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-xl font-bold text-white tracking-tight"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
              <div className="pt-6 border-t border-white/5">
                {status === 'authenticated' ? (
                  <Link 
                    href="/projects"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full py-3 rounded-xl bg-white text-black text-center font-bold flex items-center justify-center gap-2"
                  >
                    Dashboard
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      router.push('/projects');
                    }}
                    className="w-full py-3 rounded-xl bg-white text-black text-center font-bold"
                  >
                    Get Started
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}



