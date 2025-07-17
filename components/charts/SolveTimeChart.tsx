
import React, { useState } from 'react';
import * as Recharts from 'recharts';
import { type Question } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { useChartData } from '../../hooks/useChartData';
import { formatMinSec } from '../../utils/formatters';

interface SolveTimeChartProps {
    questions: Question[];
    forceSolveOrderMode?: boolean;
}

const SolveTimeChart: React.FC<SolveTimeChartProps> = ({ questions, forceSolveOrderMode = false }) => {
    const [visualizeBySolveOrder, setVisualizeBySolveOrder] = useState(forceSolveOrderMode);
    const { hasData, questionNumberData, solveOrderData } = useChartData(questions);

    const tickColor = '#94a3b8'; // slate-400
    const gridColor = 'rgba(100, 116, 139, 0.2)'; // slate-500 with opacity

    if (!hasData) {
        return (
             <div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-4">문제별 풀이 시간 시각화</h3>
                <div className="w-full h-96 flex items-center justify-center text-slate-500 bg-slate-100 dark:bg-slate-800/50 rounded-lg">
                    풀이 기록이 없어 차트를 표시할 수 없습니다.
                </div>
            </div>
        );
    }
    
    const renderLegendText = (value: string) => <span className="text-slate-300">{value}</span>;
    
    const tooltipPayloadNameMap: Record<string, string> = {
        lapTime: "구간별 풀이 시간",
        cumulativeTime: "누적 시간",
        solveTime: "풀이 시간"
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-slate-700/80 backdrop-blur-sm border border-slate-600 rounded-lg text-slate-50 shadow-lg">
                    <p className="font-bold text-base mb-2">{label}</p>
                    {payload.map((pld: any, index: number) => (
                        <div key={index} style={{ color: pld.color }}>
                            {`${tooltipPayloadNameMap[pld.dataKey] || pld.name}: ${formatMinSec(pld.value)}`}
                        </div>
                    ))}
                </div>
            );
        }
        return null;
    };


    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                 <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">문제별 풀이 시간 시각화</h3>
                 {!forceSolveOrderMode && (
                     <ToggleSwitch
                        label="풀이 순서대로 보기"
                        enabled={visualizeBySolveOrder}
                        onChange={setVisualizeBySolveOrder}
                    />
                 )}
            </div>
             <div className="w-full h-96">
                <Recharts.ResponsiveContainer width="100%" height="100%">
                    {visualizeBySolveOrder ? (
                         <Recharts.ComposedChart
                            data={solveOrderData}
                            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
                        >
                            <Recharts.CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <Recharts.XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                            <Recharts.YAxis yAxisId="left" tickFormatter={formatMinSec} tick={{ fontSize: 12, fill: tickColor }} label={{ value: '구간별 시간', angle: -90, position: 'insideLeft', fill: tickColor, style: {textAnchor: 'middle'} }} />
                            <Recharts.YAxis 
                                yAxisId="right" 
                                orientation="right" 
                                tick={{ fontSize: 12, fill: tickColor }} 
                                label={{ value: '누적 시간', angle: 90, position: 'insideRight', fill: tickColor, style: {textAnchor: 'middle'} }}
                                tickFormatter={formatMinSec}
                            />
                            <Recharts.Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100,116,139,0.1)'}} />
                            <Recharts.Legend formatter={renderLegendText} />
                            <Recharts.Bar yAxisId="left" dataKey="lapTime" name="구간별 풀이 시간" fill="#3b82f6" isAnimationActive={false} />
                            <Recharts.Line yAxisId="right" type="monotone" dataKey="cumulativeTime" name="누적 시간" stroke="#f43f5e" dot={false} strokeWidth={2} isAnimationActive={false} />
                        </Recharts.ComposedChart>
                    ) : (
                        <Recharts.BarChart
                            data={questionNumberData}
                            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                        >
                            <Recharts.CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <Recharts.XAxis dataKey="name" tick={{ fontSize: 12, fill: tickColor }} />
                            <Recharts.YAxis 
                                tickFormatter={formatMinSec}
                                tick={{ fontSize: 12, fill: tickColor }} 
                                label={{ value: '풀이 시간', angle: -90, position: 'insideLeft', fill: tickColor, style: {textAnchor: 'middle'} }}
                            />
                            <Recharts.Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(100,116,139,0.1)'}} />
                            <Recharts.Legend formatter={renderLegendText} />
                            <Recharts.Bar dataKey="solveTime" name="풀이 시간" fill="#3b82f6" isAnimationActive={false} />
                        </Recharts.BarChart>
                    )}
                </Recharts.ResponsiveContainer>
             </div>
        </div>
    );
};

export default SolveTimeChart;
