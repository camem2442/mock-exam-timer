import { useState, useCallback } from 'react';
import { type Question, type SolveEvent } from '../types';
import { type useTimer } from './useTimer';

type TimerHookReturn = ReturnType<typeof useTimer>;

export const useExamSession = (timer: TimerHookReturn, isExamActive: boolean) => {
  const [questions, setQuestions] = useState<Record<number, Question>>({});
  const [questionNumbers, setQuestionNumbers] = useState<number[]>([]);
  const [focusedQuestionNumber, setFocusedQuestionNumber] = useState<number | null>(null);
  const [subjectiveInputs, setSubjectiveInputs] = useState<Record<number, string>>({});
  const [lapCounter, setLapCounter] = useState(0);
  const [batchMode, setBatchMode] = useState(false);
  const [batchSelectedQuestions, setBatchSelectedQuestions] = useState<Set<number>>(new Set());

  const findNextQuestion = useCallback((currentQNum: number): number | null => {
    const currentIndex = questionNumbers.indexOf(currentQNum);
    if (currentIndex > -1 && currentIndex < questionNumbers.length - 1) {
        return questionNumbers[currentIndex + 1];
    }
    const firstUnanswered = questionNumbers.find(qNum => questions[qNum]?.attempts === 0 && qNum > currentQNum);
    if(firstUnanswered) return firstUnanswered;
    
    const firstUnansweredFromStart = questionNumbers.find(qNum => questions[qNum]?.attempts === 0);
    return firstUnansweredFromStart ?? null;
  }, [questions, questionNumbers]);

  const handleLap = useCallback((questionNumber: number, answer?: string) => {
    if (!isExamActive) return;
    
    setFocusedQuestionNumber(questionNumber);

    if (batchMode) {
        setBatchSelectedQuestions(prev => {
            const newSet = new Set(prev);
            if (newSet.has(questionNumber)) {
                newSet.delete(questionNumber);
            } else {
                newSet.add(questionNumber);
            }
            return newSet;
        });
        if (answer !== undefined) {
             setQuestions(prev => ({
                ...prev,
                [questionNumber]: { ...prev[questionNumber], answer: answer === '' ? null : answer }
            }));
        }
        return;
    }
    
    const lapTimestamp = timer.elapsedTime;
    const timeToAdd = timer.currentProblemTime;
    const lapStartTime = lapTimestamp - timeToAdd;
    
    setQuestions(prevQuestions => {
        const questionToUpdate = prevQuestions[questionNumber];
        if (!questionToUpdate) return prevQuestions;

        const newEvent: SolveEvent = { timestamp: lapTimestamp, duration: timeToAdd, answer };

        return {
            ...prevQuestions,
            [questionNumber]: {
                ...questionToUpdate,
                solveTime: questionToUpdate.solveTime + timeToAdd,
                attempts: questionToUpdate.attempts + 1,
                answer: answer !== undefined ? (answer === '' ? null : answer) : questionToUpdate.answer,
                solveEvents: [...questionToUpdate.solveEvents, newEvent],
                startTime: lapStartTime
            }
        };
    });
    
    setLapCounter(c => c + 1);
    
    const nextQuestionNumber = findNextQuestion(questionNumber);
    if (nextQuestionNumber !== null) {
        setFocusedQuestionNumber(nextQuestionNumber);
    }
    timer.recordLap();

  }, [isExamActive, batchMode, findNextQuestion, timer]);

  const handleBatchRecord = useCallback(() => {
    if (!isExamActive || batchSelectedQuestions.size === 0) return;

    const timeSinceLastLap = timer.currentProblemTime;
    const timePerQuestion = timeSinceLastLap / batchSelectedQuestions.size;
    const lapTimestamp = timer.elapsedTime;
    const lapStartTime = lapTimestamp - timeSinceLastLap;
    
    setQuestions(prev => {
        const newQuestions = { ...prev };
        const newEvent: Omit<SolveEvent, 'answer'> = { timestamp: lapTimestamp, duration: timePerQuestion };
        batchSelectedQuestions.forEach(qNum => {
            const existingQ = newQuestions[qNum];
            if (existingQ) {
                newQuestions[qNum] = {
                    ...existingQ,
                    solveTime: existingQ.solveTime + timePerQuestion,
                    attempts: existingQ.attempts + 1,
                    solveEvents: [...existingQ.solveEvents, { ...newEvent, answer: existingQ.answer ?? undefined }],
                    startTime: lapStartTime
                };
            }
        });
        return newQuestions;
    });

    setBatchSelectedQuestions(new Set());
    setBatchMode(false);
    setLapCounter(c => c + 1);
    timer.recordLap();
  }, [isExamActive, batchSelectedQuestions, timer]);

  const reset = useCallback(() => {
    setQuestions({});
    setQuestionNumbers([]);
    setFocusedQuestionNumber(null);
    setSubjectiveInputs({});
    setLapCounter(0);
    setBatchMode(false);
    setBatchSelectedQuestions(new Set());
  }, []);
  
  return {
    questions,
    setQuestions,
    questionNumbers,
    setQuestionNumbers,
    focusedQuestionNumber,
    setFocusedQuestionNumber,
    subjectiveInputs,
    setSubjectiveInputs,
    lapCounter,
    setLapCounter,
    batchMode,
    setBatchMode,
    batchSelectedQuestions,
    setBatchSelectedQuestions,
    handleLap,
    handleBatchRecord,
    reset,
  };
}; 