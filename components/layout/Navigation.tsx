import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InfoModal } from '../ui/InfoModal';
import { IOSInstallGuideModal } from '../ui/IOSInstallGuideModal';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/site';
import { usePwaInstall } from '../../hooks/usePwaInstall';

interface NavigationProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

export const Navigation: React.FC<NavigationProps> = ({ scale, setScale }) => {
    const location = useLocation();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { canInstall, triggerInstallPrompt, isIOS, isStandalone, showIOSGuide, closeIOSGuide } = usePwaInstall();

    const handleScaleChange = (direction: 'increase' | 'decrease') => {
      setScale(prevScale => {
        const newScale = direction === 'increase' ? prevScale + 10 : prevScale - 10;
        return Math.max(50, Math.min(150, newScale)); // 50% ~ 150%
      });
    };
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
          setShowMenu(false);
        }
      };
  
      if (showMenu) {
        document.addEventListener('mousedown', handleClickOutside);
      }
  
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [showMenu]);
  
    return (
          <div className="flex items-center justify-between mb-8 gap-4">
            <div className="min-w-0">
          <h1
            className="font-bold text-primary-600 dark:text-primary-400 truncate"
            style={{ fontSize: 'clamp(1.2rem, 6vw, 2.25rem)' }}
            title={siteConfig.title}
          >
            {location.pathname === '/' ? (
              <>
                <span className="sm:hidden">MockTimer</span>
                <span className="hidden sm:inline">{siteConfig.title}</span>
              </>
            ) : (
              <Link to="/" className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                <span className="sm:hidden">MockTimer</span>
                <span className="hidden sm:inline">{siteConfig.title}</span>
              </Link>
            )}
          </h1>
          <p className="hidden sm:block text-slate-600 dark:text-slate-400 mt-2">
            {location.pathname === '/' ? '모의고사 타이머 & 채점·분석기 : 시간 관리 능력을 극대화하여 최고의 성과를 만드세요.' : '메인으로 돌아가려면 제목을 클릭하세요.'}
          </p>
            </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={async () => {
              const shareText = `${siteConfig.title}\n\n${siteConfig.description}\n\n${siteConfig.domain}`;
              if (navigator.share) {
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
                try {
                  await navigator.clipboard.writeText(shareText);
                  alert('공유 텍스트가 클립보드에 복사되었습니다!');
                } catch (error) {
                  alert('공유 텍스트 복사에 실패했습니다.');
                }
              }
            }}
            className="flex-shrink-0"
            aria-label="서비스 공유"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </Button>
          
          {/* 화면 배율 캡슐 */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleScaleChange('decrease')}
              aria-label="화면 축소"
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 !w-8 !h-8 !p-0 flex items-center justify-center"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              <span className="leading-none">−</span>
            </Button>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-2 tabular-nums whitespace-nowrap" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
              {scale}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleScaleChange('increase')}
              aria-label="화면 확대"
              className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 !w-8 !h-8 !p-0 flex items-center justify-center"
              style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
            >
              <span className="leading-none">+</span>
            </Button>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowInfoModal(true)} 
            className="flex-shrink-0"
            aria-label="사용 방법 안내"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
          <div className="relative" ref={menuRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowMenu(!showMenu)} 
              className="flex-shrink-0"
              aria-label="메뉴"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
                <div className="p-3 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                      화면 배율
                    </span>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-700/50 rounded-full overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleScaleChange('decrease')}
                        aria-label="화면 축소"
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 !w-8 !h-8 !p-0 flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                      >
                        <span className="leading-none">−</span>
                      </Button>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-2 tabular-nums whitespace-nowrap" style={{ fontSize: 'clamp(0.75rem, 1.8vw, 0.875rem)' }}>
                        {scale}%
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleScaleChange('increase')}
                        aria-label="화면 확대"
                        className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 !w-8 !h-8 !p-0 flex items-center justify-center"
                        style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}
                      >
                        <span className="leading-none">+</span>
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="py-2">
                  {canInstall && (
                    <button
                      onClick={async () => {
                        const result = await triggerInstallPrompt();
                        setShowMenu(false);
                        
                        // 결과에 따른 처리
                        if (result?.type === 'already-installed') {
                          alert('이미 앱으로 실행 중입니다!');
                        } else if (result?.type === 'not-supported') {
                          alert('이미 앱이 설치되어 있거나, 브라우저에서 지원하지 않습니다.');
                        } else if (result?.type === 'ios-unsupported') {
                          alert('iOS에서는 Safari 브라우저를 사용하여 홈 화면에 추가할 수 있습니다.');
                        }
                      }}
                      className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    >
                      {isIOS ? '📱 홈 화면에 추가 (iOS)' : '📲 홈 화면에 추가'}
                    </button>
                  )}
                  <Link 
                    to="/guide" 
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    📖 사용 방법
                  </Link>
                  <Link 
                    to="/changelog" 
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    📝 업데이트 기록
                  </Link>
                  <Link 
                    to="/faq" 
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    ❓ 자주 묻는 질문
                  </Link>
                  <Link 
                    to="/contact" 
                    onClick={() => setShowMenu(false)}
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    📧 문의하기
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
        <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
        <IOSInstallGuideModal isOpen={showIOSGuide} onClose={closeIOSGuide} />
      </div>
    );
  }; 