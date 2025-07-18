import { useState, useCallback } from 'react';
import { useGrading } from './useGrading';

export interface ReviewState {
    isGradingModalOpen: boolean;
    submittedCorrectAnswers: Record<number, string | number>;
}

export interface ReviewSetters {
    setIsGradingModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setSubmittedCorrectAnswers: React.Dispatch<React.SetStateAction<Record<number, string | number>>>;
}

export const useReview = (problemNumbers: number[]) => {
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);
    const [submittedCorrectAnswers, setSubmittedCorrectAnswers] = useState<Record<number, string | number>>({});

    const handleGradeSubmit = useCallback((submittedAnswers: Record<number, string>) => {
        setSubmittedCorrectAnswers(submittedAnswers);
        setIsGradingModalOpen(false);
    }, []);

    const grading = useGrading({ 
        problemNumbers,
        onSubmit: handleGradeSubmit
    });


    return {
        isGradingModalOpen, setIsGradingModalOpen,
        submittedCorrectAnswers, setSubmittedCorrectAnswers,
        handleGradeSubmit,
        grading,
    };
}; 