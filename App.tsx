import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ExamScreen from './components/ExamScreen';
import AdPlaceholder from './components/ads/AdPlaceholder';
import { Analytics } from '@vercel/analytics/react';
import { siteConfig } from './config/site';
import { GuidePage } from './components/pages/GuidePage';
import { ChangelogPage } from './components/pages/ChangelogPage';
import { ContactPage } from './components/pages/ContactPage';
import { FAQPage } from './components/pages/FAQPage';
import SharePage from './components/pages/SharePage';
import { Navigation } from './components/layout/Navigation';
import { useTheme } from './hooks/useTheme';
import { PrivacyPolicyPage } from './components/pages/PrivacyPolicyPage';

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
        <ExamScreen />
        <AdPlaceholder />
        <footer className="text-center mt-8 text-sm text-muted-foreground">
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          <Link to="/guide" className="text-primary hover:underline">
            사용 방법
          </Link>
          <Link to="/changelog" className="text-primary hover:underline">
            업데이트 기록
          </Link>
          <Link to="/contact" className="text-primary hover:underline">
            문의
          </Link>
          <Link to="/faq" className="text-primary hover:underline">
            자주 묻는 질문
          </Link>
          <Link to="/privacy" className="text-primary hover:underline">
            개인정보 처리방침
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
        <meta name="description" content="MockTimer의 상세한 사용 방법을 안내합니다. 시험 설정부터 결과 분석까지 단계별로 설명합니다." />
        <meta name="keywords" content="MockTimer 사용법, 시험 타이머 사용법, 문제풀이 타이머 가이드, 시험 준비 도구 사용법" />
        <meta property="og:title" content={`사용 방법 안내 - ${siteConfig.title}`} />
        <meta property="og:description" content="MockTimer의 상세한 사용 방법을 안내합니다." />
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
        <meta name="description" content="MockTimer의 버전별 업데이트 기록과 개발 로드맵을 확인하세요." />
        <meta name="keywords" content="MockTimer 업데이트, 시험 타이머 버전, 문제풀이 타이머 변경사항" />
        <meta property="og:title" content={`업데이트 기록 - ${siteConfig.title}`} />
        <meta property="og:description" content="MockTimer의 버전별 업데이트 기록을 확인하세요." />
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
        <meta name="description" content="MockTimer에 대한 문의사항이나 피드백을 보내주세요. 자주 묻는 질문과 답변도 확인할 수 있습니다." />
        <meta name="keywords" content="MockTimer 문의, 시험 타이머 피드백, 문제풀이 타이머 FAQ, 고객 지원" />
        <meta property="og:title" content={`문의 및 피드백 - ${siteConfig.title}`} />
        <meta property="og:description" content="MockTimer에 대한 문의사항이나 피드백을 보내주세요." />
        <meta property="og:url" content={`${siteConfig.domain}/contact`} />
      </Helmet>
      <ContactPage />
    </>
  );
};

const FAQPageWrapper: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>자주 묻는 질문 - {siteConfig.title}</title>
        <meta name="description" content="MockTimer 사용자들이 자주 묻는 질문과 답변을 모았습니다. 궁금한 점이 있다면 먼저 확인해보세요." />
        <meta property="og:title" content={`자주 묻는 질문 - ${siteConfig.title}`} />
        <meta property="og:description" content="MockTimer 사용자들이 자주 묻는 질문과 답변을 모았습니다." />
        <meta property="og:url" content={`${siteConfig.domain}/faq`} />
      </Helmet>
      <FAQPage />
    </>
  );
};

const AppContent: React.FC = () => {
  const [scale, setScale] = useState(100);
  const location = useLocation();
  const isSharePage = location.pathname.startsWith('/share/');
  useTheme();

  useEffect(() => {
    document.documentElement.style.fontSize = `${scale}%`;
  }, [scale]);

  return (
    <main className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
      {!isSharePage && <Navigation scale={scale} setScale={setScale} />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/guide" element={<GuidePageWrapper />} />
        <Route path="/changelog" element={<ChangelogPageWrapper />} />
        <Route path="/contact" element={<ContactPageWrapper />} />
        <Route path="/faq" element={<FAQPageWrapper />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/share/:id" element={<SharePage />} />
      </Routes>
      <Analytics />
    </main>
  );
}

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;