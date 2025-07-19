import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Question } from '../../types';

interface QuickNavProps {
    questionNumbers: number[];
    questions: Record<number, Question>;
    onJumpTo: (questionNumber: number) => void;
    focusedQuestionNumber: number | null;
}

const QuickNav: React.FC<QuickNavProps> = ({ questionNumbers, questions, onJumpTo, focusedQuestionNumber }) => {
    return (
        <Card>
            <h3 className="text-lg font-bold mb-3 text-foreground">빠른 이동</h3>
            <div className="border-t border-border my-3"></div>
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
                {questionNumbers.map(qNum => {
                    const question = questions[qNum];
                    const hasAnswer = question && question.answer;

                    return (
                        <Button
                            key={qNum}
                            variant={qNum === focusedQuestionNumber ? 'default' : (hasAnswer ? 'outline' : 'secondary')}
                            size="sm"
                            onClick={() => onJumpTo(qNum)}
                            className={`!px-2 !py-1 justify-center ${
                                qNum === focusedQuestionNumber 
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600'
                                    : hasAnswer 
                                        ? 'bg-green-50 hover:bg-green-100 border-green-300 text-green-800 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:border-green-600 dark:text-green-300'
                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300'
                            }`}
                        >
                            {qNum}
                        </Button>
                    )
                })}
            </div>
        </Card>
    );
};

export default QuickNav;
