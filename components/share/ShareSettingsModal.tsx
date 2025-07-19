import React, { useState } from 'react';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';
import { Link } from 'react-router-dom';

interface ShareSettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onPreview: () => void;
    includeGrading: boolean;
    setIncludeGrading: (value: boolean) => void;
    blurAnswer: boolean;
    setBlurAnswer: (value: boolean) => void;
}

const ShareSettingsModal: React.FC<ShareSettingsModalProps> = ({ isOpen, onClose, onPreview, includeGrading, setIncludeGrading, blurAnswer, setBlurAnswer }) => {
    const [agreedToPolicy, setAgreedToPolicy] = useState(false);
    
    if (!isOpen) return null;

    const handlePreviewClick = () => {
        if (agreedToPolicy) {
            onPreview();
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-card dark:bg-card/95 rounded-2xl shadow-2xl w-full max-w-md min-w-0 overflow-hidden flex flex-col modal-container"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-border flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">공유 옵션 설정</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        공유할 이미지에 포함될 내용을 선택하세요.
                    </p>
                </header>
                
                <main className="p-6">
                    <div className="space-y-4">
                        <ToggleSwitch
                            label="정답 채점 정보 포함"
                            enabled={includeGrading}
                            onChange={setIncludeGrading}
                        />
                        <ToggleSwitch
                            label="스포방지(정답 블러)"
                            enabled={blurAnswer}
                            onChange={setBlurAnswer}
                            disabled={!includeGrading}
                        />
                    </div>
                </main>

                <footer className="p-4 border-t border-border">
                    <div className="space-y-3 mb-4">
                        <div className="flex items-start space-x-3">
                            <input
                                type="checkbox"
                                id="policy-agree"
                                checked={agreedToPolicy}
                                onChange={(e) => setAgreedToPolicy(e.target.checked)}
                                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary flex-shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                                <label htmlFor="policy-agree" className="text-sm font-medium text-foreground cursor-pointer">
                                    개인정보 처리방침에 동의하며 공유 링크를 생성합니다.
                                </label>
                                <p className="text-xs text-muted-foreground mt-1">
                                    공유 링크 생성을 위해 시험 기록이 서버에 저장됩니다.
                                    {' '}
                                    <Link to="/privacy" target="_blank" className="underline hover:text-primary">
                                        자세히 보기
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button onClick={onClose} variant="secondary">
                            취소
                        </Button>
                        <Button 
                            onClick={handlePreviewClick}
                            className="w-full sm:w-auto"
                            disabled={!agreedToPolicy}
                        >
                            미리보기 생성
                        </Button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default ShareSettingsModal; 