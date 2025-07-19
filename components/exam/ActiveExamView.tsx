import React, { useRef, useCallback, type RefObject } from 'react';
import { Card } from '../ui/Card';
import TimerDisplay from './TimerDisplay';
import QuickNav from './QuickNav';
import DynamicMarkingWindow from './DynamicMarkingWindow';
import ProblemList from './ProblemList';
import ProblemListHeader from './ProblemListHeader';
import FloatingControls from './FloatingControls';
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

  const setProblemRef = (qNum: number, el: HTMLDivElement | null) => {
    if(problemRefs.current) {
      problemRefs.current[qNum] = el;
    }
  };

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

  // 스크롤 네비게이션 로직
  const handleScrollUp = useCallback(() => {
    if (!focusedQuestionNumber) return;
    const currentIndex = questions.findIndex(q => q.number === focusedQuestionNumber);
    if (currentIndex > 0) {
      const prevQuestion = questions[currentIndex - 1];
      handleJumpToQuestion(prevQuestion.number);
    }
  }, [focusedQuestionNumber, questions, handleJumpToQuestion]);

  const handleScrollDown = useCallback(() => {
    if (!focusedQuestionNumber) return;
    const currentIndex = questions.findIndex(q => q.number === focusedQuestionNumber);
    if (currentIndex < questions.length - 1) {
      const nextQuestion = questions[currentIndex + 1];
      handleJumpToQuestion(nextQuestion.number);
    }
  }, [focusedQuestionNumber, questions, handleJumpToQuestion]);

  // 현재 문제 인덱스 계산
  const currentQuestionIndex = focusedQuestionNumber 
    ? questions.findIndex(q => q.number === focusedQuestionNumber) + 1 
    : 1;

  const focusedQuestionObj = focusedQuestionNumber ? questions.find(q => q.number === focusedQuestionNumber) : null;
  const questionMap = React.useMemo(() => Object.fromEntries(questions.map(q => [q.number, q])), [questions]);

  return (
    <div className="lg:col-span-3 space-y-8">
      <Card className="sticky top-8 z-10 bg-transparent shadow-none backdrop-blur-sm">
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
        />
      </Card>

      {focusedQuestionObj && (
        <Card>
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

      <QuickNav
        questionNumbers={questions.map(q => q.number)}
        questions={questionMap}
        onJumpTo={handleJumpToQuestion}
        focusedQuestionNumber={focusedQuestionNumber}
      />

      <Card className="space-y-4">
        <ProblemListHeader
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          onScrollUp={handleScrollUp}
          onScrollDown={handleScrollDown}
        />
        
        <div className="pt-4">
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
      </Card>

      <FloatingControls
        isExamActive={isExamActive}
        batchMode={batchMode}
        onBatchModeChange={onBatchModeChange}
        onBatchRecord={onBatchRecord}
        isBatchRecordDisabled={!batchMode || batchSelectedQuestions.size === 0}
        isMarkingMode={isMarkingMode}
        onMarkingModeChange={onMarkingModeChange}
      />
    </div>
  );
}; 