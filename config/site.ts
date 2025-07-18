// 사이트 설정 - 도메인 변경 시 이 파일만 수정하면 됩니다
export const siteConfig = {
    // 기본 도메인 설정
    domain: 'https://www.mocktimer.kr',
    
    // 사이트 메타 정보
    title: 'MockTimer | 모의고사 타이머 & 채점·분석기',
    description: '모의고사 타이머 & 채점·분석기 : 시간 관리 능력을 극대화하여 최고의 성과를 만드세요.',
    keywords: 'MockTimer, 목타이머, 모의고사 타이머, 시험 타이머, 문제풀이 시간, 수능 타이머, 공무원시험 타이머, LEET 타이머, CPA 타이머, 학습 분석, 시간 관리, 시험 준비, 수험생 도구',
    
    // 소셜 미디어 설정
    social: {
        twitter: {
            card: 'summary_large_image',
            title: 'MockTimer | 모의고사 타이머 & 채점·분석기',
            description: '시간 관리 능력을 극대화하여 최고의 성과를 만드세요.'
        },
        og: {
            title: 'MockTimer | 모의고사 타이머 & 채점·분석기',
            description: '모의고사 타이머 & 채점·분석기 : 시간 관리 능력을 극대화하여 최고의 성과를 만드세요.',
            type: 'website',
            locale: 'ko_KR',
            image: 'https://www.mocktimer.kr/og-image.png',
            imageWidth: 1200,
            imageHeight: 630
        }
    },
    
    // 공유 텍스트 템플릿
    shareText: 'MockTimer - 모의고사 타이머 & 채점·분석기 : 시간 관리 능력을 극대화하여 최고의 성과를 만드세요.',
    
    // 문의 정보
    contact: {
        email: 'mocktimer24@gmail.com'
    },
    
    // 카피라이트 정보
    copyright: {
        year: 2025,
        name: 'MockTimer'
    },
    
    // SEO 추가 정보
    seo: {
        author: 'MockTimer',
        publisher: 'MockTimer',
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

// 환경에 따른 동적 도메인 결정 (개발 환경에서는 현재 도메인, 프로덕션에서는 설정된 도메인)
// 필요시 사용: const shareUrl = getCurrentDomain() + '/share/' + id;
export const getCurrentDomain = () => {
    if (typeof window !== 'undefined') {
        // 개발 환경에서는 현재 도메인 사용 (localhost, 개발 서버 등)
        if (window.location.hostname === 'localhost' || 
            window.location.hostname.includes('dev') || 
            window.location.hostname.includes('staging')) {
            return window.location.origin;
        }
    }
    // 프로덕션 환경에서는 설정된 도메인 사용
    return siteConfig.domain;
};

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