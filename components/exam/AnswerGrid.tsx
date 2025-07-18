import React, { useState } from 'react';
import { Question } from '../../types';

interface AnswerGridProps {
  questionNumbers: number[];
  questions: Record<number, Question>;
}

export const AnswerGrid: React.FC<AnswerGridProps> = ({ questionNumbers, questions }) => {
  const [isAnswerGridVisible, setIsAnswerGridVisible] = useState(true);

  return (
    <div>
      <button 
        onClick={() => setIsAnswerGridVisible(!isAnswerGridVisible)} 
        className="font-bold text-lg w-full text-left flex justify-between items-center hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-4"
      >
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
    </div>
  );
}; 