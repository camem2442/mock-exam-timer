import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as htmlToImage from 'html-to-image';
import { ResultImage } from '../share/ResultImage';
import { type Question } from '../../types';
import { Spinner } from '../ui/Spinner';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';
import SharePreviewModal from '../share/SharePreviewModal';

interface SharedResultData {
    questions: Question[];
    examName: string;
    totalMinutes?: number;
    includeGrading: boolean;
    blurAnswer: boolean;
}

const SharePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [resultData, setResultData] = useState<SharedResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

    const imageRef = useRef<HTMLDivElement>(null);
    const shareUrl = window.location.href;
    const pageTitle = resultData ? `${resultData.examName} 시험 결과` : '시험 결과';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        });
    };

    const generateAndShowPreview = async () => {
        setIsPreviewModalOpen(true);
        setIsSharing(true);
        setPreviewImageUrl(null);

        await new Promise(resolve => setTimeout(resolve, 100));

        if (!imageRef.current) {
            setError('이미지 생성에 필요한 요소를 찾을 수 없습니다.');
            setIsSharing(false);
            return;
        }

        try {
            const dataUrl = await htmlToImage.toPng(imageRef.current, { cacheBust: true });
            setPreviewImageUrl(dataUrl);
        } catch (err) {
            console.error('oops, something went wrong!', err);
            setError('이미지 생성 중 오류가 발생했습니다.');
        } finally {
            setIsSharing(false);
        }
    };

    const handleNativeShare = async () => {
        if (!navigator.share) {
            alert('이 브라우저에서는 공유하기 기능을 지원하지 않습니다.');
            return;
        }

        setIsSharing(true);

        try {
            const response = await fetch(previewImageUrl!);
            const blob = await response.blob();
            const file = new File([blob], `${pageTitle}.png`, { type: blob.type });

            const shareText = `${pageTitle} - ${siteConfig.title}\n\n${shareUrl}`;

            await navigator.share({
                title: pageTitle,
                text: shareText,
                url: shareUrl,
                files: [file],
            });
        } catch (error) {
            console.error('Share failed:', error);
        } finally {
            setIsSharing(false);
        }
    };


    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('잘못된 접근입니다. 공유 ID가 없습니다.');
            return;
        }

        const fetchResult = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/get-result?id=${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('존재하지 않는 결과 페이지입니다.');
                    }
                    throw new Error('결과를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setResultData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
            <Helmet>
                <title>{pageTitle} - {siteConfig.title}</title>
                <meta name="description" content={`${pageTitle}를 확인하고 공유해보세요.`} />
            </Helmet>

            <div className="text-center mb-8">
                <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:underline">
                    {siteConfig.title}
                </Link>
                <p className="text-slate-500 dark:text-slate-400">나만의 시험 분석 파트너</p>
            </div>

            {loading && <Spinner />}
            {error && (
                <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">오류</h2>
                    <p>{error}</p>
                    <Button onClick={() => window.location.href = siteConfig.domain} className="mt-4">
                        홈으로 돌아가기
                    </Button>
                </div>
            )}
            {resultData && (
                 <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 mobile-scale-wrapper">
                    <ResultImage
                        questions={resultData.questions}
                        examName={resultData.examName}
                        totalMinutes={resultData.totalMinutes}
                        includeGrading={resultData.includeGrading}
                        blurAnswer={resultData.blurAnswer}
                    />
                </div>
            )}

            <div className="mt-8 flex flex-col items-center gap-4">
                <div className="flex w-full max-w-sm gap-2">
                    <Button onClick={handleCopyLink} variant="outline" className="flex-1">
                        {isCopied ? '복사 완료!' : '링크 복사'}
                    </Button>
                    <Button onClick={generateAndShowPreview} className="flex-1">
                        {isSharing ? <Spinner /> : '공유하기'}
                    </Button>
                </div>
                <Link to="/" className="text-sm text-slate-500 hover:text-primary-500 hover:underline">
                    새로운 시험 시작하기
                </Link>
            </div>

            {isPreviewModalOpen && (
                 <SharePreviewModal
                    isOpen={isPreviewModalOpen}
                    onClose={() => setIsPreviewModalOpen(false)}
                    onBackToSettings={() => {}} // This page has no settings
                    previewImageUrl={previewImageUrl}
                    isLoading={isSharing && !previewImageUrl}
                    isUrlLoading={false} // URL is already available
                    isSharing={isSharing}
                    shareUrl={shareUrl}
                    error={error}
                    handleShare={handleNativeShare}
                    handleCopyLink={handleCopyLink}
                    showSettingsButton={false}
                />
            )}

            {/* Hidden element for image generation */}
            {resultData && (
                <div style={{ position: 'fixed', left: '-9999px', top: 0 }}>
                    <ResultImage ref={imageRef} {...resultData} />
                </div>
            )}
        </div>
    );
};

export default SharePage; 