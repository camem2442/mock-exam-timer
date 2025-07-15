
import React from 'react';
import { Button } from '../ui/Button';
import { formatTime } from '../../utils/formatters';

interface TimerDisplayProps {
    isUnlimited: boolean;
    timeLeft: number;
    totalElapsed: number;
    currentProblem: number;
    isExamActive: boolean;
    isPaused: boolean;
    timeUp: boolean;
    onTogglePause: () => void;
    onResetTime: () => void;
    onFinish: () => void;
    startQuestion: string;
    endQuestion: string;
    totalMinutes: string;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ isUnlimited, timeLeft, totalElapsed, currentProblem, isExamActive, isPaused, timeUp, onTogglePause, onResetTime, onFinish, startQuestion, endQuestion, totalMinutes }) => {
    const displayTime = timeUp ? Math.abs(timeLeft) : timeLeft;

    return (
        <div className="text-center space-y-4">
            <div className={`transition-all duration-300 ${isPaused ? 'blur-sm opacity-50' : ''}`}>
                <div>
                    <p className="text-lg text-slate-400">{timeUp ? '초과 시간' : '전체 남은 시간'}</p>
                    <p className={`text-4xl sm:text-5xl lg:text-6xl font-bold tabular-nums ${timeUp ? 'text-red-500' : 'text-primary-400'}`}>
                        {isUnlimited ? '∞' : formatTime(displayTime)}
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-sm text-slate-400">총 문제 풀이 시간</p>
                        <p className="text-2xl sm:text-3xl font-semibold tabular-nums">{formatTime(totalElapsed)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-slate-400">현재 문제 풀이 시간</p>
                        <p className="text-2xl sm:text-3xl font-semibold tabular-nums">{formatTime(currentProblem)}</p>
                    </div>
                </div>
            </div>
            <div className="pt-4 border-t border-slate-700 space-y-4">
                <div className={`text-sm text-slate-400 flex justify-center items-center gap-6 transition-opacity duration-300 ${isPaused ? 'opacity-50' : ''}`}>
                    <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 16c1.669 0 3.218-.51 4.5-1.385A7.962 7.962 0 0114.5 16c1.255 0 2.443-.29 3.5-.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                        </svg>
                        <span className="font-medium text-slate-300">문제: {startQuestion}번 ~ {endQuestion}번</span>
                    </span>
                    <span className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 10.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="font-medium text-slate-300">시간: {isUnlimited ? '무제한' : `${totalMinutes}분`}</span>
                    </span>
                </div>

                <div className="flex items-center justify-center gap-4">
                    <Button onClick={onTogglePause} variant="secondary" disabled={!isExamActive}>
                        {isPaused ? '이어하기' : '일시정지'}
                    </Button>
                    <Button onClick={onResetTime} variant="secondary" disabled={!isExamActive || isPaused}>현재 문제 리셋</Button>
                    <Button onClick={onFinish} variant="danger" disabled={!isExamActive || isPaused}>시험 종료</Button>
                </div>
            </div>
        </div>
    );
};

export default TimerDisplay;