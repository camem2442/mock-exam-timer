import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Input } from '../ui/Input';

interface SharePreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBackToSettings: () => void;
    
    // Data from parent
    previewImageUrl: string | null;

    // State from parent
    isLoading: boolean;
    isUrlLoading: boolean;
    isSharing: boolean;
    shareUrl: string | null;
    error: string | null;

    // Handlers from parent
    handleShare: () => void;
    handleCopyLink: () => void;
}

const SharePreviewModal: React.FC<SharePreviewModalProps> = ({
    isOpen,
    onClose,
    onBackToSettings,
    previewImageUrl,
    isLoading,
    isUrlLoading,
    isSharing,
    shareUrl,
    error,
    handleShare,
    handleCopyLink,
}) => {
    const [isCopied, setIsCopied] = useState(false);

    const onCopy = () => {
        handleCopyLink();
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };
    
    if (!isOpen) return null;

    return createPortal(
        <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl flex flex-col max-h-full w-full max-w-lg overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">결과 공유하기</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" aria-label="닫기">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-grow overflow-y-auto">
                    <div className="relative p-4 sm:p-6 flex justify-center items-center bg-slate-100 dark:bg-slate-800/20 min-h-[320px]">
                        {(isLoading || error) && (
                            <div className="absolute inset-4 z-10 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center transition-opacity rounded-xl">
                                {isLoading && (
                                    <>
                                        <Spinner />
                                        <p className="text-base font-bold text-slate-700 dark:text-slate-200 mt-4">이미지를 생성 중입니다...</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">잠시만 기다려 주세요.</p>
                                    </>
                                )}
                                {error && !isLoading && (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-lg font-bold text-red-400">오류 발생</p>
                                        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">{error}</p>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {previewImageUrl && (
                            <img src={previewImageUrl} alt="결과 미리보기 이미지" className="rounded-xl shadow-lg border border-slate-200/50 dark:border-slate-700/50 max-w-full h-auto" />
                        )}
                    </div>
                    
                    {/* 링크 생성 상태 UI */}
                    {!shareUrl && !isLoading && !error && (
                         <div className="p-4 text-center bg-slate-50 dark:bg-slate-800">
                            {isUrlLoading ? (
                                <div className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-400">
                                    <Spinner size="sm" />
                                    <span>공유 링크를 만들고 있어요...</span>
                                </div>
                            ) : (
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    이미지 준비 완료! 공유 링크가 생성되면 공유할 수 있습니다.
                                </p>
                            )}
                        </div>
                    )}
                    
                    {shareUrl && !isLoading && !error && (
                        <div className="p-4 space-y-2 bg-slate-50 dark:bg-slate-800">
                          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">공유 링크 및 이미지가 준비되었습니다!</p>
                          <div className="flex gap-2">
                              <Input type="text" value={shareUrl} readOnly className="flex-grow bg-slate-200 dark:bg-slate-700"/>
                              <Button onClick={onCopy} variant={isCopied ? "success" : "secondary"}>
                                  {isCopied ? '복사 완료!' : '링크 복사'}
                              </Button>
                          </div>
                        </div>
                    )}

                </div>
                
                {/* Footer Buttons */}
                <div className="flex-shrink-0 flex gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
                    <Button onClick={onBackToSettings} className="flex-1" variant="outline" disabled={isLoading || isUrlLoading || isSharing}>
                        수정하기
                    </Button>
                    <Button type="button" className="flex-1" onClick={handleShare} disabled={!shareUrl || isLoading || isUrlLoading || isSharing}>
                        {isSharing ? <Spinner /> : (isLoading || isUrlLoading ? '준비 중...' : '공유하기')}
                    </Button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SharePreviewModal; 