import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuickNavProps {
    questionNumbers: number[];
    onJumpTo: (questionNumber: number) => void;
    focusedQuestionNumber: number | null;
}

const QuickNav: React.FC<QuickNavProps> = ({ questionNumbers, onJumpTo, focusedQuestionNumber }) => {
    return (
        <Card>
            <h3 className="text-lg font-bold mb-3">빠른 이동</h3>
            <div className="grid grid-cols-5 sm:grid-cols-10 lg:grid-cols-15 gap-2">
                {questionNumbers.map(qNum => (
                    <Button
                        key={qNum}
                        variant={qNum === focusedQuestionNumber ? 'primary' : 'secondary'}
                        size="sm"
                        onClick={() => onJumpTo(qNum)}
                        className="!px-2 !py-1 justify-center" // Ensure padding is consistent
                    >
                        {qNum}
                    </Button>
                ))}
            </div>
        </Card>
    );
};

export default QuickNav;
