
import React, { useState, useMemo } from 'react';
import { type Question } from '../../types';
import { Button } from '../ui/Button';
import { formatTime } from '../../utils/formatters';
import { useChartData, type SolveHistoryEvent } from '../../hooks/useChartData';
import { generateCSV, downloadCSV, type ExportData } from '../../utils/exportUtils';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/DropdownMenu';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/Popover';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Spinner } from '../ui/Spinner';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

type SortOption = 'solveOrder' | 'questionNumber' | 'timeDesc' | 'timeAsc';

interface FilterOptions {
  correct: boolean;
  incorrect: boolean;
}

const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'solveOrder', label: '풀이 순서' },
    { value: 'questionNumber', label: '문제 번호순' },
    { value: 'timeDesc', label: '오래 걸린 순' },
    { value: 'timeAsc', label: '짧게 걸린 순' },
];

interface SolvingRecordTableProps {
    questions: Question[];
}

const SolvingRecordTable: React.FC<SolvingRecordTableProps> = ({ questions }) => {
    const [sortOption, setSortOption] = useState<SortOption>('solveOrder');
    const [filters, setFilters] = useState<FilterOptions>({
      correct: false,
      incorrect: false,
    });
    
    const { solveHistory } = useChartData(questions);
    
    // 복사 상태 관리를 위한 훅 사용
    const { copy, isCopied, error: copyError } = useCopyToClipboard(2000);
    const [isCopying, setIsCopying] = useState(false);

    const handleExportData = async () => {
        if (isCopying) return;

        setIsCopying(true);

        const totalTime = questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions,
            totalTime,
            totalQuestions: questions.length,
            date: new Date().toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        await copy(csvData);
        
        setIsCopying(false);
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

    const getCopyButtonContent = () => {
        if (isCopying) {
            return <span className="flex items-center justify-center gap-2"><Spinner size="sm" /><span className="hidden sm:inline">복사 중...</span></span>;
        }
        
        if (isCopied) {
            return <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span className="hidden sm:inline"> 복사 완료!</span>
            </span>;
        }
        
        if (copyError) {
            return <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="hidden sm:inline"> 복사 실패</span>
            </span>;
        }
        
        return (
            <span className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>CSV 복사</span>
            </span>
        );
    };
    
    const questionsByNumber = useMemo(() => {
        const map: Record<number, Question> = {};
        questions.forEach(q => { map[q.number] = q; });
        return map;
    }, [questions]);

    const sortedQuestions = useMemo(() => [...questions].sort((a, b) => a.number - b.number), [questions]);
    
    const displayedData = useMemo(() => {
        const showAll = !filters.correct && !filters.incorrect;

        const filteredQuestions = questions.filter(q => {
            if (showAll) {
                return true; // Show all items if both filters are off
            }
            if (q.isCorrect === true) return filters.correct;
            if (q.isCorrect === false) return filters.incorrect;
            // Unanswered items are hidden if any filter is active
            return false;
        });

        const answeredNumbers = new Set(filteredQuestions.map(q => q.number));

        if (sortOption === 'solveOrder') {
            return solveHistory.filter(event => answeredNumbers.has(event.questionNumber));
        }
        
        // Apply sort for question-based views
        switch (sortOption) {
            case 'timeDesc':
                return filteredQuestions.sort((a, b) => b.solveTime - a.solveTime);
            case 'timeAsc':
                return filteredQuestions.sort((a, b) => a.solveTime - b.solveTime);
            case 'questionNumber':
            default:
                return filteredQuestions.sort((a, b) => a.number - b.number);
        }
    }, [questions, filters, sortOption, solveHistory]);

    const correctnessIndicator = (isCorrect: boolean | undefined) => {
        if (isCorrect === true) return <span className="text-success font-bold">O</span>;
        if (isCorrect === false) return <span className="text-destructive font-bold">X</span>;
        return <span>-</span>;
    };

    const handleFilterChange = (filterName: keyof FilterOptions) => {
        setFilters(prev => ({ ...prev, [filterName]: !prev[filterName] }));
    };

    return (
        <>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg sm:text-xl font-bold text-foreground whitespace-nowrap">
                    풀이 기록표
                </h3>
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <span>정렬: {sortOptions.find(o => o.value === sortOption)?.label}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {sortOptions.map(option => (
                            <DropdownMenuItem key={option.value} onSelect={() => setSortOption(option.value)}>
                                {option.label}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="max-h-[500px] overflow-y-auto overflow-x-auto">
                <div className="min-w-full">
                    <table className="w-full text-left">
                        <thead className="sticky top-0 bg-muted text-muted-foreground">
                            {sortOption === 'solveOrder' ? (
                                <tr>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">순서</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">번호</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">소요시간</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">누적시간</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">답안</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap text-center">정답</th>
                                </tr>
                            ) : (
                                <tr>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">번호</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">소요시간</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">시도</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap">답안</th>
                                    <th className="p-2 sm:p-3 text-xs sm:text-sm font-semibold whitespace-nowrap text-center">정답</th>
                                </tr>
                            )}
                        </thead>
                        <tbody className="divide-y divide-border">
                            {sortOption === 'solveOrder' ? (
                                (displayedData as SolveHistoryEvent[]).length > 0 ? (displayedData as SolveHistoryEvent[]).map((event, index) => {
                                    const question = questionsByNumber[event.questionNumber];
                                    return (
                                    <tr key={index} className="hover:bg-accent">
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium whitespace-nowrap">{String(index + 1).padStart(2, '0')}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm font-medium whitespace-nowrap">{event.questionNumber}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm tabular-nums text-primary font-semibold whitespace-nowrap">{formatTime(event.duration)}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm tabular-nums whitespace-nowrap">{formatTime(event.timestamp)}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap max-w-[60px] sm:max-w-none truncate" title={event.answer ?? '미입력'}>{event.answer ?? '미입력'}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-center whitespace-nowrap">{correctnessIndicator(question?.isCorrect)}</td>
                                    </tr>
                                    )
                                }) : (
                                    <tr>
                                        <td colSpan={6} className="text-center p-8 text-muted-foreground text-sm">표시할 기록이 없습니다.</td>
                                    </tr>
                                )
                            ) : (
                                (displayedData as Question[]).length > 0 ? (displayedData as Question[]).map((q) => (
                                    <tr key={q.number} className="hover:bg-accent">
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm font-bold whitespace-nowrap">{q.number}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm tabular-nums text-primary font-semibold whitespace-nowrap">{formatTime(q.solveTime)}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm tabular-nums whitespace-nowrap">{q.attempts > 0 ? `${q.attempts}회` : '-'}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm whitespace-nowrap max-w-[60px] sm:max-w-none truncate" title={q.answer ?? '미입력'}>{q.answer ?? '미입력'}</td>
                                        <td className="p-2 sm:p-3 text-xs sm:text-sm text-center whitespace-nowrap">{correctnessIndicator(q.isCorrect)}</td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={5} className="text-center p-8 text-muted-foreground text-sm">표시할 기록이 없습니다.</td>
                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex gap-2">
                    <Button 
                        onClick={handleExportData} 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground w-32 justify-center"
                        disabled={isCopying}
                    >
                        {getCopyButtonContent()}
                    </Button>
                    <Button 
                        onClick={handleDownloadCSV} 
                        variant="ghost" 
                        size="sm"
                        className="text-muted-foreground"
                    >
                        <span className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            <span>CSV 다운로드</span>
                        </span>
                    </Button>
                </div>

                <Popover>
                    <PopoverTrigger>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
                            <span>필터</span>
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56" side="top" align="end">
                        <div className="space-y-4 p-4">
                           <div className="flex items-center justify-between">
                               <span className="text-sm font-medium text-foreground">정답</span>
                               <ToggleSwitch enabled={filters.correct} onChange={() => handleFilterChange('correct')} />
                           </div>
                           <div className="flex items-center justify-between">
                               <span className="text-sm font-medium text-foreground">오답</span>
                               <ToggleSwitch enabled={filters.incorrect} onChange={() => handleFilterChange('incorrect')} />
                           </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </>
    );
};

export default SolvingRecordTable;