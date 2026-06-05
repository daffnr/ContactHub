import React from 'react';
import { cn } from '../../utils/cn';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, showText = true }) => {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 shrink-0 drop-shadow-sm"
      >
        <defs>
          <linearGradient id="c-grad" x1="5" y1="8" x2="13" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2563EB" />
            <stop offset="1" stopColor="#3B82F6" />
          </linearGradient>
          <linearGradient id="h-grad" x1="19" y1="8" x2="27" y2="24" gradientUnits="userSpaceOnUse">
            <stop stopColor="#06B6D4" />
            <stop offset="1" stopColor="#0EA5E9" />
          </linearGradient>
          <linearGradient id="hub-grad" x1="13" y1="13" x2="19" y2="19" gradientUnits="userSpaceOnUse">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#06B6D4" />
          </linearGradient>
        </defs>

        {/* C */}
        <path d="M 13 8 L 9 8 C 6 8 5 9.5 5 12 L 5 20 C 5 22.5 6 24 9 24 L 13 24" stroke="url(#c-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* H */}
        <path d="M 19 8 L 19 24 M 27 8 L 27 24 M 19 16 L 27 16" stroke="url(#h-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        
        {/* The Hub (Connection Node) */}
        <circle cx="16" cy="16" r="2.5" fill="url(#hub-grad)" />
      </svg>
      {showText && (
        <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-baseline gap-1">
          ContactHub
          <span className="text-primary-600 dark:text-primary-400 font-black text-[10px] uppercase tracking-widest translate-y-[-1px]">
            CRM
          </span>
        </span>
      )}
    </div>
  );
};
