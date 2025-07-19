
import React, { forwardRef } from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, className = '' }, ref) => {
  return (
    <div ref={ref} className={`bg-card text-card-foreground rounded-xl shadow-lg border p-4 sm:p-6 ${className}`}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';
