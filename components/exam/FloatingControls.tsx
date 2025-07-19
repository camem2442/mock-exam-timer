import React, { useState } from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

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
            <Card className="shadow-lg">
                {isExpanded ? (
                    <div className="p-3 space-y-3 min-w-[200px]">
                        {/* 헤더 */}
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-foreground">모드 설정</span>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setIsExpanded(false)}
                                className="w-6 h-6 p-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Button>
                        </div>

                        {/* 마킹 모드 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">🏷️</span>
                                <span className="text-sm">마킹 모드</span>
                            </div>
                            <ToggleSwitch 
                                enabled={isMarkingMode} 
                                onChange={onMarkingModeChange} 
                                disabled={!isExamActive}
                            />
                        </div>

                        {/* 일괄 선택 */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm">📋</span>
                                <span className="text-sm">일괄 선택</span>
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
                    <Button
                        onClick={() => setIsExpanded(true)}
                        size="sm"
                        variant="default"
                        className="w-12 h-12 rounded-full p-0"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </Button>
                )}
            </Card>
        </div>
    );
};

export default FloatingControls;