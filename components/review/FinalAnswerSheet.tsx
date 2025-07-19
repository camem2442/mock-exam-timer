
import React, { useMemo } from 'react';
import { type Question } from '../../types';
import { cn } from '../../utils/cn';

interface FinalAnswerSheetProps {
    questions: Question[];
    blurAnswer?: boolean;
    forceCols?: number;
}

const FinalAnswerSheet: React.FC<FinalAnswerSheetProps> = ({ questions, blurAnswer = false, forceCols }) => {
    const sortedQuestions = useMemo(() => [...questions].sort((a, b) => a.number - b.number), [questions]);

    const getGridClass = () => {
        if (forceCols === 10) return 'grid-cols-10';
        if (forceCols === 15) return 'grid-cols-15';
        // Default responsive behavior
        return 'grid-cols-5 sm:grid-cols-10 lg:grid-cols-15';
    }

    const getStyles = (q: Question): string => {
        if (q.isCorrect === true) {
            return 'bg-answer-correct border-answer-correct-border';
        }
        if (q.isCorrect === false) {
            return 'bg-answer-incorrect border-answer-incorrect-border';
        }
        if (q.answer) {
            return 'bg-answer-answered border-transparent';
        }
        return 'bg-answer-default border-transparent';
    };
    
    const universalAnswerFontSize = useMemo(() => {
        const longestAnswerLength = questions.reduce((maxLength, q) => {
            const currentLength = (q.answer ?? '').toString().length;
            return Math.max(maxLength, currentLength);
        }, 0);

        if (longestAnswerLength > 8) return 'text-[10px]';
        if (longestAnswerLength > 6) return 'text-xs';
        if (longestAnswerLength > 3) return 'text-sm';
        return 'text-base';
    }, [questions]);

    return (
        <div className={`grid ${getGridClass()} gap-2`}>
            {sortedQuestions.map(q => (
                <div
                    key={`answer-grid-${q.number}`}
                    className={cn(
                        "p-1.5 rounded-md flex flex-col items-center justify-center text-center border transition-colors overflow-hidden",
                        getStyles(q)
                    )}
                >
                    <span className="text-sm font-medium text-muted-foreground">{q.number}</span>
                    <span
                        className={cn(
                            "w-full font-bold text-foreground whitespace-nowrap",
                            universalAnswerFontSize,
                            blurAnswer && "blur-sm select-none"
                        )}
                    >
                        {q.answer ?? '-'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FinalAnswerSheet;