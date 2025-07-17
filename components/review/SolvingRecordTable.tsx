
import React, { useState, useMemo } from 'react';
import { type Question } from '../../types';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';
import { formatTime } from '../../utils/formatters';
import { useChartData } from '../../hooks/useChartData';
import { generateCSV, copyToClipboard, downloadCSV, type ExportData } from '../../utils/exportUtils';


interface SolvingRecordTableProps {
    questions: Question[];
}

const SolvingRecordTable: React.FC<SolvingRecordTableProps> = ({ questions }) => {
    const [sortBySolveOrder, setSortBySolveOrder] = useState(true);
    
    const { solveHistory } = useChartData(questions);

    const handleExportData = async () => {
        const totalTime = questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions,
            totalTime,
            totalQuestions: questions.length,
            date: new Date().toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        const success = await copyToClipboard(csvData);
        
        if (success) {
            alert('풀이 데이터가 클립보드에 복사되었습니다!\n\n엑셀이나 구글 시트에서 Ctrl+V로 붙여넣기 하세요.');
        } else {
            alert('클립보드 복사에 실패했습니다.');
        }
    };

    const handleDownloadCSV = () => {
        const totalTime = questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions,
            totalTime,
            totalQuestions: questions.length,
            date: new Date().toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        const filename = `시험기록_${new Date().toISOString().split('T')[0]}.csv`;
        downloadCSV(csvData, filename);
    };
    
    const questionsByNumber = useMemo(() => {
        const map: Record<number, Question> = {};
        questions.forEach(q => { map[q.number] = q; });
        return map;
    }, [questions]);

    const sortedQuestions = useMemo(() => [...questions].sort((a, b) => a.number - b.number), [questions]);
    
    const correctnessIndicator = (isCorrect: boolean | undefined) => {
        if (isCorrect === true) return <span className="text-green-500 font-bold">O</span>;
        if (isCorrect === false) return <span className="text-red-500 font-bold">X</span>;
        return <span>-</span>;
    };


    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">
                    {sortBySolveOrder ? '풀이 기록표 (시간순)' : '풀이 기록표 (문제 번호순)'}
                </h3>
                <ToggleSwitch label="풀이 순서로 보기" enabled={sortBySolveOrder} onChange={setSortBySolveOrder} />
            </div>
            <div className="max-h-[500px] overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800">
                        {sortBySolveOrder ? (
                            <tr>
                                <th className="p-3 text-sm whitespace-nowrap">순서</th>
                                <th className="p-3 text-sm whitespace-nowrap">문제 번호</th>
                                <th className="p-3 text-sm whitespace-nowrap">소요 시간</th>
                                <th className="p-3 text-sm whitespace-nowrap">누적 시간</th>
                                <th className="p-3 text-sm whitespace-nowrap">제출 답안</th>
                                <th className="p-3 text-sm whitespace-nowrap text-center">정답 여부</th>
                            </tr>
                        ) : (
                            <tr>
                                <th className="p-3 text-sm whitespace-nowrap">문제 번호</th>
                                <th className="p-3 text-sm whitespace-nowrap">총 소요 시간</th>
                                <th className="p-3 text-sm whitespace-nowrap">시도 횟수</th>
                                <th className="p-3 text-sm whitespace-nowrap">최종 답안</th>
                                <th className="p-3 text-sm whitespace-nowrap text-center">정답 여부</th>
                            </tr>
                        )}
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {sortBySolveOrder ? (
                            solveHistory.length > 0 ? solveHistory.map((event, index) => {
                                const question = questionsByNumber[event.questionNumber];
                                return (
                                <tr key={index} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 text-sm font-medium whitespace-nowrap">{String(index + 1).padStart(2, '0')}</td>
                                    <td className="p-3 text-sm font-medium whitespace-nowrap">{event.questionNumber}</td>
                                    <td className="p-3 text-sm tabular-nums text-primary-600 dark:text-primary-400 font-semibold whitespace-nowrap">{formatTime(event.duration)}</td>
                                    <td className="p-3 text-sm tabular-nums whitespace-nowrap">{formatTime(event.timestamp)}</td>
                                    <td className="p-3 text-sm whitespace-nowrap">{event.answer ?? '미입력'}</td>
                                    <td className="p-3 text-sm text-center whitespace-nowrap">{correctnessIndicator(question?.isCorrect)}</td>
                                </tr>
                                )
                            }) : (
                                <tr>
                                    <td colSpan={6} className="text-center p-8 text-slate-500">풀이 기록이 없습니다.</td>
                                </tr>
                            )
                        ) : (
                             sortedQuestions.map((q) => (
                                <tr key={q.number} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="p-3 text-sm font-bold whitespace-nowrap">{q.number}</td>
                                    <td className="p-3 text-sm tabular-nums text-primary-600 dark:text-primary-400 font-semibold whitespace-nowrap">{formatTime(q.solveTime)}</td>
                                    <td className="p-3 text-sm tabular-nums whitespace-nowrap">{q.attempts > 0 ? `${q.attempts}회` : '-'}</td>
                                    <td className="p-3 text-sm whitespace-nowrap">{q.answer ?? '미입력'}</td>
                                    <td className="p-3 text-sm text-center whitespace-nowrap">{correctnessIndicator(q.isCorrect)}</td>
                                </tr>
                            ))
                        )}
                         {( !sortBySolveOrder && sortedQuestions.every(q => q.attempts === 0)) && (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-slate-500">풀이 기록이 없습니다.</td>
                            </tr>
                         )}
                    </tbody>
                </table>
            </div>
            <div className="flex justify-end mt-4 gap-2">
                <Button 
                    onClick={handleExportData} 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    📋 CSV 복사
                </Button>
                <Button 
                    onClick={handleDownloadCSV} 
                    variant="ghost" 
                    size="sm"
                    className="text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                >
                    📄 CSV 다운로드
                </Button>
            </div>
        </>
    );
};

export default SolvingRecordTable;