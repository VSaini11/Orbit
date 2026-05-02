'use client';

import React from 'react';

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
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/join" className="hover:text-white transition-colors">Join Us</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-white/90 tracking-wide uppercase">Resources</h4>
            <ul className="space-y-3 text-[13px] text-white/40 font-medium">
              <li><a href="/docs" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="/community" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          <div className="space-y-6">
            <h4 className="text-[14px] font-semibold text-white/90 tracking-wide uppercase">Legal</h4>
            <ul className="space-y-3 text-[13px] text-white/40 font-medium">
              <li><a href="/legal/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/legal/terms" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/legal/security" className="hover:text-white transition-colors">Security</a></li>
              <li><a href="/legal/cookies" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="/legal/license" className="hover:text-white transition-colors">License</a></li>
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
