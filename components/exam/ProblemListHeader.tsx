import React from 'react';
import { Button } from '../ui/Button';

interface ProblemListHeaderProps {
    currentQuestionIndex: number;
    totalQuestions: number;
    onScrollUp: () => void;
    onScrollDown: () => void;
}

const ProblemListHeader: React.FC<ProblemListHeaderProps> = ({
    currentQuestionIndex,
    totalQuestions,
    onScrollUp,
    onScrollDown
}) => {
    return (
        <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="text-lg font-bold text-foreground">전체 문제 목록</h3>
            <div className="flex items-center gap-2">
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onScrollUp}
                    disabled={currentQuestionIndex <= 5}
                    className="w-8 h-8 p-0"
                    title="5개 문제 위로"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                    </svg>
                </Button>
                <span className="text-sm text-muted-foreground min-w-[3rem] text-center">
                    {currentQuestionIndex}/{totalQuestions}
                </span>
                <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={onScrollDown}
                    disabled={currentQuestionIndex > totalQuestions - 5}
                    className="w-8 h-8 p-0"
                    title="5개 문제 아래로"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </Button>
            </div>
        </div>
    );
};

export default ProblemListHeader;