import React from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface ShareSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPreview: () => void;
    includeGrading: boolean;
    setIncludeGrading: (include: boolean) => void;
    blurAnswer: boolean;
    setBlurAnswer: (blur: boolean) => void;
}

const ShareSettingsModal: React.FC<ShareSettingsModalProps> = ({
    isOpen,
    onClose,
    onPreview,
    includeGrading,
    setIncludeGrading,
    blurAnswer,
    setBlurAnswer
}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-auto">
                <h3 className="text-lg font-bold mb-4 text-center">공유 옵션 설정</h3>
                
                <div className="space-y-4">
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">정답 채점 정보 포함</span>
                            <ToggleSwitch enabled={includeGrading} onChange={setIncludeGrading} />
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">스포방지(정답 블러)</span>
                            <ToggleSwitch enabled={blurAnswer} onChange={setBlurAnswer} />
                        </div>
                    </div>
                </div>
                
                <div className="flex gap-2 mt-6">
                    <button 
                        className="flex-1 py-2 px-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium"
                        onClick={onClose}
                    >
                        취소
                    </button>
                    <button 
                        className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-md font-medium"
                        onClick={onPreview}
                    >
                        미리보기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShareSettingsModal; 