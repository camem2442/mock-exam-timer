import React from 'react';
import { Question } from '../../types';
import DynamicMarkingWindow from './DynamicMarkingWindow';

interface ProblemListProps {
    isExamActive: boolean;
    questionNumbers: number[];
    questions: Record<number, Question>;
    batchSelectedQuestions: Set<number>;
    subjectiveInputs: Record<number, string>;
    onLap: (questionNumber: number, answer?: string) => void;
    onSubjectiveInputChange: (qNum: number, value: string) => void;
    setProblemRef: (qNum: number, el: HTMLDivElement | null) => void;
    onQuestionFocus: (qNum: number) => void;
}

const ProblemList = React.forwardRef<HTMLDivElement, ProblemListProps>(({
    isExamActive,
    questionNumbers,
    questions,
    batchSelectedQuestions,
    subjectiveInputs,
    onLap,
    onSubjectiveInputChange,
    setProblemRef,
    onQuestionFocus,
}, ref) => {
    return (
        <div ref={ref} className="space-y-3 max-h-[50vh] overflow-y-auto pr-2">
            {questionNumbers.map(qNum => {
                const question = questions[qNum];
                if (!question) return null;
                return (
                    <div
                        key={qNum}
                        ref={(el) => setProblemRef(qNum, el)}
                        onClick={() => onQuestionFocus(qNum)}
                        className="cursor-pointer"
                    >
                        <DynamicMarkingWindow
                            isExamActive={isExamActive}
                            question={question}
                            batchSelected={batchSelectedQuestions.has(qNum)}
                            onLap={onLap}
                            subjectiveInput={subjectiveInputs[qNum] ?? ''}
                            onSubjectiveInputChange={(value) => onSubjectiveInputChange(qNum, value)}
                        />
                    </div>
                );
            })}
        </div>
    );
});

ProblemList.displayName = 'ProblemList';

export default ProblemList;