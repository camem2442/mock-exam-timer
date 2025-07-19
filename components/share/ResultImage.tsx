import { forwardRef } from 'react';
import { Question } from '../../types';
import SimpleSolveTimeChart from './SimpleSolveTimeChart';
import FinalAnswerSheet from '../review/FinalAnswerSheet';
import { formatTime } from '../../utils/formatters';
import { siteConfig } from '../../config/site';

interface ResultImageProps {
  questions: Question[];
  examName: string;
  includeGrading: boolean;
  blurAnswer?: boolean;
  totalMinutes?: number;
}

export const ResultImage = forwardRef<HTMLDivElement, ResultImageProps>(
  ({ questions, examName, includeGrading, blurAnswer, totalMinutes }, ref) => {
    
    // 채점된 문제 수 계산
    const gradedQuestions = questions.filter(q => q.isCorrect !== undefined);
    const correctCount = gradedQuestions.filter(q => q.isCorrect === true).length;
    const totalTime = questions.reduce((sum, q) => sum + q.solveTime, 0);

    // 채점 정보 미포함 시, isCorrect 상태를 모두 undefined로 만듦
    const displayQuestions = includeGrading ? questions : questions.map(q => ({ ...q, isCorrect: undefined }));

    return (
      // 세로형 이미지의 전체 크기와 스타일 지정
      <div 
        ref={ref} 
        className="dark bg-background text-foreground p-6 result-image-fixed" 
        style={{ 
          fontFamily: "'Noto Sans KR', sans-serif",
          width: 580,
          maxWidth: 580,
          minWidth: 580
        }}
        data-testid="result-image-container"
      >
        
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-foreground">{examName}</h1>
        </header>
        
        {/* 2. 결과 요약 */}
        <section className="bg-card p-4 rounded-lg mb-6 border border-border">
          <h2 className="text-2xl font-semibold mb-3 text-center text-foreground">결과 요약</h2>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-muted p-3 rounded-md">
              <p className="text-muted-foreground text-base">총 소요 시간</p>
              <p className="text-3xl font-bold text-foreground">{formatTime(totalTime)}</p>
            </div>
            <div className="bg-muted p-3 rounded-md">
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
                  <p className="text-3xl font-bold text-foreground">
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
            <section className="mb-6 bg-card p-4 rounded-lg border border-border">
                {/* Spacing div to match the height of h2 titles in other sections */}
                <div className="h-7" />
                <FinalAnswerSheet questions={displayQuestions} blurAnswer={blurAnswer} forceCols={10} />
            </section>
        )}

        {/* 4. 풀이 시간 그래프 */}
        <section className="mb-4 bg-card p-4 rounded-lg border border-border overflow-hidden">
             <h2 className="text-2xl font-semibold mb-3 text-center text-foreground">풀이 시간 그래프</h2>
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
            className="text-2xl font-bold text-primary hover:opacity-80 transition-opacity"
          >
            mocktimer.kr
          </a>
          <p className="text-base text-muted-foreground">나만의 시험 분석 파트너</p>
        </footer>
      </div>
    );
  }
); 