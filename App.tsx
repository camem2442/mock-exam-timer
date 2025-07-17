import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ExamScreen from './components/ExamScreen';
import AdPlaceholder from './components/ads/AdPlaceholder';
import { InfoModal } from './components/ui/InfoModal';
import { Button } from './components/ui/Button';
import { Analytics } from '@vercel/analytics/react';
import { siteConfig } from './config/site';

const App: React.FC = () => {
  const [showInfoModal, setShowInfoModal] = useState(false);

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
      <main className="container mx-auto p-4 sm:p-6 lg:p-8 font-sans">
        <div className="flex items-center justify-between mb-8">
                      <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-primary-600 dark:text-primary-400">{siteConfig.title}</h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">시간 관리 능력을 극대화하여 최고의 성과를 만드세요.</p>
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
          </div>
        </div>
        <ExamScreen />
        <AdPlaceholder />
        <footer className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
          <p>문의 : {siteConfig.contact.email} | © {siteConfig.copyright.year} {siteConfig.copyright.name}</p>
        </footer>
      </main>
      <Analytics />
      <InfoModal isOpen={showInfoModal} onClose={() => setShowInfoModal(false)} />
    </>
  );
};

export default App;