import React from 'react';
import { cn } from '../../utils/cn';

interface MobileOptimizedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const MobileOptimizedButton: React.FC<MobileOptimizedButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 active:bg-blue-800",
    secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-500 active:bg-slate-400 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600 dark:focus:ring-slate-500 dark:active:bg-slate-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 active:bg-red-800",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-500 active:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800 dark:focus:ring-slate-500 dark:active:bg-slate-700"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px]",
    md: "px-4 py-3 text-base min-h-[48px] min-w-[48px] sm:min-h-[40px] sm:min-w-[40px]",
    lg: "px-6 py-4 text-lg min-h-[56px] min-w-[56px] sm:min-h-[48px] sm:min-w-[48px]"
  };

  return (
    <button
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};