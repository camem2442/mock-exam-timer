import React, { useEffect, useRef } from 'react';

/**
 * Google AdSense 광고 유닛을 렌더링하는 컴포넌트입니다.
 * AdSense 스크립트는 컴포넌트가 렌더링되고 유효한 너비를 가졌을 때 초기화됩니다.
 * 
 * 전제 조건:
 * AdSense 라이브러리 스크립트가 index.html의 <head> 태그에 포함되어 있어야 합니다.
 * 예: <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=..."></script>
 */
const AdPlaceholder: React.FC<{ className?: string }> = ({ className = '' }) => {
    const adContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // "adsbygoogle.push() error: No slot size for availableWidth=0" 오류는
        // 광고 컨테이너의 너비가 0일 때 발생합니다. 이 문제를 해결하기 위해,
        // 컨테이너가 유효한 너비를 가질 때까지 몇 번의 시도를 통해 광고를 푸시합니다.
        let attempts = 0;
        const intervalId = setInterval(() => {
            if (adContainerRef.current && adContainerRef.current.clientWidth > 0) {
                try {
                    // @ts-ignore
                    if (window.adsbygoogle) {
                         // @ts-ignore
                        (window.adsbygoogle = window.adsbygoogle || []).push({});
                    }
                } catch (err) {
                    console.error("AdSense error:", err);
                }
                clearInterval(intervalId);
            } else {
                attempts++;
                if (attempts > 5) {
                    clearInterval(intervalId);
                }
            }
        }, 300);

        return () => {
            clearInterval(intervalId);
        };
    }, []);

    return (
        // min-height를 설정하여 컨테이너가 축소되는 것을 방지하고 AdSense에 공간이 있음을 알립니다.
        <div ref={adContainerRef} className={`w-full my-6 text-center ${className}`} style={{ minHeight: '90px' }}>
             <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-4111764703044544"
                 data-ad-slot="7248802537"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </div>
    );
};

export default AdPlaceholder;
