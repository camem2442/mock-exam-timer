import React from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Question } from '../../types';

interface DynamicMarkingWindowProps {
    isExamActive: boolean;
    question: Question;
    batchSelected: boolean;
    onLap: (questionNumber: number, answer?: string) => void;
    subjectiveInput: string;
    onSubjectiveInputChange: (value: string) => void;
}

const DynamicMarkingWindow: React.FC<DynamicMarkingWindowProps> = ({
    isExamActive,
    question,
    batchSelected,
    onLap,
    subjectiveInput,
    onSubjectiveInputChange,
}) => {
    const qNum = question.number;
    
    const handleAction = (e: React.MouseEvent | React.KeyboardEvent, callback: () => void) => {
        e.stopPropagation();
        callback();
    };


    return (
        <div
            className={`p-3 flex items-center justify-between gap-2 md:gap-4 transition-all border rounded-lg ${
                batchSelected ? 'bg-primary/20 border-primary' : 'border-transparent'
            }`}
        >
            {/* Left: Question Number Button */}
            <Button
                variant="default"
                className="w-24 flex-shrink-0"
                onClick={(e) => handleAction(e, () => onLap(qNum))}
                disabled={!isExamActive}
            >
                {qNum}번
            </Button>

            {/* Right: All other controls */}
            <div className="flex flex-wrap items-center justify-end gap-x-4 gap-y-2">
                <div className="flex items-center gap-2 sm:gap-3">
                    {[1, 2, 3, 4, 5].map((ans) => (
                        <Button
                            key={ans}
                            onClick={(e) => handleAction(e, () => onLap(qNum, ans.toString()))}
                            disabled={!isExamActive}
                            variant={question.answer === ans.toString() ? 'default' : 'secondary'}
                            size="icon"
                            className="w-8 h-8 rounded-md"
                        >
                            {ans}
                        </Button>
                    ))}
                </div>

                <div className="flex items-stretch gap-2" onClick={e => e.stopPropagation()}>
                    <Input
                        type="tel"
                        inputMode="numeric"
                        placeholder="주관식 답안"
                        className="!w-28 h-auto"
                        value={subjectiveInput}
                        onChange={(e) => onSubjectiveInputChange(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleAction(e, () => onLap(qNum, subjectiveInput));
                            }
                        }}
                        disabled={!isExamActive}
                    />
                    <Button 
                        variant="secondary" 
                        onClick={(e) => handleAction(e, () => onLap(qNum, subjectiveInput))} 
                        disabled={!isExamActive}
                        className="h-auto px-5"
                    >
                        저장
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DynamicMarkingWindow;