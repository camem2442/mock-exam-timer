import React from 'react';
import * as Recharts from 'recharts';
import { type Question } from '../../types';
import { useChartData } from '../../hooks/useChartData';
import { formatMinSec } from '../../utils/formatters';

interface SimpleSolveTimeChartProps {
    questions: Question[];
    yAxisFormatter?: (sec: number) => string;
    rightYAxisFormatter?: (sec: number) => string;
}

const SimpleSolveTimeChart: React.FC<SimpleSolveTimeChartProps> = ({ questions, yAxisFormatter = formatMinSec, rightYAxisFormatter = formatMinSec }) => {
    const { hasData, solveOrderData } = useChartData(questions);

    const tickColor = '#94a3b8'; // slate-400
    const gridColor = 'rgba(100, 116, 139, 0.2)'; // slate-500 with opacity

    if (!hasData) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-slate-400 bg-slate-800/50 rounded-lg">
                풀이 기록이 없습니다.
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-lg text-slate-50 shadow-lg">
                    <p className="font-bold text-base mb-2">{label}</p>
                    {payload.map((pld: any, index: number) => (
                        <div key={index} style={{ color: pld.color }}>
                            {pld.dataKey === 'lapTime' ? '구간별 시간' : '누적 시간'}: {formatMinSec(pld.value)}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="w-full h-64">
            <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.ComposedChart
                    data={solveOrderData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 10 }}
                >
                    <Recharts.CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <Recharts.XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: tickColor }} 
                        interval="preserveStartEnd"
                    />
                    <Recharts.YAxis 
                        yAxisId="left" 
                        tickFormatter={yAxisFormatter} 
                        tick={{ fontSize: 10, fill: tickColor }} 
                        label={{ 
                            value: '구간별 시간', 
                            angle: -90, 
                            position: 'insideLeft', 
                            fill: tickColor, 
                            style: {textAnchor: 'middle', fontSize: 12} 
                        }} 
                    />
                    <Recharts.YAxis 
                        yAxisId="right" 
                        orientation="right" 
                        tick={{ fontSize: 10, fill: tickColor }} 
                        label={{ 
                            value: '누적 시간', 
                            angle: 90, 
                            position: 'insideRight', 
                            fill: tickColor, 
                            style: {textAnchor: 'middle', fontSize: 12} 
                        }}
                        tickFormatter={rightYAxisFormatter}
                    />
                    <Recharts.Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100,116,139,0.1)'}} />
                    <Recharts.Bar 
                        yAxisId="left" 
                        dataKey="lapTime" 
                        fill="#3b82f6" 
                        isAnimationActive={false} 
                        radius={[2, 2, 0, 0]}
                    />
                    <Recharts.Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="cumulativeTime" 
                        stroke="#f43f5e" 
                        dot={false} 
                        strokeWidth={2} 
                        isAnimationActive={false} 
                    />
                </Recharts.ComposedChart>
            </Recharts.ResponsiveContainer>
        </div>
    );
};

export default SimpleSolveTimeChart; 