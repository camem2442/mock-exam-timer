import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ExamScreen from './components/ExamScreen';
import AdPlaceholder from './components/ads/AdPlaceholder';
import { InfoModal } from './components/ui/InfoModal';
import { Button } from './components/ui/Button';
import { Analytics } from '@vercel/analytics/react';
import { siteConfig } from './config/site';
import { GuidePage } from './components/pages/GuidePage';
import { ChangelogPage } from './components/pages/ChangelogPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';

// 네비게이션 컴포넌트
const Navigation: React.FC = () => {
  const location = useLocation();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className="flex items-center justify-between mb-8">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">
          {location.pathname === '/' ? siteConfig.title : (
            <Link to="/" className="hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
              {siteConfig.title}
            </Link>
          )}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2">
          {location.pathname === '/' ? '시간 관리 능력을 극대화하여 최고의 성과를 만드세요.' : '메인으로 돌아가려면 제목을 클릭하세요.'}
        </p>
      </div>
      <div className="flex items-center gap-2">
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 z-50">
              <div className="py-2">
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
    </div>
  );
};

// 메인 페이지 컴포넌트
const HomePage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>{siteConfig.title}</title>
        <meta name="description" content={siteConfig.description} />
        <meta name="keywords" content={siteConfig.keywords} />
        <meta property="og:title" content={siteConfig.social.og.title} />
        <meta property="og:description" content={siteConfig.social.og.description} />
        <meta property="og:type" content={siteConfig.social.og.type} />
        <meta property="og:url" content={siteConfig.domain} />
        <meta name="twitter:card" content={siteConfig.social.twitter.card} />
        <meta name="twitter:title" content={siteConfig.social.twitter.title} />
        <meta name="twitter:description" content={siteConfig.social.twitter.description} />
      </Helmet>
      <Navigation />
      <ExamScreen />
      <AdPlaceholder />
      <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/guide" className="text-primary-600 dark:text-primary-400 hover:underline">
            사용 방법
          </Link>
          <Link to="/changelog" className="text-primary-600 dark:text-primary-400 hover:underline">
            업데이트 기록
          </Link>
          <Link to="/contact" className="text-primary-600 dark:text-primary-400 hover:underline">
            문의
          </Link>
          <Link to="/faq" className="text-primary-600 dark:text-primary-400 hover:underline">
            자주 묻는 질문
          </Link>
        </div>
        <p>문의 : {siteConfig.contact.email} | © {siteConfig.copyright.year} {siteConfig.copyright.name}</p>
      </footer>
    </>
  );
};

// 가이드 페이지 컴포넌트
const GuidePageWrapper: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>사용 방법 안내 - {siteConfig.title}</title>
        <meta name="description" content="모의고사 타이머 & 분석기의 상세한 사용 방법을 안내합니다. 시험 설정부터 결과 분석까지 단계별로 설명합니다." />
        <meta name="keywords" content="모의고사 타이머 사용법, 시험 타이머 사용법, 문제풀이 타이머 가이드, 시험 준비 도구 사용법" />
        <meta property="og:title" content={`사용 방법 안내 - ${siteConfig.title}`} />
        <meta property="og:description" content="모의고사 타이머 & 분석기의 상세한 사용 방법을 안내합니다." />
        <meta property="og:url" content={`${siteConfig.domain}/guide`} />
      </Helmet>
      <GuidePage />
    </>
  );
};

// 업데이트 기록 페이지 컴포넌트
const ChangelogPageWrapper: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>업데이트 기록 - {siteConfig.title}</title>
        <meta name="description" content="모의고사 타이머 & 분석기의 버전별 업데이트 기록과 개발 로드맵을 확인하세요." />
        <meta name="keywords" content="모의고사 타이머 업데이트, 시험 타이머 버전, 문제풀이 타이머 변경사항" />
        <meta property="og:title" content={`업데이트 기록 - ${siteConfig.title}`} />
        <meta property="og:description" content="모의고사 타이머 & 분석기의 버전별 업데이트 기록을 확인하세요." />
        <meta property="og:url" content={`${siteConfig.domain}/changelog`} />
      </Helmet>
      <ChangelogPage />
    </>
  );
};

// 문의 페이지 컴포넌트
const ContactPageWrapper: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>문의 및 피드백 - {siteConfig.title}</title>
        <meta name="description" content="모의고사 타이머 & 분석기에 대한 문의사항이나 피드백을 보내주세요. 자주 묻는 질문과 답변도 확인할 수 있습니다." />
        <meta name="keywords" content="모의고사 타이머 문의, 시험 타이머 피드백, 문제풀이 타이머 FAQ, 고객 지원" />
        <meta property="og:title" content={`문의 및 피드백 - ${siteConfig.title}`} />
        <meta property="og:description" content="모의고사 타이머 & 분석기에 대한 문의사항이나 피드백을 보내주세요." />
        <meta property="og:url" content={`${siteConfig.domain}/contact`} />
      </Helmet>
      <ContactPage />
    </>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/guide" element={<GuidePageWrapper />} />
          <Route path="/changelog" element={<ChangelogPageWrapper />} />
          <Route path="/contact" element={<ContactPageWrapper />} />
          <Route path="/faq" element={<FAQPage />} />
        </Routes>
      </main>
      <Analytics />
    </Router>
  );
};

export default App;