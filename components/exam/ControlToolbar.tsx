import React from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';

interface ControlToolbarProps {
    isExamActive: boolean;
    batchMode: boolean;
    onBatchModeChange: (enabled: boolean) => void;
    onBatchRecord: () => void;
    isBatchRecordDisabled: boolean;
}

const ControlToolbar: React.FC<ControlToolbarProps> = ({
    isExamActive, batchMode, onBatchModeChange, onBatchRecord, isBatchRecordDisabled
}) => {
    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
                <ToggleSwitch label="일괄 선택" enabled={batchMode} onChange={onBatchModeChange} disabled={!isExamActive} />
                <Button onClick={onBatchRecord} disabled={isBatchRecordDisabled}>일괄 기록</Button>
            </div>
        </div>
    );
};

export default ControlToolbar;