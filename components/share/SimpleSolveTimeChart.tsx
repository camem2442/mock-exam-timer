import React from 'react';
import * as Recharts from 'recharts';
import { type Question } from '../../types';
import { useChartData } from '../../hooks/useChartData';
import { formatMinSec } from '../../utils/formatters';
import { useThemeColors } from '../../hooks/useThemeColors';

interface SimpleSolveTimeChartProps {
    questions: Question[];
}

const SimpleSolveTimeChart: React.FC<SimpleSolveTimeChartProps> = ({ questions }) => {
    const { hasData, questionNumberData } = useChartData(questions);
    const colors = useThemeColors();

    if (!hasData) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-muted-foreground bg-muted rounded-lg">
                풀이 기록 없음
            </div>
        );
    }

    return (
        <div className="w-full h-64">
            <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.BarChart 
                    data={questionNumberData}
                    margin={{ top: 5, right: 5, left: -25, bottom: 5 }}
                >
                    <Recharts.CartesianGrid strokeDasharray="3 3" stroke={colors.chart.grid} />
                    <Recharts.XAxis dataKey="name" tick={{ fontSize: 10, fill: colors.chart.axis }} />
                    <Recharts.YAxis tickFormatter={formatMinSec} tick={{ fontSize: 10, fill: colors.chart.axis }} />
                    <Recharts.Bar dataKey="solveTime" fill={colors.chart.bar} isAnimationActive={false} />
                </Recharts.BarChart>
            </Recharts.ResponsiveContainer>
        </div>
    );
}

export default SimpleSolveTimeChart; 