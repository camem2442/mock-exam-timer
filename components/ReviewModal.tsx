
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
                alert('공유 텍스트가 클립보드에 복사되었습니다!');
            } catch (error) {
                // 폴백: 수동 복사
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('공유 텍스트가 클립보드에 복사되었습니다!');
            }
        }
    };

    return (
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
    );
};

// 시험 기록 저장 기능을 위한 컴포넌트
const SaveExamButton: React.FC<{ questions: Question[] }> = ({ questions }) => {
    const [isExamNameModalOpen, setIsExamNameModalOpen] = useState(false);

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
        alert(`"${examName}" 시험 기록이 브라우저 저장소에 저장되었습니다!\n\n※ 브라우저를 바꾸거나 데이터를 삭제하면 기록이 사라질 수 있습니다.`);
    };

    return (
        <>
            <Button 
                onClick={handleSaveExamRecord} 
                variant="secondary"
                size="md"
            >
                💾 시험 기록 저장 (베타)
            </Button>
            <ExamNameModal
                isOpen={isExamNameModalOpen}
                onClose={() => setIsExamNameModalOpen(false)}
                onSave={handleSaveExamName}
            />
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
                className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">풀이 과정 분석 리포트</h2>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                            <div className="flex items-center gap-2">
                                <ShareButton questions={questions} />
                                <SaveExamButton questions={questions} />
                            </div>
                            <Button onClick={onContinue} variant="secondary" className="w-full sm:w-auto">이어서 진행</Button>
                            <Button onClick={onRestart} variant="primary" className="w-full sm:w-auto">새로운 시험 시작</Button>
                        </div>
                    </div>
                    <p className="mt-2 text-sm sm:text-base text-slate-600 dark:text-slate-400">
                        아래 데이터를 해설지와 함께 보며 자신의 풀이 습관을 복기해보세요.
                    </p>
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