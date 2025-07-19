import { useState, useEffect } from 'react';

interface MobileOptimization {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isPortrait: boolean;
  isLandscape: boolean;
  screenWidth: number;
  screenHeight: number;
  isTouchDevice: boolean;
  isIOS: boolean;
  isAndroid: boolean;
}

export const useMobileOptimization = (): MobileOptimization => {
  const [mobileState, setMobileState] = useState<MobileOptimization>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isPortrait: false,
    isLandscape: false,
    screenWidth: 0,
    screenHeight: 0,
    isTouchDevice: false,
    isIOS: false,
    isAndroid: false,
  });

  useEffect(() => {
    const updateMobileState = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      // 디바이스 타입 감지
      const isMobile = width <= 768;
      const isTablet = width > 768 && width <= 1024;
      const isDesktop = width > 1024;
      
      // 방향 감지
      const isPortrait = height > width;
      const isLandscape = width > height;
      
      // 터치 디바이스 감지
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // OS 감지
      const userAgent = navigator.userAgent.toLowerCase();
      const isIOS = /iphone|ipad|ipod/.test(userAgent);
      const isAndroid = /android/.test(userAgent);

      setMobileState({
        isMobile,
        isTablet,
        isDesktop,
        isPortrait,
        isLandscape,
        screenWidth: width,
        screenHeight: height,
        isTouchDevice,
        isIOS,
        isAndroid,
      });
    };

    // 초기 실행
    updateMobileState();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', updateMobileState);
    window.addEventListener('orientationchange', updateMobileState);

    return () => {
      window.removeEventListener('resize', updateMobileState);
      window.removeEventListener('orientationchange', updateMobileState);
    };
  }, []);

  return mobileState;
};

// 모바일에서 스크롤 방지 훅
export const usePreventScroll = (prevent: boolean) => {
  useEffect(() => {
    if (prevent) {
      const originalStyle = window.getComputedStyle(document.body).overflow;
      document.body.style.overflow = 'hidden';
      
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [prevent]);
};

// 모바일에서 키보드 이벤트 최적화
export const useMobileKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const height = window.innerHeight;
      const width = window.innerWidth;
      
      // 키보드가 열렸을 때 높이가 줄어드는 것을 감지
      if (width > height && height < 500) {
        setIsKeyboardOpen(true);
      } else {
        setIsKeyboardOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return isKeyboardOpen;
};