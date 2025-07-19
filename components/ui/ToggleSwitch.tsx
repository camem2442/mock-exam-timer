
import React from 'react';
import { cn } from '@/utils/cn';

interface ToggleSwitchProps {
  label?: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ label, enabled, onChange, disabled = false }) => {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      {label && (
        <span className={cn(
          "text-xs sm:text-sm font-medium text-foreground whitespace-nowrap",
          disabled && 'opacity-50'
        )}>{label}</span>
      )}
      <button
        type="button"
        disabled={disabled}
        className={cn(
          'toggle-switch-button relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background',
          enabled ? 'bg-primary' : 'bg-input',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onClick={() => !disabled && onChange(!enabled)}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out',
            enabled ? 'translate-x-5' : 'translate-x-0'
          )}
        />
      </button>
    </div>
  );
};
