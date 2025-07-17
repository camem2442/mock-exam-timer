
import React, { useState } from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { ExamNameModal } from './ui/ExamNameModal';
import AdPlaceholder from './ads/AdPlaceholder';
import SolveTimeChart from './charts/SolveTimeChart';
import FinalAnswerSheet from './review/FinalAnswerSheet';
import TimeManagementInsights from './review/TimeManagementInsights';
import SolvingRecordTable from './review/SolvingRecordTable';
import { generateCSV, copyToClipboard, downloadCSV, type ExportData } from '../utils/exportUtils';

// 공유 기능을 위한 컴포넌트
const ShareButton: React.FC<{ questions: Question[] }> = ({ questions }) => {
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const handleShare = async () => {
        const shareText = `모의고사 타이머로 ${questions.length}문제를 풀었습니다! 총 소요시간: ${Math.floor(questions.reduce((sum, q) => sum + q.solveTime, 0) / 60)}분\n\nhttps://mock-exam-timer.vercel.app`;
        
        if (navigator.share) {
            // 네이티브 공유 API 사용 (모바일)
            try {
                await navigator.share({
                    title: '모의고사 타이머 & 분석기',
                    text: shareText,
                    url: 'https://mock-exam-timer.vercel.app'
                });
            } catch (error) {
                console.log('공유가 취소되었습니다.');
            }
        } else {
            // 클립보드 복사 (데스크톱)
            try {
                await navigator.clipboard.writeText(shareText);
                setShowCopyMessage(true);
                setTimeout(() => setShowCopyMessage(false), 3000);
            } catch (error) {
                // 폴백: 수동 복사
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setShowCopyMessage(true);
                setTimeout(() => setShowCopyMessage(false), 3000);
            }
        }
    };

    return (
        <>
            <Button 
                onClick={handleShare} 
                variant="ghost" 
                size="icon"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 flex-shrink-0"
                aria-label="결과 공유"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
            </Button>
            
            {/* 클립보드 복사 성공 메시지 */}
            {showCopyMessage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg shadow-lg p-4 max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 whitespace-nowrap">
                                클립보드에 복사됨
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-blue-700 dark:text-blue-300 whitespace-nowrap overflow-hidden text-ellipsis">
                                공유 텍스트가 클립보드에 복사되었습니다!
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCopyMessage(false)}
                            className="flex-shrink-0 text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

// 시험 기록 저장 기능을 위한 컴포넌트
const SaveExamButton: React.FC<{ questions: Question[] }> = ({ questions }) => {
    const [isExamNameModalOpen, setIsExamNameModalOpen] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
    const [savedExamName, setSavedExamName] = useState('');

    const handleSaveExamRecord = () => {
        setIsExamNameModalOpen(true);
    };

    const handleSaveExamName = (examName: string) => {
        // 시험 기록 저장 (로컬 스토리지 사용)
        const examRecords = JSON.parse(localStorage.getItem('examBookmarks') || '[]');
        const recordData = {
            id: Date.now(),
            name: examName,
            date: new Date().toISOString(),
            questions: questions,
            summary: `${questions.length}문제, 총 ${questions.reduce((sum, q) => sum + q.solveTime, 0)}초`
        };
        examRecords.push(recordData);
        localStorage.setItem('examBookmarks', JSON.stringify(examRecords));
        
        // 성공 메시지 표시
        setSavedExamName(examName);
        setShowSuccessMessage(true);
        
        // 5초 후 메시지 자동 숨김
        setTimeout(() => {
            setShowSuccessMessage(false);
        }, 5000);
    };

    return (
        <>
            <Button 
                onClick={handleSaveExamRecord} 
                variant="secondary"
                size="md"
            >
                시험 기록 저장 (베타)
            </Button>
            <ExamNameModal
                isOpen={isExamNameModalOpen}
                onClose={() => setIsExamNameModalOpen(false)}
                onSave={handleSaveExamName}
            />
            
            {/* 성공 메시지 */}
            {showSuccessMessage && (
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[60] bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg shadow-lg p-4 max-w-sm">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-primary-800 dark:text-primary-200 whitespace-nowrap">
                                시험 기록 저장 완료
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-primary-700 dark:text-primary-300 whitespace-nowrap overflow-hidden text-ellipsis">
                                "{savedExamName}" 시험 기록이 브라우저 저장소에 저장되었습니다.
                            </p>
                            <p className="mt-1 text-xs text-primary-600 dark:text-primary-400 whitespace-nowrap overflow-hidden text-ellipsis">
                                ※ 브라우저를 바꾸거나 데이터를 삭제하면 기록이 사라질 수 있습니다.
                            </p>
                        </div>
                        <button
                            onClick={() => setShowSuccessMessage(false)}
                            className="flex-shrink-0 text-primary-400 hover:text-primary-600 dark:hover:text-primary-300"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};


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
                className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] min-w-0 overflow-hidden flex flex-col modal-container" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">풀이 과정 분석 리포트</h2>
                        <ShareButton questions={questions} />
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4">
                        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 sm:mt-0 mt-2">
                            아래 데이터를 해설지와 함께 보며 자신의 풀이 습관을 복기해보세요.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <SaveExamButton questions={questions} />
                            <Button onClick={onContinue} variant="secondary" className="w-full sm:w-auto">이어서 진행</Button>
                            <Button onClick={onRestart} variant="primary" className="w-full sm:w-auto">새로운 시험 시작</Button>
                        </div>
                    </div>
                </header>
                <main className="overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-6 sm:space-y-8">
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