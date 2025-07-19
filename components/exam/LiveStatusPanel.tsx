import React, { useState, useMemo } from 'react';
import { Question } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import SolveTimeChart from '../charts/SolveTimeChart';
import { AnswerGrid } from './AnswerGrid';
import { ProblemStatusTable } from './ProblemStatusTable';

interface LiveStatusPanelProps {
    questionNumbers: number[];
    questions: Record<number, Question>;
    currentQuestion: number | null;
    batchMode: boolean;
    lapCounter: number;
}

const LiveStatusPanel: React.FC<LiveStatusPanelProps> = ({ 
    questionNumbers, 
    questions, 
    currentQuestion, 
    batchMode, 
    lapCounter 
}) => {
    const [sortBySolveOrder, setSortBySolveOrder] = useState(false);
    const [showChart, setShowChart] = useState(true);

    // lapCounter is added to the dependency array to ensure this recalculates on each lap.
    const sortedQuestionsForChart = useMemo(() => {
        const allQuestions = Object.values(questions);
        if (allQuestions.length === 0) {
            return [];
        }
        if (!sortBySolveOrder) {
            return allQuestions.sort((a, b) => a.number - b.number);
        }
        
        return allQuestions.sort((qA, qB) => {
            const firstSolveA = qA.solveEvents[0]?.timestamp;
            const firstSolveB = qB.solveEvents[0]?.timestamp;

            if (firstSolveA !== undefined && firstSolveB !== undefined) {
                return firstSolveA - firstSolveB;
            }
            if (firstSolveA !== undefined) return -1;
            if (firstSolveB !== undefined) return 1;
            return qA.number - qB.number;
        });
    }, [questions, sortBySolveOrder, lapCounter]);


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">실시간 풀이 현황</h2>
                <ToggleSwitch label="차트 보기" enabled={showChart} onChange={setShowChart} />
            </div>

            {showChart && (
                <div className="my-6 border-t border-slate-700 pt-4">
                    <SolveTimeChart 
                        questions={sortedQuestionsForChart} 
                    />
                </div>
            )}

            <AnswerGrid questionNumbers={questionNumbers} questions={questions} />

            <div className="flex justify-between items-center mt-2 mb-2">
                <h3 className="text-lg font-semibold">문제 목록</h3>
                <ToggleSwitch label="풀이 순서대로 보기" enabled={sortBySolveOrder} onChange={setSortBySolveOrder} />
            </div>

            <ProblemStatusTable
                questionNumbers={questionNumbers}
                questions={questions}
                currentQuestion={currentQuestion}
                batchMode={batchMode}
                sortBySolveOrder={sortBySolveOrder}
            />
        </>
    );
};

export default LiveStatusPanel;