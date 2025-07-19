import React from 'react';

interface ControlToolbarProps {
    isExamActive: boolean;
}

const ControlToolbar: React.FC<ControlToolbarProps> = ({
    isExamActive
}) => {
    // 모드 관련 토글들은 FloatingControls로 이동
    // 필요한 다른 컨트롤이 있다면 여기에 추가
    return (
        <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-sm text-muted-foreground">
                {isExamActive ? '시험이 진행 중입니다' : '시험 준비'}
            </div>
        </div>
    );
};

export default ControlToolbar;