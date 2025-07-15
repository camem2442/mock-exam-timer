import React, { useEffect } from 'react';

/**
 * Google AdSense 광고 유닛을 렌더링하는 컴포넌트입니다.
 * 이 컴포넌트는 useEffect 훅을 사용하여 AdSense 스크립트를 초기화합니다.
 * 
 * 전제 조건:
 * AdSense 라이브러리 스크립트가 index.html의 <head> 태그에 포함되어 있어야 합니다.
 * 예: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=..."></script>
 */
const AdPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => {
    useEffect(() => {
        try {
            // @ts-ignore
            if (window.adsbygoogle) {
                 // @ts-ignore
                (window.adsbygoogle = window.adsbygoogle || []).push({});
            }
        } catch (err) {
            console.error("AdSense error:", err);
        }
    }, []);

    return (
        <div className={`w-full my-6 ${className}`}>
             <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-1091793304609487"
                 data-ad-slot="5567931498"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdPlaceholder;