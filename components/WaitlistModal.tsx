'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, ArrowRight, Check } from 'lucide-react';
import { useWaitlist } from './WaitlistContext';

export function WaitlistModal() {
  const { isOpen, closeWaitlist } = useWaitlist();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isAlreadyIn, setIsAlreadyIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (res.ok) {
        setIsAlreadyIn(data.alreadyIn);
        setIsSubmitted(true);
      } else {
        alert(data.error || 'Something went wrong');
      }
    } catch (error) {
      alert('Failed to connect to the server');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    closeWaitlist();
    // Reset after animation
    setTimeout(() => {
      setIsSubmitted(false);
      setIsAlreadyIn(false);
      setEmail('');
    }, 300);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-[2.5rem] bg-[#0a0a0a] border border-white/10 p-10 shadow-2xl"
          >
            {/* Subtle Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />

            <button
              onClick={handleClose}
              className="absolute top-6 right-6 p-2 text-white/20 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSubmitted ? (
              <div className="relative z-10 space-y-8">
                <div className="space-y-4">
                  <img src="/logo.png" alt="Orbit" className="w-8 h-8 object-contain" />
                  <h3 className="text-3xl font-bold text-white tracking-tight leading-tight">
                    Join the <br />
                    Waitlist
                  </h3>
                  <p className="text-white/40 text-[15px] leading-relaxed">
                    Be the first to experience the intelligence engine. Enter your email to get early access when we go live.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-white/60 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 outline-none focus:border-white/30 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-black font-bold py-4 rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
                  >
                    Get Early Access
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </form>
                
                <p className="text-[11px] text-white/20 text-center uppercase tracking-widest">
                  Secure • No Spam • Limited Spots
                </p>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 py-10 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-[#10b981]/10 rounded-full flex items-center justify-center mx-auto border border-[#10b981]/20">
                  <Check className="w-10 h-10 text-[#10b981]" />
                </div>
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-white tracking-tight">
                    {isAlreadyIn ? 'Already Enrolled!' : "You're on the list!"}
                  </h3>
                  <p className="text-white/40 text-[15px] leading-relaxed">
                    {isAlreadyIn 
                      ? "You are already in our waitlist queue! Thank you for your interest, we will notify you as soon as we go live."
                      : <>We've added <span className="text-white/70 font-medium">{email}</span> to our early access queue. We'll notify you when Orbit goes live.</>
                    }
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="w-full py-4 rounded-2xl border border-white/10 text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold mt-4"
                >
                  Back to site
                </button>
              </motion.div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
