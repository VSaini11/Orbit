import React from 'react';

export const Logo = ({ className = "w-8 h-8", color = "currentColor" }: { className?: string, color?: string }) => {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg" 
      className={className}
    >
      {/* Top Right Part */}
      <path 
        d="M55 5C55 30 65 45 95 45C70 45 55 60 55 85" 
        stroke={color} 
        strokeWidth="12" 
        strokeLinecap="round" 
        className="opacity-90"
      />
      {/* Bottom Left Part */}
      <path 
        d="M45 95C45 70 35 55 5 55C30 55 45 40 45 15" 
        stroke={color} 
        strokeWidth="12" 
        strokeLinecap="round" 
        className="opacity-90"
      />
      
      {/* Solid version for better visibility if preferred */}
      <path 
        d="M52 10C52 35 62 48 92 48C67 48 52 61 52 86C52 61 62 48 92 48C67 48 52 35 52 10Z" 
        fill={color}
      />
      <path 
        d="M48 90C48 65 38 52 8 52C33 52 48 39 48 14C48 39 38 52 8 52C33 52 48 65 48 90Z" 
        fill={color}
      />
    </svg>
  );
};
