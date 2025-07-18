
export interface SolveEvent {
  timestamp: number; // totalElapsedTime when this lap was recorded
  duration: number; // time spent on this lap (currentProblemTime)
  answer?: string; // The answer submitted with this lap
}

export enum LapType {
  SOLVE = 'SOLVE',
  ANSWER = 'ANSWER',
  CUMULATIVE = 'CUMULATIVE',
  BATCH_SOLVE = 'BATCH_SOLVE',
}

export interface Question {
  number: number;
  solveTime: number; // in seconds
  answer: string | null;
  attempts: number;
  solveEvents: SolveEvent[];
  startTime?: number; // totalElapsedTime when the latest lap for this question began
  endTime?: number; // totalElapsedTime when the question was finally solved
  isCorrect?: boolean;
}

export interface Lap {
  id: number;
  type: LapType;
  questionNumber: number;
  time?: number; // for SOLVE, BATCH_SOLVE, CUMULATIVE
  answer?: string; // for ANSWER
}

export interface ExamConfig {
  startQuestion: number;
  endQuestion: number;
  totalMinutes: number;
}

export interface SolvingRecord {
  problemNumber: number;
  answer: string;
  isBookmarked: boolean;
  solveTime: number; // in seconds
  isCorrect?: boolean;
}