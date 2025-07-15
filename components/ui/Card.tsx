
import React, { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '' }, ref) => {
  return (
    <div ref={ref} className={`bg-white dark:bg-slate-800/50 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
