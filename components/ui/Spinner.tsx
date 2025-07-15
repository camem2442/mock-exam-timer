
import React from 'react';

export const Spinner: React.FC<{className?: string}> = ({ className = '' }) => (
    <div className="flex justify-center items-center" aria-label="Loading">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-primary-500 ${className}`}></div>
    </div>
);
