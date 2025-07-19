import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InfoModal } from '../ui/InfoModal';
import { IOSInstallGuideModal } from '../ui/IOSInstallGuideModal';
import { DesktopInstallGuideModal } from '../ui/DesktopInstallGuideModal';
import { Button } from '../ui/Button';
import { siteConfig } from '../../config/site';
import { usePwaInstall } from '../../hooks/usePwaInstall';
import { useTheme } from '../../hooks/useTheme';
import { ToggleSwitch } from '../ui/ToggleSwitch';

interface NavigationProps {
  scale: number;
  setScale: React.Dispatch<React.SetStateAction<number>>;
}

export const Navigation: React.FC<NavigationProps> = ({ scale, setScale }) => {
    const location = useLocation();
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { canInstall, triggerInstallPrompt, isIOS, showIOSGuide, closeIOSGuide, showDesktopGuide, closeDesktopGuide } = usePwaInstall();
    const { theme, toggleTheme } = useTheme();

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
      <div className="flex flex-col gap-4 mb-8">
        {/* Top row: Title and action icons */}
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1
              className="font-bold text-brand truncate"
              style={{ fontSize: 'clamp(1.2rem, 6vw, 2.25rem)' }}
              title={siteConfig.title}
            >
              {location.pathname === '/' ? (
                <>
                  <span className="sm:hidden">MockTimer</span>
                  <span className="hidden sm:inline">{siteConfig.title}</span>
                </>
              ) : (
                <Link to="/" className="hover:opacity-80 transition-opacity">
                  <span className="sm:hidden">MockTimer</span>
                  <span className="hidden sm:inline">{siteConfig.title}</span>
                </Link>
              )}
            </h1>
            <p className="hidden sm:block text-muted-foreground mt-2">
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
                <div className="absolute right-0 mt-2 w-56 bg-card rounded-lg shadow-lg border border-border z-50">
                  <div className="py-2">
                    <Link 
                      to="/guide" 
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>사용 방법</span>
                      </span>
                    </Link>
                    <Link 
                      to="/changelog" 
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>업데이트 기록</span>
                      </span>
                    </Link>
                    <Link 
                      to="/faq" 
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>자주 묻는 질문</span>
                      </span>
                    </Link>
                    <Link 
                      to="/contact" 
                      onClick={() => setShowMenu(false)}
                      className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                    >
                      <span className="flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span>문의하기</span>
                      </span>
                    </Link>
                    {canInstall && (
                      <button
                        onClick={async () => {
                          await triggerInstallPrompt();
                          setShowMenu(false);
                        }}
                        className="w-full text-left block px-4 py-2 text-sm text-foreground hover:bg-accent transition-colors"
                      >
                        <span className="flex items-center gap-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V8" />
                          </svg>
                          <span>{isIOS ? '홈 화면에 추가 (iOS)' : '홈 화면에 추가'}</span>
                        </span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-b border-border"></div>

        {/* Bottom row: Controls */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 h-8">
            <span className="text-sm font-medium text-muted-foreground">다크 모드</span>
            <ToggleSwitch enabled={theme === 'dark'} onChange={toggleTheme} />
          </div>
          <div className="flex items-center gap-2 h-8">
            <span className="text-sm font-medium text-muted-foreground">화면 배율</span>
            <div className="flex items-center bg-muted rounded-full overflow-hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleScaleChange('decrease')}
                aria-label="화면 축소"
                className="text-muted-foreground hover:text-foreground !w-6 !h-6 !p-0 flex items-center justify-center"
              >
                <span className="leading-none text-lg">−</span>
              </Button>
              <span className="text-xs font-semibold text-foreground px-2 tabular-nums whitespace-nowrap">
                {scale}%
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleScaleChange('increase')}
                aria-label="화면 확대"
                className="text-muted-foreground hover:text-foreground !w-6 !h-6 !p-0 flex items-center justify-center"
              >
                <span className="leading-none text-lg">+</span>
              </Button>
            </div>
          </div>
        </div>
        <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
        <IOSInstallGuideModal isOpen={showIOSGuide} onClose={closeIOSGuide} />
        <DesktopInstallGuideModal isOpen={showDesktopGuide} onClose={closeDesktopGuide} />
      </div>
    );
  }; 