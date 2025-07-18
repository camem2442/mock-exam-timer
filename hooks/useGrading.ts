import { useState, useCallback } from 'react';

interface UseGradingProps {
    problemNumbers: number[];
    onSubmit: (answers: Record<number, string>) => void;
}

export const useGrading = ({ problemNumbers, onSubmit }: UseGradingProps) => {
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [subjectiveProblems, setSubjectiveProblems] = useState<Set<number>>(new Set());

    const handleAnswerChange = useCallback((problemNumber: number, value: string, focusNext: (problemNumber: number) => void) => {
        const isSubjective = subjectiveProblems.has(problemNumber);

        if (!isSubjective && value.length > 1) {
            setAnswers(prev => ({ ...prev, [problemNumber]: value.slice(-1) }));
            return;
        }

        setAnswers(prev => ({ ...prev, [problemNumber]: value }));

        if (!isSubjective && /^\d$/.test(value)) {
            focusNext(problemNumber);
        }
    }, [subjectiveProblems]);

    const handleToggleSubjective = useCallback((problemNumber: number) => {
        setSubjectiveProblems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(problemNumber)) {
                newSet.delete(problemNumber);
            } else {
                newSet.add(problemNumber);
            }
            return newSet;
        });
    }, []);

    const handleSubmit = useCallback(() => {
        onSubmit(answers);
    }, [answers, onSubmit]);

    const reset = useCallback(() => {
        setAnswers({});
        setSubjectiveProblems(new Set());
    }, []);

    return {
        answers,
        setAnswers,
        subjectiveProblems,
        setSubjectiveProblems,
        handleAnswerChange,
        handleToggleSubjective,
        handleSubmit,
        reset,
    };
}; 