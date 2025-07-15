
import { useMemo } from 'react';
import { type Question, type SolveEvent } from '../types';

export interface QuestionNumberChartData {
    name: string;
    solveTime: number;
}

export interface SolveOrderChartData {
    name: string;
    lapTime: number;
    cumulativeTime: number;
}

export type SolveHistoryEvent = { questionNumber: number } & SolveEvent;

export interface TimeManagementInsightsData {
    longest: Question[];
}

/**
 * A custom hook to process and memoize analytics data from raw question objects.
 * This centralizes the data transformation logic for charts and tables.
 */
export const useChartData = (questions: Question[] | Record<number, Question>) => {
    
    // This check makes the hook robust. It now accepts an array or the raw questions object.
    const questionsArray = Array.isArray(questions) ? questions : Object.values(questions);

    const hasData = questionsArray.some(q => q.attempts > 0);
    
    const solvedQuestions = questionsArray.filter(q => q.attempts > 0);

    const solveHistory: SolveHistoryEvent[] = (() => {
        if (!hasData) return [];
        const history: SolveHistoryEvent[] = [];
        // Use all questions to build history, as solveEvents is the source of truth
        questionsArray.forEach(q => {
            q.solveEvents.forEach(event => {
                history.push({ questionNumber: q.number, ...event });
            });
        });
        history.sort((a, b) => a.timestamp - b.timestamp);
        return history;
    })();

    const questionNumberData: QuestionNumberChartData[] = (() => {
        if (!hasData) return [];
        return [...solvedQuestions]
            .sort((a, b) => a.number - b.number)
            .map(q => ({
                name: `${q.number}번`,
                solveTime: Math.round(q.solveTime),
            }));
    })();

    const solveOrderData: SolveOrderChartData[] = (() => {
        if (!hasData) return [];
        return solveHistory.map((event, index) => ({
            name: `${index + 1}번째 (${event.questionNumber}번)`,
            lapTime: Math.round(event.duration),
            cumulativeTime: Math.round(event.timestamp),
        }));
    })();
    
    const timeManagementInsights: TimeManagementInsightsData = (() => {
        if (!hasData) return { longest: [] };
        const sortedByTime = [...solvedQuestions].sort((a, b) => b.solveTime - a.solveTime);
        const longest = sortedByTime.slice(0, 5);
        return { longest };
    })();
    
    return { hasData, questionNumberData, solveOrderData, solveHistory, timeManagementInsights };
};
