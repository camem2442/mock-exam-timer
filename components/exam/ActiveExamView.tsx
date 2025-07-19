import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { Card } from '../ui/Card';
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
  const problemRefs = useRef<Record<number, HTMLDivElement>>({});
  const [isScrolled, setIsScrolled] = useState(false);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      setIsScrolled(scrollY > 50); // 50px 이상 스크롤하면 compact 모드
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 초기 상태 확인

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const focusedQuestionObj = focusedQuestionNumber ? questions.find(q => q.number === focusedQuestionNumber) : null;
  const questionMap = React.useMemo(() => Object.fromEntries(questions.map(q => [q.number, q])), [questions]);

  return (
    <div className="lg:col-span-3 space-y-8">
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
              key={`focused-${focusedQuestionObj.number}`