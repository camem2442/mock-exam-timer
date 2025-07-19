
import React, { forwardRef, useId } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, id, className, style, ...props }, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  const baseClasses = "w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none";
  
  const colorClasses = "bg-background border-input placeholder:text-muted-foreground focus:ring-ring focus:border-ring";
  
  return (
    <div>
      {label && <label htmlFor={inputId} className="block text-sm font-medium text-foreground mb-1">{label}</label>}
      <input
        ref={ref}
        id={inputId}
        className={cn(baseClasses, colorClasses, className)}
        style={{ fontSize: '16px', ...style }} // iOS 자동 확대 방지
        {...props}
      />
    </div>
  );
});

Input.displayName = 'Input';
