
import React from 'react';

interface SpinnerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Spinner: React.FC<SpinnerProps> = ({ className = '', size = 'md' }) => {
    const sizeClasses = {
        sm: 'h-5 w-5 border-2',
        md: 'h-8 w-8 border-b-2 border-t-2',
        lg: 'h-12 w-12 border-b-4 border-t-4',
    };

    return (
    <div className="flex justify-center items-center" aria-label="Loading">
            <div className={`animate-spin rounded-full border-primary ${sizeClasses[size]} ${className}`}></div>
    </div>
);
};
