import { forwardRef, useEffect, useState } from 'react';
import { Question } from '../../types';
import SimpleSolveTimeChart from './SimpleSolveTimeChart';
import FinalAnswerSheet from '../review/FinalAnswerSheet';
import { formatTime } from '../../utils/formatters';
import { siteConfig } from '../../config/site';

interface ResultImageDisplayProps {
  questions: Question[];
  examName: string;
  includeGrading: boolean;
  blurAnswer?: boolean;
  totalMinutes?: number;
}

export const ResultImageDisplay = forwardRef<HTMLDivElement, ResultImageDisplayProps>(
  ({ questions, examName, includeGrading, blurAnswer, totalMinutes }, ref) => {
    const [containerWidth, setContainerWidth] = useState(580);
    
    // 화면 크기에 따른 너비 계산
    useEffect(() => {
      const updateWidth = () => {
        const width = window.innerWidth;
        let newWidth = 580;
        
        if (width <= 360) {
          newWidth = Math.min(width - 32, 320);
        } else if (width <= 480) {
          newWidth = Math.min(width - 24, 400);
        } else if (width <= 640) {
          newWidth = Math.min(width - 32, 500);
        } else if (width <= 768) {
          newWidth = Math.min(width - 32, 550);
        }
        
        setContainerWidth(newWidth);
      };
      
      updateWidth();
      window.addEventListener('resize', updateWidth);
      return () => window.removeEventListener('resize', updateWidth);
    }, []);
    
    // 채점된 문제 수 계산
    const gradedQuestions = questions.filter(q => q.isCorrect !== undefined);
    const correctCount = gradedQuestions.filter(q => q.isCorrect === true).length;
    const totalTime = Math.max(0, ...questions.flatMap(q => q.solveEvents.map(e => e.timestamp)));

    // 채점 정보 미포함 시, isCorrect 상태를 모두 undefined로 만듦
    const displayQuestions = includeGrading ? questions : questions.map(q => ({ ...q, isCorrect: undefined }));

    return (
      <div 
        ref={ref} 
        className="bg-card text-card-foreground p-4 sm:p-6 rounded-xl shadow-lg border overflow-hidden" 
        style={{ 
          fontFamily: "'Noto Sans KR', sans-serif",
          width: containerWidth,
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
        data-testid="result-image-display-container"
      >
        <div className="bg-muted dark:bg-background text-foreground p-6 rounded-lg">
        
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-brand">{examName}</h1>
        </header>
        
        {/* 2. 결과 요약 */}
        <section className="bg-background dark:bg-card p-4 rounded-lg mb-6 border border-border">
          <h2 className="text-2xl font-semibold mb-3 text-center">결과 요약</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted dark:bg-muted p-3 rounded-md">
              <p className="text-muted-foreground text-base">총 소요 시간</p>
              {includeGrading && gradedQuestions.length > 0 && totalMinutes ? (
                  <p className="text-2xl font-bold whitespace-nowrap">
                    {`${Math.round(totalTime / 60)}분 / ${totalMinutes}분`}
                  </p>
              ) : (
                  <p className="text-3xl font-bold whitespace-nowrap">
                    {`${Math.round(totalTime / 60)}분`}
                  </p>
              )}
            </div>
            <div className="bg-muted dark:bg-muted p-3 rounded-md">
              {includeGrading && gradedQuestions.length > 0 ? (
                <>
                  <p className="text-muted-foreground text-base">채점 결과</p>
                  <p className="text-3xl font-bold">
                    <span className="text-success">{correctCount}</span> / {gradedQuestions.length}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-muted-foreground text-base">시험 전체 시간</p>
                  <p className="text-3xl font-bold">
                    {totalMinutes ? `${totalMinutes}분` : '-'}
                  </p>
                </>
              )}
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground mt-4">
            {new Date().toLocaleString('ko-KR', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric', 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </section>

        {/* 3. 최종 답안지 (채점 포함 시에만 표시) */}
        {includeGrading && gradedQuestions.length > 0 && (
            <section className="mb-6 bg-background dark:bg-card p-4 rounded-lg border border-border">
                {/* Spacing div to match the height of h2 titles in other sections */}
                <div className="h-7" />
                <FinalAnswerSheet questions={displayQuestions} blurAnswer={blurAnswer} forceCols={10} />
            </section>
        )}

        {/* 4. 풀이 시간 그래프 */}
        <section className="mb-4 bg-background dark:bg-card p-4 rounded-lg border border-border overflow-hidden">
             <h2 className="text-2xl font-semibold mb-3 text-center">풀이 시간 그래프</h2>
             <div style={{ height: 250 }} className="overflow-hidden">
                <SimpleSolveTimeChart questions={questions} />
             </div>
        </section>

        {/* 5. 브랜딩 */}
        <footer className="text-center mt-6 pt-4 border-t border-border">
          <a 
            href={siteConfig.domain} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-2xl font-bold text-brand hover:opacity-80 transition-opacity"
          >
            mocktimer.kr
          </a>
          <p className="text-base text-muted-foreground">나만의 시험 분석 파트너</p>
        </footer>
        </div>
      </div>
    );
  }
);