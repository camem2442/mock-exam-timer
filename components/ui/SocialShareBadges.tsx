import React from 'react';
import { 
    siteConfig, 
    getTwitterShareUrl, 
    getNaverBlogShareUrl, 
    getFacebookShareUrl,
    getTelegramShareUrl
} from '../../config/site';

interface SocialShareBadgesProps {
    className?: string;
}

export const SocialShareBadges: React.FC<SocialShareBadgesProps> = ({ className = '' }) => {
    const shareUrl = siteConfig.domain;
    const shareText = siteConfig.shareText;
    const shareTitle = siteConfig.title;

    const handleTwitterShare = () => {
        const twitterUrl = getTwitterShareUrl();
        window.open(twitterUrl, '_blank', 'width=600,height=400');
    };

    const handleNaverBlogShare = () => {
        const naverUrl = getNaverBlogShareUrl();
        window.open(naverUrl, '_blank', 'width=600,height=400');
    };

    const handleFacebookShare = () => {
        const facebookUrl = getFacebookShareUrl();
        window.open(facebookUrl, '_blank', 'width=600,height=400');
    };

    const handleTelegramShare = () => {
        const telegramUrl = getTelegramShareUrl();
        window.open(telegramUrl, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            // 간단한 토스트 메시지 (실제로는 더 정교한 토스트 시스템을 사용할 수 있음)
            alert('링크가 클립보드에 복사되었습니다!');
        } catch (error) {
            // 폴백: 수동 복사
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('링크가 클립보드에 복사되었습니다!');
        }
    };

    const handleNativeShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: shareTitle,
                    text: shareText,
                    url: shareUrl,
                });
            } catch (error) {
                // 사용자가 공유를 취소한 경우
                console.log('공유가 취소되었습니다.');
            }
        } else {
            // 기본 공유 API를 지원하지 않는 경우 링크 복사로 폴백
            handleCopyLink();
        }
    };

    return (
        <div className={`flex flex-wrap justify-center gap-1 sm:gap-1.5 ${className}`}>
            <button
                onClick={handleNativeShare}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                aria-label="공유"
            >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                <span className="text-xs">공유</span>
            </button>

            <button
                onClick={handleCopyLink}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                aria-label="링크 복사"
            >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span className="text-xs">링크</span>
            </button>

       
            <button
                onClick={handleNaverBlogShare}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                aria-label="네이버 블로그에 공유"
            >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727v12.845z"/>
                </svg>
                <span className="text-xs">블로그</span>
            </button>

            <button
                onClick={handleFacebookShare}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                aria-label="페이스북에 공유"
            >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-xs">페이스북</span>
            </button>

            <button
                onClick={handleTelegramShare}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                aria-label="텔레그램에 공유"
            >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
                <span className="text-xs">텔레그램</span>
            </button>
            <button
                onClick={handleTwitterShare}
                className="flex items-center gap-0.5 sm:gap-1 px-1.5 sm:px-2 py-1 sm:py-1.5 bg-black hover:bg-gray-800 text-white rounded-md transition-colors duration-200 text-xs font-medium whitespace-nowrap"
                aria-label="X(Twitter)에 공유"
            >
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
                <span className="text-xs">X</span>
            </button>

        </div>
    );
}; 