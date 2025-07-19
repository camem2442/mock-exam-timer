
import React, { useState, useMemo } from 'react';
import { type Question } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Tooltip } from '../ui/Tooltip';
import { formatMinSec } from '../../utils/formatters';
import { useChartData } from '../../hooks/useChartData';
import { Card } from '../ui/Card';

interface TimeManagementInsightsProps {
    questions: Question[];
}

const TimeManagementInsights: React.FC<TimeManagementInsightsProps> = ({ questions }) => {
    const [insightsVisibility, setInsightsVisibility] = useState({
        efficiency: true,
        diagnostics: true,
        pacing: true,
    });

    const handleToggleInsight = (insight: keyof typeof insightsVisibility) => {
        setInsightsVisibility(prev => ({ ...prev, [insight]: !prev[insight] }));
    };

    const { solveHistory } = useChartData(questions);

    const analysisData = useMemo(() => {
        const correctQs = questions.filter(q => q.isCorrect === true);
        const incorrectQs = questions.filter(q => q.isCorrect === false);
        const totalSolveTime = questions.reduce((sum, q) => sum + q.solveTime, 0);

        const avgCorrectTime = correctQs.length > 0 ? correctQs.reduce((sum, q) => sum + q.solveTime, 0) / correctQs.length : 0;
        const avgIncorrectTime = incorrectQs.length > 0 ? incorrectQs.reduce((sum, q) => sum + q.solveTime, 0) / incorrectQs.length : 0;

        const correctAnswersPerMinute = totalSolveTime > 0 ? (correctQs.length / (totalSolveTime / 60)) : 0;

        const timeSinks = [...incorrectQs].sort((a, b) => b.solveTime - a.solveTime).slice(0, 3);
        const hastyMistakes = [...incorrectQs].sort((a, b) => a.solveTime - b.solveTime).slice(0, 3);
        const inefficientCorrects = [...correctQs].sort((a, b) => b.solveTime - a.solveTime).slice(0, 3);
        
        const halfPoint = solveHistory.length / 2;
        const firstHalf = solveHistory.slice(0, halfPoint);
        const secondHalf = solveHistory.slice(halfPoint);

        const firstHalfAvgTime = firstHalf.length > 0 ? firstHalf.reduce((sum, e) => sum + e.duration, 0) / firstHalf.length : 0;
        const secondHalfAvgTime = secondHalf.length > 0 ? secondHalf.reduce((sum, e) => sum + e.duration, 0) / secondHalf.length : 0;

        const firstHalfCorrectCount = firstHalf.filter(e => questions.find(q => q.number === e.questionNumber)?.isCorrect === true).length;
        const secondHalfCorrectCount = secondHalf.filter(e => questions.find(q => q.number === e.questionNumber)?.isCorrect === true).length;
        
        const firstHalfAccuracy = firstHalf.length > 0 ? (firstHalfCorrectCount / firstHalf.length) * 100 : 0;
        const secondHalfAccuracy = secondHalf.length > 0 ? (secondHalfCorrectCount / secondHalf.length) * 100 : 0;

        return {
            avgCorrectTime,
            avgIncorrectTime,
            correctAnswersPerMinute,
            timeSinks,
            hastyMistakes,
            inefficientCorrects,
            pacing: {
                firstHalf: { avgTime: firstHalfAvgTime, accuracy: firstHalfAccuracy },
                secondHalf: { avgTime: secondHalfAvgTime, accuracy: secondHalfAccuracy },
            }
        };
    }, [questions, solveHistory]);

    if (questions.every(q => q.solveTime === 0)) {
        return (
            <Card className="p-6">
                <h3 className="text-xl font-bold mb-4 text-foreground">풀이 시간 분석 리포트</h3>
                <p className="text-muted-foreground">풀이 기록이 없어 분석을 제공할 수 없습니다.</p>
            </Card>
        );
    }
    
    const renderQuestionList = (qs: Question[]) => (
        <ul className="list-disc list-inside text-muted-foreground text-sm space-y-1 mt-2 pl-8">
            {qs.length > 0 ? qs.map(q => (
                <li key={q.number}>
                    <span className="font-semibold text-foreground">{q.number}번</span> ({formatMinSec(q.solveTime)})
                </li>
            )) : <li>해당 없음</li>}
        </ul>
    );

    return (
        <Card className="p-6">
            <h3 className="text-xl font-bold mb-6 text-foreground">풀이 시간 분석 리포트</h3>
            <div className="space-y-6">
                {/* Problem Diagnostics */}
                <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-brand">문제점 진단</h4>
                            <Tooltip text="시간을 많이 소모했거나 실수했을 가능성이 높은 문항을 분석합니다.">
                                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </Tooltip>
                        </div>
                        <ToggleSwitch enabled={insightsVisibility.diagnostics} onChange={() => handleToggleInsight('diagnostics')} />
                    </div>
                    {insightsVisibility.diagnostics && (
                        <div className="pl-4 space-y-4">
                            <div>
                                <p className="text-sm font-medium flex items-center gap-1.5">
                                    시간 함정 문항 (Top 3)
                                    <Tooltip text="가장 많은 시간을 투자했지만 틀린 문제입니다. 시간 관리에 실패했을 가능성이 높습니다.">
                                        <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </Tooltip>
                                </p>
                                {renderQuestionList(analysisData.timeSinks)}
                            </div>
                             <div>
                                <p className="text-sm font-medium flex items-center gap-1.5">
                                    성급한 오답 문항 (Top 3)
                                    <Tooltip text="가장 적은 시간을 투자했지만 틀린 문제입니다. 꼼꼼하게 풀었다면 맞았을 수 있습니다.">
                                        <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </Tooltip>
                                </p>
                                {renderQuestionList(analysisData.hastyMistakes)}
                            </div>
                             <div>
                                <p className="text-sm font-medium flex items-center gap-1.5">
                                    비효율적 정답 문항 (Top 3)
                                    <Tooltip text="많은 시간을 투자하여 맞힌 문제입니다. 다음에는 풀이 시간을 줄일 방법을 고민해 보세요.">
                                        <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    </Tooltip>
                                </p>
                                {renderQuestionList(analysisData.inefficientCorrects)}
                            </div>
                        </div>
                    )}
                </div>

                {/* Efficiency Analysis */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-brand">효율성 분석</h4>
                            <Tooltip text="시간을 얼마나 효율적으로 사용했는지 분석합니다.">
                                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </Tooltip>
                        </div>
                        <ToggleSwitch enabled={insightsVisibility.efficiency} onChange={() => handleToggleInsight('efficiency')} />
                    </div>
                    {insightsVisibility.efficiency && (
                        <div className="pl-4 space-y-4">
                            <div className="text-sm">
                                <p className="font-medium">정답/오답별 평균 풀이 시간</p>
                                <div className="pl-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    <p><strong>정답 문항:</strong> <span className="text-success font-semibold">{formatMinSec(analysisData.avgCorrectTime)}</span></p>
                                    <p><strong>오답 문항:</strong> <span className="text-destructive font-semibold">{formatMinSec(analysisData.avgIncorrectTime)}</span></p>
                                </div>
                            </div>
                            <div className="text-sm">
                                <p className="font-medium">풀이 효율성 (분당 정답 수)</p>
                                <div className="pl-4 pt-2">
                                    <p><strong>분당 정답:</strong> <span className="text-primary font-semibold">{analysisData.correctAnswersPerMinute.toFixed(1)}개</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Pacing Analysis */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <h4 className="font-bold text-lg text-brand">페이스 분석</h4>
                            <Tooltip text="시험 시간 흐름에 따른 집중력과 속도 변화를 분석합니다.">
                               <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </Tooltip>
                        </div>
                        <ToggleSwitch enabled={insightsVisibility.pacing} onChange={() => handleToggleInsight('pacing')} />
                    </div>
                    {insightsVisibility.pacing && (
                        <div className="pl-4">
                            <p className="text-sm font-medium">전반부/후반부 페이스 비교</p>
                            <div className="pl-4 pt-2 text-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <p className="font-semibold">전반부</p>
                                    <p>평균 시간: <span className="font-medium text-foreground">{formatMinSec(analysisData.pacing.firstHalf.avgTime)}</span></p>
                                    <p>정답률: <span className="font-medium text-foreground">{analysisData.pacing.firstHalf.accuracy.toFixed(1)}%</span></p>
                                </div>
                                <div>
                                    <p className="font-semibold">후반부</p>
                                    <p>평균 시간: <span className="font-medium text-foreground">{formatMinSec(analysisData.pacing.secondHalf.avgTime)}</span></p>
                                    <p>정답률: <span className="font-medium text-foreground">{analysisData.pacing.secondHalf.accuracy.toFixed(1)}%</span></p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default TimeManagementInsights;
