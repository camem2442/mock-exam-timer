import React, { useState, useMemo } from 'react';
import { Question } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import SolveTimeChart from '../charts/SolveTimeChart';
import { formatTime } from '../../utils/formatters';

interface LiveStatusPanelProps {
    questionNumbers: number[];
    questions: Record<number, Question>;
    currentQuestion: number | null;
    batchMode: boolean;
    lapCounter: number; // Add this line
}

const LiveStatusPanel: React.FC<LiveStatusPanelProps> = ({ questionNumbers, questions, currentQuestion, batchMode, lapCounter }) => {
    const [isAnswerGridVisible, setIsAnswerGridVisible] = useState(true);
    const [sortBySolveOrder, setSortBySolveOrder] = useState(false);
    const [showChart, setShowChart] = useState(true);

    const sortedDisplayNumbers = useMemo(() => {
        if (!sortBySolveOrder) {
            return questionNumbers;
        }
        const sorted = [...questionNumbers];
        sorted.sort((aNum, bNum) => {
            const qA = questions[aNum];
            const qB = questions[bNum];

            const firstSolveA = qA?.solveEvents[0]?.timestamp;
            const firstSolveB = qB?.solveEvents[0]?.timestamp;

            if (firstSolveA !== undefined && firstSolveB !== undefined) {
                return firstSolveA - firstSolveB; // Both solved, sort by time
            }
            if (firstSolveA !== undefined) return -1; // A solved, B not
            if (firstSolveB !== undefined) return 1;  // B solved, A not
            return aNum - bNum; // Neither solved, sort by number
        });
        return sorted;
    }, [questionNumbers, questions, sortBySolveOrder]);

    // lapCounter is added to the dependency array to ensure this recalculates on each lap.
    const sortedQuestionsForChart = useMemo(() => {
        const allQuestions = Object.values(questions);
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

            <button onClick={() => setIsAnswerGridVisible(!isAnswerGridVisible)} className="font-bold text-lg w-full text-left flex justify-between items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4">
                <span>정답 모아보기</span>
                <span className="transition-transform duration-200" style={{ transform: isAnswerGridVisible ? 'rotate(0deg)' : 'rotate(-90deg)' }}>▼</span>
            </button>
            {isAnswerGridVisible && (
                    <div className="mb-4 p-2 bg-slate-900/50 rounded-lg">
                        <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
                            {questionNumbers.length > 0 ? questionNumbers.map(qNum => {
                                const question = questions[qNum];
                                if (!question) return <div key={qNum} className="h-8 bg-slate-700 rounded" />;
                                return (
                                    <div 
                                        key={qNum}
                                        title={`문제 ${qNum}: ${question.answer ?? '미입력'}`}
                                        className={`h-8 flex items-center justify-center rounded text-xs truncate ${question.answer ? 'bg-primary-600 text-white font-bold' : 'bg-slate-700'}`}
                                    >
                                        {question.answer ?? '-'}
                                    </div>
                                );
                            })
                            : <div className="col-span-full text-center text-slate-500 text-sm py-2">시험 시작 전</div>
                            }
                        </div>
                    </div>
                )}

                <div className="flex justify-between items-center mt-2 mb-2">
                    <h3 className="text-lg font-semibold">문제 목록</h3>
                    <ToggleSwitch label="풀이 순서대로 보기" enabled={sortBySolveOrder} onChange={setSortBySolveOrder} />
                </div>

                <div className="max-h-[400px] overflow-y-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="sticky top-0 bg-slate-800/50 backdrop-blur-sm">
                            <tr>
                                <th className="p-2">번호</th>
                                <th className="p-2">풀이 시작</th>
                                <th className="p-2">풀이 시간</th>
                                <th className="p-2">나의 답</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedDisplayNumbers.length > 0 ? sortedDisplayNumbers.map(qNum => {
                                const question = questions[qNum];
                                if (!question) return null;
                                return (
                                    <tr key={qNum} className={`border-b border-slate-700 transition-colors ${currentQuestion === qNum && !batchMode ? 'bg-primary-900/50' : 'hover:bg-slate-800/40'}`}>
                                        <td className="p-2 font-bold">{String(qNum).padStart(2, '0')}</td>
                                        <td className="p-2 tabular-nums">{question.startTime !== undefined ? formatTime(question.startTime) : '—'}</td>
                                        <td className="p-2 tabular-nums">{formatTime(question.solveTime)}</td>
                                        <td className="p-2">{question.answer ?? '—'}</td>
                                    </tr>
                                );
                            })
                            : (
                                <tr>
                                    <td colSpan={4} className="text-center p-8 text-slate-500">시험을 설정하고 시작하세요.</td>
                                </tr>
                            )
                            }
                        </tbody>
                    </table>
                </div>
        </>
    );
};

export default LiveStatusPanel;