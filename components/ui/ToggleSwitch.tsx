
import React from 'react';

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
        <span className={`text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 whitespace-nowrap ${disabled ? 'opacity-50' : ''}`}>{label}</span>
      )}
      <button
        type="button"
        disabled={disabled}
        className={`${
          enabled ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'
        } relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
        onClick={() => !disabled && onChange(!enabled)}
      >
        <span
          aria-hidden="true"
          className={`${
            enabled ? 'translate-x-5' : 'translate-x-0'
          } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
        />
      </button>
    </div>
  );
};
