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
      alert('이미 앱으로 실행 중입니다!');
      return;
    }

    // iOS Safari인 경우 수동 설치 가이드 표시
    if (isIOS) {
      const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
      
      if (isSafari) {
        const message = `📱 홈 화면에 추가하는 방법:

1️⃣ Safari 브라우저 하단의 공유 버튼(□↑)을 탭하세요
2️⃣ "홈 화면에 추가"를 선택하세요
3️⃣ "추가"를 탭하여 설치를 완료하세요

설치 후에는 앱 아이콘을 탭하여 실행할 수 있습니다!`;
        
        alert(message);
      } else {
        alert('iOS에서는 Safari 브라우저를 사용하여 홈 화면에 추가할 수 있습니다.');
      }
      return;
    }

    // Android/Chrome 등에서 자동 설치
    if (!installPromptEvent) {
      alert('이미 앱이 설치되어 있거나, 브라우저에서 지원하지 않습니다.');
      return;
    }

    installPromptEvent.prompt();
    const { outcome } = await installPromptEvent.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the PWA installation');
    } else {
      console.log('User dismissed the PWA installation');
    }

    setInstallPromptEvent(null);
    setCanInstall(false);
  }, [installPromptEvent, isIOS, isStandalone]);

  // iOS에서는 설치 버튼을 항상 표시 (수동 가이드용)
  const shouldShowInstallButton = canInstall || (isIOS && !isStandalone);

  return { 
    canInstall: shouldShowInstallButton, 
    triggerInstallPrompt,
    isIOS,
    isStandalone 
  };
}; 