
import React, { forwardRef, useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  const baseClasses = "w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500";
  
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={`${baseClasses} ${className || ''}`.trim()}
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';
