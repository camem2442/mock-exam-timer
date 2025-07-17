
import React from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import AdPlaceholder from './ads/AdPlaceholder';
import SolveTimeChart from './charts/SolveTimeChart';
import FinalAnswerSheet from './review/FinalAnswerSheet';
import TimeManagementInsights from './review/TimeManagementInsights';
import SolvingRecordTable from './review/SolvingRecordTable';

// 브라우저 즐겨찾기와 공유 기능을 위한 컴포넌트
const ShareButtons: React.FC<{ questions: Question[] }> = ({ questions }) => {
    const handleBrowserBookmark = () => {
        // 브라우저 즐겨찾기에 추가
        const title = '모의고사 타이머 & 분석기';
        const url = 'https://mock-exam-timer.vercel.app';
        
        // 브라우저 즐겨찾기 추가 (간단한 방법)
        alert('Ctrl+D (또는 Cmd+D)를 눌러 즐겨찾기에 추가하세요!');
    };

    const handleSaveExamRecord = () => {
        // 시험 기록 저장 (로컬 스토리지 사용)
        const examRecords = JSON.parse(localStorage.getItem('examBookmarks') || '[]');
        const recordData = {
            id: Date.now(),
            date: new Date().toISOString(),
            questions: questions,
            summary: `${questions.length}문제, 총 ${questions.reduce((sum, q) => sum + q.solveTime, 0)}초`
        };
        examRecords.push(recordData);
        localStorage.setItem('examBookmarks', JSON.stringify(examRecords));
        alert('시험 기록이 브라우저 저장소에 저장되었습니다!\n\n※ 브라우저를 바꾸거나 데이터를 삭제하면 기록이 사라질 수 있습니다.');
    };

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
        <div className="flex items-center gap-2">
            <Button 
                onClick={handleSaveExamRecord} 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
                💾 시험 기록 저장 (베타)
            </Button>
            <Button 
                onClick={handleBrowserBookmark} 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
                ⭐ 즐겨찾기
            </Button>
            <Button 
                onClick={handleShare} 
                variant="ghost" 
                size="sm"
                className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
            >
                📤 공유하기
            </Button>
        </div>
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
                            <ShareButtons questions={questions} />
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