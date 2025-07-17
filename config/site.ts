// 사이트 설정 - 도메인 변경 시 이 파일만 수정하면 됩니다
export const siteConfig = {
    // 기본 도메인 설정
    domain: 'https://mocktimer.kr',
    
    // 사이트 메타 정보
    title: '모의고사 타이머 & 분석기',
    description: '수능, 공무원시험, LEET, CPA 등 다양한 시험을 위한 문제별 풀이 시간 측정 및 분석 도구입니다.',
    keywords: '모의고사 타이머, 시험 타이머, 문제풀이 시간, 수능 타이머, 공무원시험 타이머, LEET 타이머, CPA 타이머, 학습 분석, 시간 관리, 시험 준비, 수험생 도구',
    
    // 소셜 미디어 설정
    social: {
        twitter: {
            card: 'summary_large_image',
            title: '모의고사 타이머 & 분석기',
            description: '문제별 풀이 시간을 측정하고 분석하여 효율적인 시험 준비를 도와주는 도구입니다.'
        },
        og: {
            title: '모의고사 타이머 & 분석기',
            description: '수능, 공무원시험, LEET, CPA 등 다양한 시험을 위한 문제별 풀이 시간 측정 및 분석 도구입니다.',
            type: 'website',
            locale: 'ko_KR',
            image: 'https://mocktimer.kr/og-image.png',
            imageWidth: 1200,
            imageHeight: 630
        }
    },
    
    // 공유 텍스트 템플릿
    shareText: '모의고사 타이머 & 분석기 - 문제별 풀이 시간을 측정하고 분석하여 효율적인 시험 준비를 도와주는 도구입니다.',
    
    // 문의 정보
    contact: {
        email: 'mocktimer24@gmail.com'
    },
    
    // 카피라이트 정보
    copyright: {
        year: 2025,
        name: '모의고사 타이머 & 분석기'
    },
    
    // SEO 추가 정보
    seo: {
        author: '모의고사 타이머 & 분석기',
        publisher: '모의고사 타이머 & 분석기',
        datePublished: '2025-7-15',
        dateModified: '2025-07-17',
        version: '1.2.0',
        language: 'ko',
        geoRegion: 'KR',
        geoPlacename: '대한민국'
    }
};

// URL 생성 헬퍼 함수들
export const getShareUrl = (path: string = '') => `${siteConfig.domain}${path}`;

export const getTwitterShareUrl = (text?: string, url?: string) => {
    const shareText = text || siteConfig.shareText;
    const shareUrl = url || siteConfig.domain;
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
};

export const getNaverBlogShareUrl = (url?: string, title?: string) => {
    const shareUrl = url || siteConfig.domain;
    const shareTitle = title || siteConfig.title;
    return `https://share.naver.com/web/shareView?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}`;
};

export const getFacebookShareUrl = (url?: string) => {
    const shareUrl = url || siteConfig.domain;
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
};

export const getLinkedInShareUrl = (url?: string, title?: string, summary?: string) => {
    const shareUrl = url || siteConfig.domain;
    const shareTitle = title || siteConfig.title;
    const shareSummary = summary || siteConfig.shareText;
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(shareTitle)}&summary=${encodeURIComponent(shareSummary)}`;
};

export const getTelegramShareUrl = (url?: string, text?: string) => {
    const shareUrl = url || siteConfig.domain;
    const shareText = text || siteConfig.shareText;
    return `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
};

export const getWhatsAppShareUrl = (text?: string, url?: string) => {
    const shareText = text || siteConfig.shareText;
    const shareUrl = url || siteConfig.domain;
    return `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
}; 