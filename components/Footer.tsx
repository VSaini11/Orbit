'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-60 relative overflow-hidden bg-transparent mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 relative z-10">
        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-12 mb-44">
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-white/90 tracking-wide uppercase">Company</h4>
            <ul className="space-y-3 text-[13px] text-white/40 font-medium">
              <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="/join" className="hover:text-white transition-colors">Join Us</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-white/90 tracking-wide uppercase">Resources</h4>
            <ul className="space-y-3 text-[13px] text-white/40 font-medium">
              <li><Link href="/docs" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="/community" className="hover:text-white transition-colors">Community</Link></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-white/90 tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3 text-[13px] text-white/40 font-medium">
              <li><Link href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/legal/security" className="hover:text-white transition-colors">Security</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</Link></li>
              <li><Link href="/legal/license" className="hover:text-white transition-colors">License</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 pb-72 border-t border-white/5 pt-12">
          {/* Social Links */}
          <div className="flex items-center gap-8 text-[13px] font-medium text-white/40">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
            <a href="#" className="hover:text-white transition-colors">Reddit</a>
          </div>

          {/* Copyright */}
          <div className="text-[13px] text-white/20 font-medium">
            © {currentYear} Orbit. All rights reserved.
          </div>
        </div>
      </div>

      {/* Massive Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full select-none pointer-events-none overflow-hidden h-[500px] flex items-end justify-center">
        <span className="text-[25vw] md:text-[20vw] font-bold tracking-[-0.05em] text-white/[0.03] leading-none mb-[-3%] whitespace-nowrap lowercase">
          orbit
        </span>
      </div>
    </footer>
  );
}
