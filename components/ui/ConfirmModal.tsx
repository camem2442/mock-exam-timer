import React, { ReactNode } from 'react';
import { Button } from './Button';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = '확인',
  cancelText = '취소',
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6" 
        onClick={e => e.stopPropagation()}
      >
        <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 mb-3 sm:mb-4">
          {title}
        </h3>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 whitespace-pre-wrap">
          {message}
        </p>
        
        {children && (
          <div className="my-6">
            {children}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <Button onClick={onClose} variant="secondary" className="flex-1">
            {cancelText}
          </Button>
          <Button onClick={onConfirm} variant="primary" className="flex-1">
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}; 