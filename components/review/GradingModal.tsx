import React, { type FC, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useMediaQuery } from '../../hooks/useMediaQuery';
import { type useGrading } from '../../hooks/useGrading';

type GradingHookReturn = ReturnType<typeof useGrading>;

interface GradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  startProblem: number;
  endProblem: number;
  grading: GradingHookReturn;
}

export const GradingModal: FC<GradingModalProps> = ({
  isOpen,
  onClose,
  startProblem,
  endProblem,
  grading,
}) => {
  const { 
    answers, 
    subjectiveProblems, 
    handleAnswerChange, 
    handleToggleSubjective, 
    handleSubmit 
  } = grading;

  const inputRefs = useRef<Record<number, HTMLInputElement | null>>({});
  const isDesktop = useMediaQuery('(min-width: 1024px)');

  const problemNumbers = Array.from(
    { length: endProblem - startProblem + 1 },
    (_, i) => startProblem + i
  );

  const focusNextInput = (currentProblemNumber: number) => {
    const currentIndex = problemNumbers.indexOf(currentProblemNumber);
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
  };

  const handleLocalAnswerChange = (problemNumber: number, value: string) => {
    handleAnswerChange(problemNumber, value, focusNextInput);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setTimeout(() => {
      e.target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  }

  const handleModalSubmit = () => {
    handleSubmit();
    onClose();
  };

  if (!isOpen) return null;

  const CHUNK_SIZE = isDesktop ? 10 : 5;
  const chunkedProblems = [];
  for (let i = 0; i < problemNumbers.length; i += CHUNK_SIZE) {
    chunkedProblems.push(problemNumbers.slice(i, i + CHUNK_SIZE));
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="grading-modal-title"
    >
      <div className={`bg-white dark:bg-slate-900 rounded-lg shadow-xl w-full max-h-[90vh] min-w-0 flex flex-col modal-container ${isDesktop ? 'max-w-7xl' : 'max-w-2xl'}`}>
        <div className="p-4 border-b dark:border-slate-700">
          <h2 id="grading-modal-title" className="text-lg sm:text-xl font-bold">정답 입력</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
             객관식은 숫자만 입력하면 다음 문제로 자동 이동합니다. 주관식으로 체크한 문제는 건너뛰며, 직접 입력할 수 있습니다.
          </p>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto">
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
                          autoComplete="off"
                          autoCorrect="off"
                          autoCapitalize="off"
                          spellCheck="false"
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
                          aria-label={`${num}번 정답`}
                          type="tel"
                          inputMode="numeric"
                          value={answers[num] || ''}
                          onChange={(e) => handleLocalAnswerChange(num, e.target.value)}
                          onFocus={handleFocus}
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
          <Button variant="secondary" onClick={onClose} className="text-sm px-3 py-2">취소</Button>
          <Button onClick={handleModalSubmit} className="text-sm px-3 py-2">채점하기</Button>
        </div>
      </div>
    </div>
  );
};
