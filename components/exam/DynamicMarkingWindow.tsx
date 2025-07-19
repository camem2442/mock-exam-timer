import React, { useEffect, useRef } from 'react';
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
    const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
    
    // 문제가 바뀔 때마다 모든 버튼의 focus 상태 제거
    useEffect(() => {
        buttonRefs.current.forEach(btn => {
            if (btn) {
                btn.blur();
            }
        });
    }, [qNum]);
    
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
                    {[1, 2, 3, 4, 5].map((ans, index) => {
                        const isSelected = question.answer === ans.toString();
                        return (
                            <Button
                                key={`${qNum}-${ans}`} // 문제 번호를 포함한 고유 키
                                ref={(el) => { buttonRefs.current[index] = el; }}
                                onClick={(e) => {
                                    handleAction(e, () => onLap(qNum, ans.toString()));
                                    // 클릭 후 즉시 blur 처리하여 focus 상태 제거
                                    (e.target as HTMLElement).blur();
                                }}
                                disabled={!isExamActive}
                                variant={isSelected ? 'default' : 'outline'}
                                size="icon"
                                className={`w-8 h-8 rounded-md answer-button ${isSelected ? 'selected' : ''}`}
                                style={{
                                    // 강제로 상태 재설정
                                    backgroundColor: isSelected ? 'hsl(var(--primary))' : 'transparent',
                                    color: isSelected ? 'hsl(var(--primary-foreground))' : 'hsl(var(--foreground))',
                                    borderColor: isSelected ? 'hsl(var(--primary))' : 'hsl(var(--border))'
                                }}
                            >
                                {ans}
                            </Button>
                        );
                    })}
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