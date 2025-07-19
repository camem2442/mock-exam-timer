import React from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';
import { Tooltip } from '../ui/Tooltip';

interface ControlToolbarProps {
    isExamActive: boolean;
    batchMode: boolean;
    onBatchModeChange: (enabled: boolean) => void;
    onBatchRecord: () => void;
    isBatchRecordDisabled: boolean;
    isMarkingMode: boolean;
    onMarkingModeChange: () => void;
}

const ControlToolbar: React.FC<ControlToolbarProps> = ({
    isExamActive, batchMode, onBatchModeChange, onBatchRecord, isBatchRecordDisabled,
    isMarkingMode, onMarkingModeChange
}) => {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                    <ToggleSwitch label="마킹 모드" enabled={isMarkingMode} onChange={onMarkingModeChange} disabled={!isExamActive} />
                    <Tooltip text="시간 기록 없이 답안만 수정하고 싶을 때 사용하세요.">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground cursor-help">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <ToggleSwitch label="일괄 선택" enabled={batchMode} onChange={onBatchModeChange} disabled={!isExamActive} />
                    <Tooltip text="여러 문제를 선택하여 시간을 한번에 기록하는 모드입니다.">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground cursor-help">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                    </Tooltip>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={onBatchRecord} disabled={isBatchRecordDisabled}>일괄 기록</Button>
                    <Tooltip text="선택한 문제들의 시간을 일괄 기록합니다.">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-muted-foreground cursor-help">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};

export default ControlToolbar;