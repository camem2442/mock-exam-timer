import React, { useState } from 'react';

interface TooltipProps {
  children: React.ReactElement;
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ children, text }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      {isVisible && (
        <div 
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-xs p-2.5 bg-popover text-popover-foreground text-xs font-semibold rounded-lg shadow-lg z-10"
          role="tooltip"
        >
          {text}
        </div>
      )}
    </div>
  );
}; 