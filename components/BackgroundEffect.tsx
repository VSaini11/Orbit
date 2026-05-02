
'use client';

import React from 'react';

export const BackgroundEffect = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none select-none bg-black">
      {/* Base Background Image */}
      <div 
        className="absolute inset-0 opacity-100"
        style={{
          backgroundImage: 'url(/luxury-plain-green-gradient-abstract-studio-background-empty-room-with-space-your-text-picture.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      
      {/* Dark Overlay for contrast */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Subtle Gradient Overlays */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% -10%, rgba(255,255,255,0.05) 0%, transparent 70%)',
        }}
      />
      
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, transparent, black 90%)',
        }}
      />

      {/* Very subtle pulse glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] rounded-full opacity-[0.1] blur-[120px] animate-pulse"
        style={{
          background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
          animationDuration: '10s'
        }}
      />
    </div>
  );
};
