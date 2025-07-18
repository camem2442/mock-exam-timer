import { useEffect } from 'react';
import { type Question } from '../types';
import { type useExamSetup } from './useExamSetup';
import { type ReviewState, type ReviewSetters } from './useReview';
import { type useExamSession } from './useExamSession';
import { type useTimer } from './useTimer';
import { type useGrading } from './useGrading';

const EXAM_STATE_STORAGE_KEY = 'examState';

export interface PersistenceState {
  questions: Record<number, Question>;
  questionNumbers: number[];
  subjectiveInputs: Record<number, string>;
  
  totalElapsedTime: number;
  overallTimeLeft: number;
  currentProblemTime: number;
  lapCounter: number;
  timeUp: boolean;
  isPaused: boolean;

  focusedQuestionNumber: number | null;
  batchMode: boolean;
  batchSelectedQuestions: Set<number>;

  isExamActive: boolean;
  showReview: boolean;
  
  // For grading
  gradingAnswers: Record<number, string>;
  gradingSubjective: Set<number>;
}

type ExamSetupReturn = ReturnType<typeof useExamSetup>;
type ExamSessionReturn = ReturnType<typeof useExamSession>;
type TimerHookReturn = ReturnType<typeof useTimer>;
type GradingHookReturn = ReturnType<typeof useGrading>;


// Combine all states and setters needed for persistence
type PersistenceProps = {
  examSetup: ExamSetupReturn;
  examSession: ExamSessionReturn;
  timerState: Pick<TimerHookReturn, 'elapsedTime' | 'timeLeft' | 'currentProblemTime' | 'isPaused' | 'timeUp'>;
  examScreenState: {
    isExamActive: boolean;
    showReview: boolean;
    focusedQuestionNumber: number | null;
  };
  setState: (state: Partial<PersistenceState>) => void;
  review: {
      submittedCorrectAnswers: Record<number, string | number>,
      setSubmittedCorrectAnswers: React.Dispatch<React.SetStateAction<Record<number, string | number>>>,
      grading: GradingHookReturn
  }
};


export const useExamPersistence = (props: PersistenceProps) => {

  const { examSetup, examSession, timerState, examScreenState, setState, review } = props;
  const { questions, questionNumbers, subjectiveInputs, lapCounter, batchMode, batchSelectedQuestions } = examSession;

  // Effect for saving state to localStorage
  useEffect(() => {
    if (!examScreenState.isExamActive && !examScreenState.showReview) {
      return; // Do not save if the exam is not active and not in review.
    }

    const stateToSave = {
      // from examSession
      questions,
      questionNumbers,
      subjectiveInputs,
      lapCounter,
      batchMode,
      batchSelectedQuestions: Array.from(batchSelectedQuestions),
      
      // from examSetup
      examName: examSetup.examName,
      startQuestionStr: examSetup.startQuestionStr,
      endQuestionStr: examSetup.endQuestionStr,
      totalMinutesStr: examSetup.totalMinutesStr,
      isUnlimitedTime: examSetup.isUnlimitedTime,

      // from timerState
      totalElapsedTime: timerState.elapsedTime,
      overallTimeLeft: timerState.timeLeft,
      currentProblemTime: timerState.currentProblemTime,
      isPaused: timerState.isPaused,
      timeUp: timerState.timeUp,

      // from examScreenState
      ...examScreenState,

      // from review prop
      submittedCorrectAnswers: review.submittedCorrectAnswers,
      gradingAnswers: review.grading.answers,
      gradingSubjective: Array.from(review.grading.subjectiveProblems),
    };
    localStorage.setItem(EXAM_STATE_STORAGE_KEY, JSON.stringify(stateToSave));
  }, [examSession, examSetup, timerState, examScreenState, review]);

  // Effect for loading state from localStorage on initial mount
  useEffect(() => {
    const savedStateJSON = localStorage.getItem(EXAM_STATE_STORAGE_KEY);
    if (savedStateJSON) {
      if (window.confirm('이전 시험에 이어서 진행하시겠습니까?')) {
        const savedState = JSON.parse(savedStateJSON);

        setState({
          questions: savedState.questions,
          questionNumbers: savedState.questionNumbers,
          subjectiveInputs: savedState.subjectiveInputs,
          totalElapsedTime: savedState.totalElapsedTime,
          overallTimeLeft: savedState.overallTimeLeft,
          currentProblemTime: savedState.currentProblemTime,
          lapCounter: savedState.lapCounter,
          timeUp: savedState.timeUp,
          isPaused: true, // Always restore in a paused state
          focusedQuestionNumber: savedState.focusedQuestionNumber,
          batchMode: savedState.batchMode,
          batchSelectedQuestions: new Set(savedState.batchSelectedQuestions),
          isExamActive: savedState.isExamActive,
          showReview: savedState.showReview,
          gradingAnswers: savedState.gradingAnswers,
          gradingSubjective: new Set(savedState.gradingSubjective),
        });

        // Restore setup and review state
        examSetup.setExamName(savedState.examName || '');
        examSetup.setStartQuestionStr(savedState.startQuestionStr);
        examSetup.setEndQuestionStr(savedState.endQuestionStr);
        examSetup.setTotalMinutesStr(savedState.totalMinutesStr);
        examSetup.setIsUnlimitedTime(savedState.isUnlimitedTime);
        review.setSubmittedCorrectAnswers(savedState.submittedCorrectAnswers || {});
      } else {
        localStorage.removeItem(EXAM_STATE_STORAGE_KEY);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount
}; 