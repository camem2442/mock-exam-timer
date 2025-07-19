import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const usePwaInstall = () => {
  const [installPromptEvent, setInstallPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  useEffect(() => {
    // iOS 감지
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // 이미 PWA로 실행 중인지 확인
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches || 
                            (window.navigator as any).standalone === true;
    setIsStandalone(isStandaloneMode);

    // PWA가 이미 설치되어 있거나 iOS가 아닌 경우에만 beforeinstallprompt 이벤트 처리
    if (!isStandaloneMode && !isIOSDevice) {
      const handleBeforeInstallPrompt = (event: Event) => {
        event.preventDefault();
        setInstallPromptEvent(event as BeforeInstallPromptEvent);
        setCanInstall(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }
  }, []);

  const triggerInstallPrompt = useCallback(async () => {
    // 이미 PWA로 실행 중인 경우
    if (isStandalone) {
      return { type: 'already-installed' as const };
    }

    // iOS Safari인 경우 수동 설치 가이드 표시
    if (isIOS) {
      setShowIOSGuide(true);
      return { type: 'ios-guide' as const };
    }

    // Android/Chrome 등에서 자동 설치
    if (!installPromptEvent) {
      alert('현재 사용 중인 브라우저에서는 자동 설치를 지원하지 않습니다.\nChrome 브라우저를 사용하면 앱처럼 설치하여 더 편리하게 이용할 수 있습니다.');
      return { type: 'not-supported' as const };
    }

    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA installation');
      setInstallPromptEvent(null);
      setCanInstall(false);
      return { type: 'accepted' as const };
    } else {
      console.log('User dismissed the PWA installation');
      setInstallPromptEvent(null);
      setCanInstall(false);
      return { type: 'dismissed' as const };
    }
  }, [installPromptEvent, isIOS, isStandalone]);

  const closeIOSGuide = useCallback(() => {
    setShowIOSGuide(false);
  }, []);

  // 설치 버튼은 이미 설치된 상태가 아니라면 항상 표시
  const shouldShowInstallButton = !isStandalone;

  return { 
    canInstall: shouldShowInstallButton, 
    triggerInstallPrompt,
    isIOS,
    isStandalone,
    showIOSGuide,
    closeIOSGuide
  };
}; 