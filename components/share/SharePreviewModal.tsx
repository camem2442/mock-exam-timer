import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/Button';
import { Spinner } from '../ui/Spinner';
import { Input } from '../ui/Input';
import { SocialShareBadges } from '../ui/SocialShareBadges';
import { generateImageFilename } from '../../utils/exportUtils';

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
    examName?: string;
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
    examName,
}) => {

    const handleDownloadImage = () => {
        if (!previewImageUrl) return;
        const link = document.createElement('a');
        link.href = previewImageUrl;
        link.download = generateImageFilename(examName);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <div 
                className="bg-card text-card-foreground rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-border flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">공유하기</h2>
                    <div className="flex items-center">
                        {showSettingsButton && (
                            <Button variant="ghost" size="icon" onClick={onBackToSettings} title="설정 수정">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" onClick={onClose} title="닫기">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </Button>
                    </div>
                </header>

                <main className="p-4 sm:p-6 overflow-y-auto">
                    {error && (
                        <div className="text-center text-destructive bg-destructive/10 p-4 rounded-lg mb-4">
                            <h3 className="font-bold">오류</h3>
                            <p className="text-sm">{error}</p>
                        </div>
                    )}
                    <div className="bg-background rounded-lg w-full max-w-sm mx-auto overflow-hidden">
                        {isLoading && (
                            <div className="aspect-[9/16] flex items-center justify-center">
                                <Spinner size="lg" />
                            </div>
                        )}
                        {previewImageUrl && (
                           <img src={previewImageUrl} alt="시험 결과 미리보기" className="w-full h-auto" />
                        )}
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                           우클릭(PC) 또는 길게 눌러(모바일) 이미지를 저장할 수 있습니다.
                        </p>
                        <p className="text-xs text-muted-foreground/80 mt-1">
                           * Safari 등에서 파일명이 깨질 경우, 아래 '이미지 저장' 버튼을 이용해주세요.
                        </p>
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="relative">
                            <Input
                                type="text"
                                value={isUrlLoading ? '공유 링크 생성 중...' : (shareUrl || '오류가 발생했습니다.')}
                                readOnly
                                className="pr-10"
                            />
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                                onClick={handleCopyLink}
                                disabled={!shareUrl}
                            >
                               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m-3 4v6m0 0l-3-3m3 3l3-3" />
                               </svg>
                            </Button>
                        </div>

                        <div className="flex gap-2">
                           <Button 
                                onClick={handleDownloadImage} 
                                className="flex-1" 
                                variant="secondary" 
                                disabled={!previewImageUrl || isLoading || isSharing}
                            >
                                이미지 저장
                            </Button>
                            <Button 
                                onClick={handleShare}
                                className="flex-1"
                                disabled={!shareUrl || isSharing || isLoading || isUrlLoading}
                            >
                                {isSharing ? <Spinner /> : '공유하기'}
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default SharePreviewModal; 