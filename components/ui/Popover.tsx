import React, { useState, useRef, useEffect, createContext, useContext } from 'react';

const PopoverContext = createContext<{
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const Popover = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <PopoverContext.Provider value={{ isOpen, setIsOpen }}>
      <div className="relative inline-block text-left">{children}</div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger = ({ children }: { children: React.ReactNode }) => {
  const { setIsOpen } = useContext(PopoverContext);
  return <div onClick={() => setIsOpen(prev => !prev)}>{children}</div>;
};

export const PopoverContent = ({ children, side, align, className }: { children: React.ReactNode; side?: 'top' | 'bottom'; align?: 'start' | 'center' | 'end'; className?: string; }) => {
  const { isOpen, setIsOpen } = useContext(PopoverContext);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  const sideClass = side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2';
  const alignClass = align === 'end' ? 'right-0' : align === 'start' ? 'left-0' : 'left-1/2 -translate-x-1/2';

  return (
    <div ref={popoverRef} className={`absolute ${sideClass} ${alignClass} z-10 ${className}`}>
      <div className="rounded-md shadow-lg bg-card border border-border">
        {children}
      </div>
    </div>
  );
}; 