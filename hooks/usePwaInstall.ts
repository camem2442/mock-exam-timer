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
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isSafari) {
        setShowIOSGuide(true);
        return { type: 'ios-guide' as const };
      } else {
        return { type: 'ios-unsupported' as const };
      }
    }

    // Android/Chrome 등에서 자동 설치
    if (!installPromptEvent) {
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

  // iOS에서는 설치 버튼을 항상 표시 (수동 가이드용)
  const shouldShowInstallButton = canInstall || (isIOS && !isStandalone);

  return { 
    canInstall: shouldShowInstallButton, 
    triggerInstallPrompt,
    isIOS,
    isStandalone,
    showIOSGuide,
    closeIOSGuide
  };
}; 