import React, { type FC, useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (answers: Record<number, string>) => void;
  startProblem: number;
  endProblem: number;
}

export const GradingModal: FC<GradingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  startProblem,
  endProblem,
}) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [subjectiveProblems, setSubjectiveProblems] = useState<Set<number>>(new Set());
  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  useEffect(() => {
    if (isOpen) {
      setAnswers({});
      setSubjectiveProblems(new Set());
    }
  }, [isOpen]);

  const problemNumbers = Array.from(
    { length: endProblem - startProblem + 1 },
    (_, i) => startProblem + i
  );

  const handleAnswerChange = (problemNumber: number, value: string) => {
    // Only allow single digit for non-subjective problems for auto-advance
    if (!subjectiveProblems.has(problemNumber) && value.length > 1) {
       setAnswers((prev) => ({ ...prev, [problemNumber]: value.slice(-1) }));
       // Don't auto-advance if user is correcting, let them see the change.
       return;
    }

    setAnswers((prev) => ({ ...prev, [problemNumber]: value }));

    // Auto-advance logic
    if (!subjectiveProblems.has(problemNumber) && /^\d$/.test(value)) {
        const currentIndex = problemNumbers.indexOf(problemNumber);
        if (currentIndex === -1) return;

        let nextIndex = currentIndex + 1;
        while(nextIndex < problemNumbers.length) {
            const nextProblemNumber = problemNumbers[nextIndex];
            if (!subjectiveProblems.has(nextProblemNumber)) {
                inputRefs.current[nextProblemNumber]?.focus();
                return;
            }
            nextIndex++;
        }
    }
  };

  const handleToggleSubjective = (problemNumber: number) => {
    setSubjectiveProblems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(problemNumber)) {
        newSet.delete(problemNumber);
      } else {
        newSet.add(problemNumber);
      }
      return newSet;
    });
  };

  const handleSubmit = () => {
    onSubmit(answers);
    onClose();
  };

  if (!isOpen) return null;

  const CHUNK_SIZE = isDesktop ? 10 : 5;
  const chunkedProblems = [];
  for (let i = 0; i < problemNumbers.length; i += CHUNK_SIZE) {
    chunkedProblems.push(problemNumbers.slice(i, i + CHUNK_SIZE));
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-h-[90vh] flex flex-col ${isDesktop ? 'max-w-7xl' : 'max-w-2xl'}`}>
        <div className="p-4 border-b dark:border-slate-700">
          <h2 className="text-xl font-bold">정답 입력</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
             객관식은 숫자만 입력하면 다음 문제로 자동 이동합니다. 주관식으로 체크한 문제는 건너뛰며, 직접 입력할 수 있습니다.
          </p>
        </div>
        <div className="p-6 overflow-y-auto">
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {chunkedProblems.map((chunk, chunkIndex) => (
                <React.Fragment key={chunkIndex}>
                  {chunkIndex > 0 && (
                    <tr><td colSpan={CHUNK_SIZE + 1} className="h-6"></td></tr>
                  )}
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <th className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400 w-24"></th>
                    {chunk.map(num => (
                      <th key={num} className="p-2 text-base font-bold text-center">{num}</th>
                    ))}
                    {Array(CHUNK_SIZE - chunk.length).fill(0).map((_, i) => <th key={`h-e-${i}`} className="p-2"></th>)}
                  </tr>
                  <tr>
                    <td className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right pr-4">주관식</td>
                    {chunk.map(num => (
                      <td key={num} className="p-2 text-center align-middle">
                        <input
                          type="checkbox"
                          id={`subjective-${num}`}
                          checked={subjectiveProblems.has(num)}
                          onChange={() => handleToggleSubjective(num)}
                          className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500 cursor-pointer"
                        />
                      </td>
                    ))}
                    {Array(CHUNK_SIZE - chunk.length).fill(0).map((_, i) => <td key={`c-e-${i}`}></td>)}
                  </tr>
                  <tr>
                    <td className="p-2 text-sm font-semibold text-slate-500 dark:text-slate-400 text-right pr-4">답</td>
                    {chunk.map(num => (
                      <td key={num} className="p-1">
                        <Input
                          ref={el => { inputRefs.current[num] = el; }}
                          id={`answer-${num}`}
                          type="tel"
                          inputMode="numeric"
                          value={answers[num] || ''}
                          onChange={(e) => handleAnswerChange(num, e.target.value)}
                          className="w-full text-center text-base"
                        />
                      </td>
                    ))}
                    {Array(CHUNK_SIZE - chunk.length).fill(0).map((_, i) => <td key={`i-e-${i}`}></td>)}
                  </tr>
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t dark:border-slate-700 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>취소</Button>
          <Button onClick={handleSubmit}>채점하기</Button>
        </div>
      </div>
    </div>
  );
};
