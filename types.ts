
export enum LapType {
  SOLVE = 'SOLVE',
  ANSWER = 'ANSWER',
  CUMULATIVE = 'CUMULATIVE',
  BATCH_SOLVE = 'BATCH_SOLVE',
}

export type Question = {
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

export type SolveEvent = {
  timestamp: number;
  duration: number;
  answer?: string;
};

declare global {
  interface Window {
    clarity?: (action: string, key: string, value: string) => void;
  }
}