
import React from 'react';
import { type Question } from '../../types';
import { formatTime } from '../../utils/formatters';
import { Card } from '../ui/Card';
import { useChartData } from '../../hooks/useChartData';

interface TimeManagementInsightsProps {
    questions: Question[];
}

const TimeManagementInsights: React.FC<TimeManagementInsightsProps> = ({ questions }) => {
    const { timeManagementInsights } = useChartData(questions);

    return (
        <Card>
            <h3 className="text-xl font-bold mb-4 text-slate-800 dark:text-slate-200">풀이 시간 분석</h3>
            <div className="space-y-4 text-sm">
                <div>
                    <h4 className="font-semibold text-primary-600 dark:text-primary-400">풀이 시간이 가장 길었던 문제 TOP 5</h4>
                    <ul className="list-disc list-inside text-slate-600 dark:text-slate-400">
                        {timeManagementInsights.longest.length > 0 ? timeManagementInsights.longest.map(q => <li key={q.number}>{q.number}번 ({formatTime(q.solveTime)})</li>) : <li>없음</li>}
                    </ul>
                </div>
            </div>
        </Card>
    );
};

export default TimeManagementInsights;
