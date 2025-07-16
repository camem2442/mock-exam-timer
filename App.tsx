import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ExamScreen from './components/ExamScreen';
import AdPlaceholder from './components/ads/AdPlaceholder';
import { InfoModal } from './components/ui/InfoModal';
import { Button } from './components/ui/Button';
import { Analytics } from '@vercel/analytics/react';

const App: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

  return (
    <>
      <Helmet>
        <title>모의고사 타이머 & 분석기</title>
        <meta name="description" content="실시간으로 모의고사 시간을 측정하고, 문제별 풀이 시간을 기록하며 상세한 분석 리포트를 받아보세요. 수능, 공무원 시험 등 모든 시험에 활용 가능합니다." />
        <meta property="og:title" content="모의고사 타이머 & 분석기" />
        <meta property="og:description" content="실시간 풀이 시간 측정과 상세한 분석으로 시험을 정복하세요." />
        <meta property="og:type" content="website" />
      </Helmet>
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">모의고사 타이머 & 분석기</h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">시간 관리 능력을 극대화하여 최고의 성과를 만드세요.</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setShowInfoModal(true)} 
            className="flex-shrink-0 ml-4"
            aria-label="사용 방법 안내"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Button>
        </div>
        <ExamScreen />
        <AdPlaceholder />
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>문의: camem2442@gmail.com</p>
        </footer>
      </main>
      <Analytics />
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </>
  );
};

export default App;