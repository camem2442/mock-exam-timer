import React, { useMemo } from 'react';
import { Question } from '../../types';
import { formatTime } from '../../utils/formatters';

interface ProblemStatusTableProps {
  questionNumbers: number[];
  questions: Record<number, Question>;
  currentQuestion: number | null;
  batchMode: boolean;
  sortBySolveOrder: boolean;
}

export const ProblemStatusTable: React.FC<ProblemStatusTableProps> = ({ 
  questionNumbers, 
  questions, 
  currentQuestion, 
  batchMode, 
  sortBySolveOrder 
}) => {
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
        return firstSolveA - firstSolveB;
      }
      if (firstSolveA !== undefined) return -1;
      if (firstSolveB !== undefined) return 1;
      return aNum - bNum;
    });
    return sorted;
  }, [questionNumbers, questions, sortBySolveOrder]);

  return (
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
  );
}; 