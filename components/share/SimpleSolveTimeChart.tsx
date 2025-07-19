import React, { useEffect, useState } from 'react';
import * as Recharts from 'recharts';
import { type Question } from '../../types';
import { useChartData } from '../../hooks/useChartData';
import { formatMinSec } from '../../utils/formatters';
import { useThemeColors } from '@/hooks/useThemeColors';

interface SimpleSolveTimeChartProps {
    questions: Question[];
}

const SimpleSolveTimeChart: React.FC<SimpleSolveTimeChartProps> = ({ questions }) => {
    const { hasData, solveOrderData } = useChartData(questions);
    const [chartWidth, setChartWidth] = useState(580);
    const themeColors = useThemeColors();

    // 화면 크기에 따른 차트 너비 계산
    useEffect(() => {
        const updateChartWidth = () => {
            const width = window.innerWidth;
            let newWidth = 580;
            
            if (width <= 360) {
                newWidth = Math.min(width - 32, 320);
            } else if (width <= 480) {
                newWidth = Math.min(width - 24, 400);
            } else if (width <= 640) {
                newWidth = Math.min(width - 32, 500);
            } else if (width <= 768) {
                newWidth = Math.min(width - 32, 550);
            }
            
            setChartWidth(newWidth);
        };
        
        updateChartWidth();
        window.addEventListener('resize', updateChartWidth);
        return () => window.removeEventListener('resize', updateChartWidth);
    }, []);

    const tickColor = themeColors.mutedForeground;
    const gridColor = themeColors.border;

    if (!hasData) {
        return (
            <div className="w-full h-64 flex items-center justify-center text-muted-foreground bg-muted rounded-lg">
                풀이 기록이 없습니다.
            </div>
        );
    }

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="p-3 bg-card/80 backdrop-blur-sm border border-border rounded-lg text-card-foreground shadow-lg">
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

    // 분 단위만 표시하는 포맷터
    const formatMinute = (sec: number) => `${Math.floor(sec / 60)}분`;

    // 데이터 포인트 수에 따라 막대 너비를 동적으로 설정
    const barSize = solveOrderData.length < 10 ? 40 : undefined;

    // 화면 크기에 따른 마진 조정
    const getMargin = () => {
        const width = window.innerWidth;
        if (width <= 480) {
            return { top: 10, right: 10, left: 10, bottom: 10 };
        }
        return { top: 10, right: 30, left: 20, bottom: 10 };
    };

    return (
        <div className="w-full h-64 overflow-hidden">
            <Recharts.ResponsiveContainer width="100%" height="100%">
                <Recharts.ComposedChart
                    data={solveOrderData}
                    margin={getMargin()}
                >
                    <Recharts.CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                    <Recharts.XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10, fill: tickColor }} 
                        interval="preserveStartEnd"
                    />
                    <Recharts.YAxis 
                        yAxisId="left" 
                        tickFormatter={formatMinute} 
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
                        tickFormatter={formatMinute}
                    />
                    <Recharts.Tooltip content={<CustomTooltip />} cursor={{fill: 'rgba(200, 200, 220, 0.1)'}} />
                    <Recharts.Bar 
                        yAxisId="left" 
                        dataKey="lapTime" 
                        fill={themeColors.primary} 
                        isAnimationActive={false} 
                        radius={[2, 2, 0, 0]}
                        maxBarSize={barSize}
                    />
                    <Recharts.Line 
                        yAxisId="right" 
                        type="monotone" 
                        dataKey="cumulativeTime" 
                        stroke={themeColors.destructive} 
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