import React from 'react';
import { type Question } from '../../types';
import LiveStatusPanel from './LiveStatusPanel';
import { Button } from '../ui/Button';

interface StatusPanelModalProps {
    isOpen: boolean;
    onClose: () => void;
    questionNumbers: number[];
    questions: Record<number, Question>;
    currentQuestion: number | null;
    batchMode: boolean;
    lapCounter: number;
}

const StatusPanelModal: React.FC<StatusPanelModalProps> = ({
    isOpen,
    onClose,
    ...liveStatusPanelProps
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div 
            className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-40 flex items-center justify-center p-4 lg:hidden"
            onClick={onClose}
        >
            <div 
                className="relative w-full max-w-4xl max-h-[90vh] min-w-0 bg-slate-900/95 border border-slate-700 rounded-xl flex flex-col shadow-2xl modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="overflow-y-auto p-4">
                    <LiveStatusPanel {...liveStatusPanelProps} />
                </div>
                <footer className="flex-shrink-0 p-4 border-t border-slate-700 flex justify-end">
                    <Button variant="primary" onClick={onClose}>
                        닫기
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default StatusPanelModal; 