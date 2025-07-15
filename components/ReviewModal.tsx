
import React from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import AdPlaceholder from './ads/AdPlaceholder';
import SolveTimeChart from './charts/SolveTimeChart';
import FinalAnswerSheet from './review/FinalAnswerSheet';
import TimeManagementInsights from './review/TimeManagementInsights';
import SolvingRecordTable from './review/SolvingRecordTable';


interface ReviewModalProps {
  questions: Question[];
  onContinue: () => void;
  onRestart: () => void;
  onGradeRequest: () => void;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ questions, onContinue, onRestart, onGradeRequest }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onContinue}>
            <div 
                className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex justify-between items-center flex-wrap gap-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">풀이 과정 분석 리포트</h2>
                        <div className="flex items-center gap-4">
                            <Button onClick={onContinue} variant="secondary">이어서 진행</Button>
                            <Button onClick={onRestart} variant="primary">새로운 시험 시작</Button>
                        </div>
                    </div>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        아래 데이터를 해설지와 함께 보며 자신의 풀이 습관을 복기해보세요.
                    </p>
                </header>
                <main className="overflow-y-auto p-6 space-y-8">
                    <Card>
                       <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">최종 답안지</h3>
                            <Button onClick={onGradeRequest}>채점하기</Button>
                        </div>
                       <FinalAnswerSheet questions={questions} />
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2">
                           <Card className="h-full">
                                <SolvingRecordTable questions={questions} />
                           </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-6">
                           <TimeManagementInsights questions={questions} />
                        </div>
                    </div>

                    <Card>
                        <SolveTimeChart questions={questions} />
                    </Card>
                    <AdPlaceholder />
                </main>
            </div>
        </div>
    );
};

export default ReviewModal;