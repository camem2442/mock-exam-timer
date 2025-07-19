import React, { useRef, useCallback, useMemo, useState, useEffect, type RefObject } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import TimerDisplay from './TimerDisplay';
import QuickNav from './QuickNav';
import DynamicMarkingWindow from './DynamicMarkingWindow';
import ControlToolbar from './ControlToolbar';
import ProblemList from './ProblemList';
import { type Question } from '../../types';

interface ActiveExamViewProps {
  problemRefs: RefObject<Record<number, HTMLDivElement | null>>;
  questions: (Question & { isCorrect?: boolean })[];
  onLap: (questionNumber: number, answer?: string) => void;
  focusedQuestionNumber: number | null;
  setFocusedQuestionNumber: (num: number | null) => void;
  subjectiveInputs: Record<number, string>;
  onSubjectiveInputChange: (number: number, value: string) => void;
  batchMode: boolean;
  onBatchModeChange: (enabled: boolean) => void;
  onBatchRecord: () => void;
  batchSelectedQuestions: Set<number>;
  onFinishExam: () => void;
  isExamActive: boolean;
  isMarkingMode: boolean;
  onMarkingModeChange: () => void;
  timer: {
    timeLeft: number;
    elapsedTime: number;
    currentProblemTime: number;
    overtime: number;
    isPaused: boolean;
    timeUp: boolean;
    togglePause: () => void;
    recordLap: () => void;
  };
  examName: string;
  isUnlimitedTime: boolean;
  startQuestionStr: string;
  endQuestionStr: string;
  totalMinutesStr: string;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({
  problemRefs,
  questions,
  onLap,
  focusedQuestionNumber,
  setFocusedQuestionNumber,
  subjectiveInputs,
  onSubjectiveInputChange,
  batchMode,
  onBatchModeChange,
  onBatchRecord,
  batchSelectedQuestions,
  onFinishExam,
  isExamActive,
  isMarkingMode,
  onMarkingModeChange,
  timer,
  examName,
  isUnlimitedTime,
  startQuestionStr,
  endQuestionStr,
  totalMinutesStr,
}) => {

  const problemListContainerRef = useRef<HTMLDivElement | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [visibleRange, setVisibleRange] = useState({ start: 1, end: Math.min(5, questions.length || 1) });

  // 스크롤 감지 (throttled with hysteresis)
  useEffect(() => {
    let ticking = false;
    const SCROLL_UP_THRESHOLD = 80;   // 위로 스크롤할 때 normal 모드로 전환하는 임계값
    const SCROLL_DOWN_THRESHOLD = 120; // 아래로 스크롤할 때 compact 모드로 전환하는 임계값
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.scrollY || window.pageYOffset;
          
          // 하이스테리시스 적용: 현재 상태에 따라 다른 임계값 사용
          if (isScrolled) {
            // compact 모드일 때는 더 작은 값에서 normal 모드로 전환
            if (scrollY < SCROLL_UP_THRESHOLD) {
              setIsScrolled(false);
            }
          } else {
            // normal 모드일 때는 더 큰 값에서 compact 모드로 전환
            if (scrollY > SCROLL_DOWN_THRESHOLD) {
              setIsScrolled(true);
            }
          }
          
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // 초기 상태 확인

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isScrolled]);

  const setProblemRef = useCallback((num: number, el: HTMLDivElement | null) => {
    if(problemRefs.current) {
      problemRefs.current[num] = el;
    }
  }, []);

  const handleJumpToQuestion = useCallback((questionNumber: number) => {
    setFocusedQuestionNumber(questionNumber);
    
    const container = problemListContainerRef.current;
    const targetElement = problemRefs.current[questionNumber];

    if (container && targetElement) {
        const containerRect = container.getBoundingClientRect();
        const targetRect = targetElement.getBoundingClientRect();
        const isVisible = targetRect.top >= containerRect.top && targetRect.bottom <= containerRect.bottom;
        if(isVisible) return;
        const offset = targetElement.offsetTop - container.offsetTop;
        container.scrollTo({ top: offset, behavior: 'smooth' });
    }
  }, [setFocusedQuestionNumber, problemRefs]);

  const focusedQuestionObj = focusedQuestionNumber && questions.length > 0 
    ? questions.find(q => q.number === focusedQuestionNumber) 
    : null;
  const questionMap = React.useMemo(() => 
    questions.length > 0 ? Object.fromEntries(questions.map(q => [q.number, q])) : {}, 
    [questions]
  );

  // 스크롤 버튼 핸들러
  const scrollProblemList = useCallback((direction: 'up' | 'down') => {
    const container = problemListContainerRef.current;
    if (!container || questions.length === 0) return;

    const firstChild = container.firstElementChild as HTMLElement | null;
    if (!firstChild) return;
    
    const itemHeight = firstChild.getBoundingClientRect().height;
    if (itemHeight === 0) return;
    
    const scrollAmount = itemHeight * 5; // 5개씩 스크롤

    if (direction === 'up') {
      container.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  }, [questions.length]);

  // 스크롤 위치에 따른 범위 업데이트
  useEffect(() => {
    // questions가 없으면 실행하지 않음
    if (questions.length === 0) return;
    
    let cleanup: (() => void) | undefined;

    const setupScrollListener = () => {
      const container = problemListContainerRef.current;
      if (!container) {
        // container가 아직 없으면 다시 시도
        const retryTimeout = setTimeout(setupScrollListener, 50);
        cleanup = () => clearTimeout(retryTimeout);
        return;
      }

      const handleScroll = () => {
        const firstChild = container.firstElementChild as HTMLElement | null;
        if (!firstChild) return;
        
        const itemHeight = firstChild.getBoundingClientRect().height;
        if (itemHeight === 0) return;

        const scrollTop = container.scrollTop;
        const startIndex = Math.floor(scrollTop / itemHeight);
        const visibleCount = Math.ceil(container.clientHeight / itemHeight);
        
        setVisibleRange({
          start: Math.max(1, startIndex + 1),
          end: Math.min(startIndex + visibleCount, questions.length)
        });
      };

      container.addEventListener('scroll', handleScroll);
      handleScroll(); // 초기 상태 설정

      cleanup = () => {
        container.removeEventListener('scroll', handleScroll);
      };
    };

    setupScrollListener();

    return () => {
      if (cleanup) cleanup();
    };
  }, [questions.length]);

  const canScrollUp = visibleRange.start > 1;
  const canScrollDown = questions.length > 0 && visibleRange.end < questions.length;

  return (
    <div className="space-y-8">
      <div className="sticky top-8 z-10 space-y-4">
        <Card className="bg-transparent shadow-none backdrop-blur-sm">
          <TimerDisplay
            examName={examName}
            isUnlimited={isUnlimitedTime}
            timeLeft={timer.timeLeft}
            totalElapsed={timer.elapsedTime}
            currentProblem={timer.currentProblemTime}
            overtime={timer.overtime}
            isExamActive={isExamActive}
            isPaused={timer.isPaused}
            timeUp={timer.timeUp}
            onTogglePause={timer.togglePause}
            onResetTime={timer.recordLap}
            onFinish={onFinishExam}
            startQuestion={startQuestionStr}
            endQuestion={endQuestionStr}
            totalMinutes={totalMinutesStr}
            isCompact={isScrolled}
          />
        </Card>

        {focusedQuestionObj && (
          <Card className="bg-background/90 backdrop-blur-sm shadow-sm">
            <DynamicMarkingWindow
              key={`focused-${focusedQuestionObj.number}`}
              isExamActive={isExamActive}
              question={focusedQuestionObj}
              batchSelected={batchSelectedQuestions.has(focusedQuestionObj.number)}
              onLap={onLap}
              subjectiveInput={subjectiveInputs[focusedQuestionObj.number] ?? ''}
              onSubjectiveInputChange={(value) => onSubjectiveInputChange(focusedQuestionObj.number, value)}
            />
          </Card>
        )}
      </div>

      {questions.length > 0 && (
        <QuickNav
          questionNumbers={questions.map(q => q.number)}
          questions={questionMap}
          onJumpTo={handleJumpToQuestion}
          focusedQuestionNumber={focusedQuestionNumber}
        />
      )}

      <Card className="space-y-4">
        <ControlToolbar
          isExamActive={isExamActive}
          batchMode={batchMode}
          onBatchModeChange={onBatchModeChange}
          onBatchRecord={onBatchRecord}
          isBatchRecordDisabled={!batchMode || batchSelectedQuestions.size === 0}
          isMarkingMode={isMarkingMode}
          onMarkingModeChange={onMarkingModeChange}
        />

        <div className="border-t border-border pt-4">
          {questions.length > 0 ? (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold">전체 문제 목록</h3>
                <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => scrollProblemList('up')}
                  disabled={!canScrollUp}
                  className="h-8 w-8"
                  title="위로 5문제"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </Button>
                <span className="text-sm text-muted-foreground px-2 min-w-[80px] text-center">
                  {questions.length > 0 ? `${visibleRange.start}-${visibleRange.end} / ${questions.length}` : '0 / 0'}
                </span>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() => scrollProblemList('down')}
                  disabled={!canScrollDown}
                  className="h-8 w-8"
                  title="아래로 5문제"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Button>
              </div>
            </div>
            <ProblemList
              ref={problemListContainerRef}
              isExamActive={isExamActive}
              questionNumbers={questions.map(q => q.number)}
              questions={questionMap}
              batchSelectedQuestions={batchSelectedQuestions}
              subjectiveInputs={subjectiveInputs}
              onLap={onLap}
              onSubjectiveInputChange={onSubjectiveInputChange}
              onQuestionFocus={handleJumpToQuestion}
              setProblemRef={setProblemRef}
            />
          </div>
          ) : (
            <div className="text-center text-muted-foreground py-8">
              문제를 불러오는 중...
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};