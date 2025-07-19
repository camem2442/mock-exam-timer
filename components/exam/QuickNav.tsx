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
                            variant={qNum === focusedQuestionNumber ? 'brand' : (hasAnswer ? 'muted' : 'secondary')}
                            size="sm"
                            onClick={() => onJumpTo(qNum)}
                            className="!px-2 !py-1 justify-center"
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
