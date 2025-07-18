import React, { useRef, useCallback } from 'react';
import { Card } from '../ui/Card';
import TimerDisplay from './TimerDisplay';
import QuickNav from './QuickNav';
import DynamicMarkingWindow from './DynamicMarkingWindow';
import ControlToolbar from './ControlToolbar';
import ProblemList from './ProblemList';
import { type useTimer } from '../../hooks/useTimer';
import { type useExamSession } from '../../hooks/useExamSession';

type TimerHookReturn = ReturnType<typeof useTimer>;
type ExamSessionHookReturn = ReturnType<typeof useExamSession>;

interface ActiveExamViewProps {
  examName: string;
  isUnlimitedTime: boolean;
  startQuestionStr: string;
  endQuestionStr: string;
  totalMinutesStr: string;
  
  timer: TimerHookReturn;
  examSession: ExamSessionHookReturn;

  onFinishExam: () => void;
}

export const ActiveExamView: React.FC<ActiveExamViewProps> = ({
  examName,
  isUnlimitedTime,
  startQuestionStr,
  endQuestionStr,
  totalMinutesStr,
  timer,
  examSession,
  onFinishExam,
}) => {
  const { 
    questions, 
    questionNumbers, 
    subjectiveInputs, 
    batchMode, 
    batchSelectedQuestions,
    handleLap, 
    handleBatchRecord,
    setSubjectiveInputs,
    setBatchMode,
    setBatchSelectedQuestions,
    focusedQuestionNumber,
    setFocusedQuestionNumber,
  } = examSession;

  const problemRefs = useRef<Record<number, HTMLDivElement | null>>({});
  const problemListContainerRef = useRef<HTMLDivElement | null>(null);

  const setProblemRef = (qNum: number, el: HTMLDivElement | null) => {
    problemRefs.current[qNum] = el;
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
  }, [setFocusedQuestionNumber]);

  const focusedQuestion = focusedQuestionNumber ? questions[focusedQuestionNumber] : null;
  
  return (
    <div className="lg:col-span-3 space-y-8">
      <Card className="sticky top-8 z-10 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm">
        <TimerDisplay 
          examName={examName}
          isUnlimited={isUnlimitedTime}
          timeLeft={timer.timeLeft}
          totalElapsed={timer.elapsedTime}
          currentProblem={timer.currentProblemTime}
          overtime={timer.overtime}
          isExamActive={true} // This view is only shown when exam is active
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

      {focusedQuestion && (
        <Card>
          <DynamicMarkingWindow
            key={`focused-${focusedQuestion.number}`}
            isExamActive={true}
            question={focusedQuestion}
            batchSelected={batchSelectedQuestions.has(focusedQuestion.number)}
            onLap={handleLap}
            subjectiveInput={subjectiveInputs[focusedQuestion.number] ?? ''}
            onSubjectiveInputChange={(value) => setSubjectiveInputs(prev => ({...prev, [focusedQuestion.number]: value}))}
          />
        </Card>
      )}

      <QuickNav 
        questionNumbers={questionNumbers} 
        onJumpTo={handleJumpToQuestion}
        focusedQuestionNumber={focusedQuestionNumber}
      />

      <Card className="space-y-4">
        <ControlToolbar
          isExamActive={true}
          batchMode={batchMode}
          onBatchModeChange={(enabled) => {
              setBatchMode(enabled);
              if (!enabled) {
                  setBatchSelectedQuestions(new Set());
              }
          }}
          onBatchRecord={handleBatchRecord}
          isBatchRecordDisabled={!batchMode || batchSelectedQuestions.size === 0}
        />
        
        <div className="border-t border-slate-700 pt-4">
          <div>
            <h3 className="text-lg font-bold mb-3">전체 문제 목록</h3>
            <ProblemList
              ref={problemListContainerRef}
              isExamActive={true}
              questionNumbers={questionNumbers}
              questions={questions}
              batchSelectedQuestions={batchSelectedQuestions}
              subjectiveInputs={subjectiveInputs}
              onLap={handleLap}
              onSubjectiveInputChange={(qNum, val) => setSubjectiveInputs(prev => ({...prev, [qNum]: val}))}
              onQuestionFocus={handleJumpToQuestion}
              setProblemRef={setProblemRef}
            />
          </div>
        </div>
      </Card>
    </div>
  );
}; 