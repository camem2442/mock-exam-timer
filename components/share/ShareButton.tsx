import React, { useState } from 'react';
import { type Question } from '../../types';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/site';

interface ShareButtonProps {
    questions: Question[];
}

const ShareButton: React.FC<ShareButtonProps> = ({ questions }) => {
    const [showCopyMessage, setShowCopyMessage] = useState(false);

    const handleShare = async () => {
        const shareText = `모의고사 타이머로 ${questions.length}문제를 풀었습니다. 총 소요시간: ${Math.floor(questions.reduce((sum, q) => sum + q.solveTime, 0) / 60)}분\n\n${siteConfig.domain}`;
        
        if (navigator.share) {
            // 네이티브 공유 API 사용 (모바일)
            try {
                await navigator.share({
                    title: siteConfig.title,
                    text: shareText,
                    url: siteConfig.domain
                });
            } catch (error) {
                console.log('공유가 취소되었습니다.');
            }
        } else {
            // 클립보드 복사 (데스크톱)
            try {
                await navigator.clipboard.writeText(shareText);
                setShowCopyMessage(true);
                setTimeout(() => setShowCopyMessage(false), 3000);
            } catch (error) {
                // 폴백: 수동 복사
                const textArea = document.createElement('textarea');
                textArea.value = shareText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setShowCopyMessage(true);
                setTimeout(() => setShowCopyMessage(false), 3000);
            }
        }
    };

    return (
        <>
            <Button 
                onClick={handleShare} 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground flex-shrink-0"
                aria-label="결과 공유"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
            </Button>
            
            {/* 클립보드 복사 성공 메시지 */}
            {showCopyMessage && (
                <div className="absolute top-full right-0 mt-2 z-[60] bg-info border border-border rounded-lg shadow-lg p-3 w-72 max-w-[90vw]">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-info-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-info-foreground whitespace-nowrap">
                                클립보드에 복사됨
                            </h4>
                            <p className="mt-1 text-xs sm:text-sm text-info-foreground/80 whitespace-nowrap overflow-hidden text-ellipsis">
                                공유 텍스트가 클립보드에 복사되었습니다!
                            </p>
                        </div>
                        <button
                            onClick={() => setShowCopyMessage(false)}
                            className="flex-shrink-0 text-info-foreground/60 hover:text-info-foreground"
                        >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ShareButton; 