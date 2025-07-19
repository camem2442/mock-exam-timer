import React, { useState, useEffect } from 'react';
import { type Question } from '../../types';
import { Button } from '../ui/Button';
import { ExamNameModal } from '../ui/ExamNameModal';
import { useExamRecord } from '../../hooks/useExamRecord';
import { Spinner } from '../ui/Spinner';

type SaveState = 'IDLE' | 'SAVING' | 'SUCCESS';

interface SaveExamButtonProps {
    questions: Question[];
    examName: string;
}

const SaveExamButton: React.FC<SaveExamButtonProps> = ({ questions, examName }) => {
    const [isExamNameModalOpen, setIsExamNameModalOpen] = useState(false);
    const [saveState, setSaveState] = useState<SaveState>('IDLE');
    const { addRecord } = useExamRecord();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (saveState === 'SUCCESS') {
            // Show success state and message for 3 seconds
            timer = setTimeout(() => setSaveState('IDLE'), 3000);
        }
        return () => clearTimeout(timer);
    }, [saveState]);

    const handleSaveExamRecord = () => {
        if (examName.trim()) {
            handleSaveExamName(examName.trim());
        } else {
            setIsExamNameModalOpen(true);
        }
    };

    const handleSaveExamName = (examNameToSave: string) => {
        if (saveState !== 'IDLE') return;

        setSaveState('SAVING');

        setTimeout(() => {
            addRecord({
                name: examNameToSave,
                questions: questions,
            });
            setSaveState('SUCCESS');
            setIsExamNameModalOpen(false);
        }, 500);
    };

    const getButtonContent = () => {
        switch (saveState) {
            case 'SAVING':
                return <span className="flex items-center justify-center gap-2"><Spinner size="sm" /><span>저장 중...</span></span>;
            case 'SUCCESS':
                return <span className="flex items-center justify-center gap-2">✔<span>저장 완료!</span></span>;
            default:
                return '시험 기록 저장';
        }
    };

    return (
        <div className="relative w-full sm:w-auto">
            <Button 
                onClick={handleSaveExamRecord} 
                variant="secondary"
                size="md"
                className="w-full sm:w-40 justify-center"
                disabled={saveState !== 'IDLE'}
            >
                {getButtonContent()}
            </Button>
            
            {saveState === 'SUCCESS' && (
                <div 
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-max max-w-xs p-3 bg-popover text-popover-foreground text-xs font-semibold rounded-lg shadow-lg z-10"
                    role="alert"
                >
                    <p>브라우저를 바꾸거나 데이터를 삭제하면 저장된 기록이 사라질 수 있습니다. 모바일에서는 브라우저 설정에 따라 저장 용량이 제한될 수 있습니다.</p>
                </div>
            )}

            <ExamNameModal
                isOpen={isExamNameModalOpen}
                onClose={() => setIsExamNameModalOpen(false)}
                onSave={handleSaveExamName}
            />
        </div>
    );
};

export default SaveExamButton; 