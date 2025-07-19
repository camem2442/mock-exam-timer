
import React, { useState } from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import AdPlaceholder from './ads/AdPlaceholder';
import SolveTimeChart from './charts/SolveTimeChart';
import FinalAnswerSheet from './review/FinalAnswerSheet';
import TimeManagementInsights from './review/TimeManagementInsights';
import SolvingRecordTable from './review/SolvingRecordTable';
import { generateCSV, copyToClipboard, downloadCSV, type ExportData } from '../utils/exportUtils';
import ShareImageButton from './share/ShareImageButton';
import { Input } from './ui/Input';
import SaveExamButton from './review/SaveExamButton';
import ShareButton from './share/ShareButton';

interface ReviewModalProps {
  questions: Question[];
  examName: string;
  onExamNameChange: (newName: string) => void;
  onContinue: () => void;
  onRestart: () => void;
  onGradeRequest: () => void;
  totalMinutes?: number;
}

const ReviewModal: React.FC<ReviewModalProps> = ({ questions, examName, onExamNameChange, onContinue, onRestart, onGradeRequest, totalMinutes }) => {
    const [isEditingName, setIsEditingName] = useState(false);
    const [tempExamName, setTempExamName] = useState(examName);

    const handleStartEdit = () => {
        setTempExamName(examName);
        setIsEditingName(true);
    };

    const handleSaveEdit = () => {
        onExamNameChange(tempExamName);
        setIsEditingName(false);
    };

    const handleCancelEdit = () => {
        setIsEditingName(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onContinue}>
                <div 
                    className="bg-background dark:bg-card/95 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] min-w-0 overflow-hidden flex flex-col modal-container" 
                    onClick={e => e.stopPropagation()}
                >
                <header className="p-4 sm:p-6 border-b border-border flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">풀이 과정 분석 리포트</h2>
                        <ShareButton questions={questions} />
                    </div>
                    <div className="flex flex-col justify-between items-start gap-4 mt-2">
                        <div className="w-full pb-4 border-b border-border">
                            <p className="text-sm sm:text-base text-muted-foreground">
                                아래 데이터를 해설지와 함께 보며 자신의 풀이 습관을 복기해보세요.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:self-end">
                            <SaveExamButton questions={questions} examName={examName} />
                            <ShareImageButton questions={questions} examName={examName} totalMinutes={totalMinutes} />
                            <div className="flex w-full sm:w-auto gap-2">
                                <Button onClick={onContinue} variant="secondary" className="flex-1 sm:w-auto">이어서 진행</Button>
                                <Button onClick={onRestart} variant="default" className="flex-1 sm:w-auto">새로운 시험 시작</Button>
                            </div>
                        </div>
                    </div>
                </header>
                <main className="overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 sm:space-y-8">
                    <Card>
                        {isEditingName ? (
                            <div className="flex w-full items-center justify-between gap-2">
                                <Input
                                    type="text"
                                    value={tempExamName}
                                    onChange={(e) => setTempExamName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') handleSaveEdit();
                                        if (e.key === 'Escape') handleCancelEdit();
                                    }}
                                    className="flex-1 px-2 py-1 text-lg font-semibold bg-background border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring"
                                    placeholder="시험 이름을 입력하세요"
                                    autoFocus
                                />
                                <div className="flex flex-shrink-0 gap-1">
                                    <button onClick={handleSaveEdit} className="opacity-70 hover:opacity-100 transition-opacity p-1" title="저장">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </button>
                                    <button onClick={handleCancelEdit} className="opacity-70 hover:opacity-100 transition-opacity p-1" title="취소">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex w-full items-center justify-between">
                                <h3 className="font-semibold text-foreground text-lg">
                                    {examName || '이름 없는 시험'}
                                </h3>
                                <button onClick={handleStartEdit} className="opacity-50 hover:opacity-100 transition-opacity p-1" title="이름 변경">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </Card>
                    <Card>
                       <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-foreground">최종 답안지</h3>
                            <Button onClick={onGradeRequest}>채점하기</Button>
                        </div>
                       <FinalAnswerSheet 
                           key={JSON.stringify(questions.map(q => q.isCorrect))}
                           questions={questions} 
                       />
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
                        <div className="lg:col-span-2">
                           <Card className="h-full">
                                <SolvingRecordTable questions={questions} />
                           </Card>
                        </div>
                        <div className="lg:col-span-1 space-y-4 sm:space-y-6">
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