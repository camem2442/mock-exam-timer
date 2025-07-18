
import React, { useMemo } from 'react';
import { type Question } from '../../types';

interface FinalAnswerSheetProps {
    questions: Question[];
    blurAnswer?: boolean;
    forceCols?: number;
}

const FinalAnswerSheet: React.FC<FinalAnswerSheetProps> = ({ questions, blurAnswer, forceCols }) => {
    const sortedQuestions = useMemo(() => [...questions].sort((a, b) => a.number - b.number), [questions]);

    const getStyles = (q: Question): string => {
        if (q.isCorrect === true) {
            return 'bg-green-100 dark:bg-green-900/60 border-green-500/50';
        }
        if (q.isCorrect === false) {
            return 'bg-red-100 dark:bg-red-900/60 border-red-500/50';
        }
        if (q.answer) {
            return 'bg-primary-100 dark:bg-primary-900/60 border-transparent';
        }
        return 'bg-slate-200 dark:bg-slate-800 border-transparent';
    };

    const gridClasses = forceCols 
        ? `grid-cols-${forceCols}` // This might not work with Tailwind JIT, let's use a map
        : 'grid-cols-5 sm:grid-cols-10 lg:grid-cols-15';
    
    // Tailwind JIT requires full class names
    const getGridClass = () => {
        if (forceCols === 10) return 'grid-cols-5 sm:grid-cols-8 md:grid-cols-10';
        if (forceCols === 15) return 'grid-cols-5 sm:grid-cols-10 md:grid-cols-15';
        // Default responsive behavior
        return 'grid-cols-5 sm:grid-cols-10 lg:grid-cols-15';
    }


    return (
        <div className={`grid ${getGridClass()} gap-2`}>
            {sortedQuestions.map(q => (
                <div
                    key={`answer-grid-${q.number}`}
                    className={`p-1 sm:p-1.5 rounded-md flex flex-col items-center justify-center text-center border transition-colors ${getStyles(q)}`}
                >
                    <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">{q.number}</span>
                    <span
                        className={`text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 truncate ${blurAnswer ? 'blur-sm select-none' : ''}`}
                    >
                        {q.answer ?? '-'}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default FinalAnswerSheet;