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
    showSettingsButton?: boolean;
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
    showSettingsButton = true,
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
            <div 
                className="bg-card text-card-foreground rounded-xl shadow-xl flex flex-col w-full max-w-lg overflow-hidden" 
                style={{ 
                    maxHeight: 'calc(100vh - 2rem)',
                    minHeight: '400px'
                }}
            >
                {/* Header */}
                <div className="flex-shrink-0 p-4 border-b border-border flex justify-between items-center">
                    <h3 className="text-lg font-bold text-foreground">결과 공유하기</h3>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="닫기">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                {/* Main Scrollable Content */}
                <div className="flex-grow overflow-y-auto min-h-0">
                    <div className="relative p-4 sm:p-6 flex flex-col justify-center items-center bg-muted" style={{ minHeight: '280px' }}>
                        {(isLoading || error) && (
                            <div className="absolute inset-4 z-10 bg-card/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center transition-opacity rounded-xl">
                                {isLoading && (
                                    <>
                                        <Spinner />
                                        <p className="text-base font-bold text-foreground mt-4">이미지를 생성 중입니다...</p>
                                        <p className="text-sm text-muted-foreground">잠시만 기다려 주세요.</p>
                                    </>
                                )}
                                {error && !isLoading && (
                                    <>
                                        <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        </div>
                                        <p className="text-lg font-bold text-destructive">오류 발생</p>
                                        <p className="text-sm text-foreground mt-1">{error}</p>
                                    </>
                                )}
                            </div>
                        )}
                        
                        {previewImageUrl && (
                            <img src={previewImageUrl} alt="결과 미리보기 이미지" className="rounded-xl shadow-lg border border-border/50 max-w-full h-auto" />
                        )}
                    </div>
                </div>
                
                {/* Footer Buttons */}
                <div className="flex-shrink-0 p-4 border-t border-border space-y-3">
                    {/* URL Display and Copy Button */}
                    <div className="bg-muted rounded-md p-3">
                        <div className="flex items-center justify-between gap-2">
                            {isUrlLoading ? (
                                <div className="flex items-center gap-2 text-muted-foreground min-w-0 flex-1">
                                    <Spinner size="sm" />
                                    <span className="text-sm">링크 생성 중...</span>
                                </div>
                            ) : (
                                <span 
                                    className="flex-grow text-foreground truncate min-w-0"
                                    style={{ fontSize: 'clamp(0.75rem, 3vw, 1rem)' }}
                                >
                                    {shareUrl || '오류: 링크를 생성할 수 없습니다.'}
                                </span>
                            )}
                            <Button 
                                onClick={onCopy} 
                                variant={isCopied ? "success" : "secondary"} 
                                disabled={!shareUrl || isUrlLoading} 
                                className="flex-shrink-0 px-3 py-1.5 text-sm whitespace-nowrap"
                            >
                                {isCopied ? '복사됨' : '복사'}
                            </Button>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {showSettingsButton && (
                            <Button onClick={onBackToSettings} className="flex-1" variant="outline" disabled={isLoading || isUrlLoading || isSharing}>
                                수정하기
                            </Button>
                        )}
                        <Button type="button" className="flex-1" onClick={handleShare} disabled={!shareUrl || isLoading || isUrlLoading || isSharing}>
                            {isSharing ? <Spinner /> : (isLoading || isUrlLoading ? '준비 중...' : '이미지/링크 공유')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SharePreviewModal; 