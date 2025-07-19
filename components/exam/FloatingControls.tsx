import React, { useState } from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface FloatingControlsProps {
    isExamActive: boolean;
    batchMode: boolean;
    onBatchModeChange: (enabled: boolean) => void;
    onBatchRecord: () => void;
    isBatchRecordDisabled: boolean;
    isMarkingMode: boolean;
    onMarkingModeChange: () => void;
}

const FloatingControls: React.FC<FloatingControlsProps> = ({
    isExamActive,
    batchMode,
    onBatchModeChange,
    onBatchRecord,
    isBatchRecordDisabled,
    isMarkingMode,
    onMarkingModeChange
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-background/80 backdrop-blur-md border border-border/50 rounded-lg shadow-lg">
                {isExpanded ? (
                    <div className="p-3 space-y-3 min-w-[200px]">
                        {/* 헤더 */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">모드 설정</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsExpanded(false)}
                                className="w-6 h-6 p-0 hover:bg-accent/50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>

                        {/* 마킹 모드 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6z" />
                                </svg>
                                <span className="text-sm">마킹 모드</span>
                            </div>
                            <ToggleSwitch 
                                enabled={isMarkingMode} 
                                onChange={onMarkingModeChange} 
                                disabled={!isExamActive}
                            />
                        </div>

                        {/* 구분선 */}
                        <div className="border-t border-border"></div>

                        {/* 일괄 선택 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-muted-foreground">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 17.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                </svg>
                                <span className="text-sm">일괄 선택</span>
                                <Tooltip text="모드를 끄면 선택된 문제들도 초기화됩니다.">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 text-muted-foreground cursor-help">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                    </svg>
                                </Tooltip>
                            </div>
                            <ToggleSwitch 
                                enabled={batchMode} 
                                onChange={onBatchModeChange} 
                                disabled={!isExamActive}
                            />
                        </div>

                        {/* 일괄 기록 버튼 */}
                        <Button 
                            onClick={onBatchRecord} 
                            disabled={isBatchRecordDisabled}
                            size="sm"
                            className="w-full"
                        >
                            일괄 기록
                        </Button>
                    </div>
                ) : (
                    <div 
                        className="p-3 hover:bg-accent/20 rounded-lg cursor-pointer transition-colors"
                        onClick={() => setIsExpanded(true)}
                    >
                        <span className="text-sm font-medium text-foreground">
                            모드 설정
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FloatingControls;