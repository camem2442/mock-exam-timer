import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import * as htmlToImage from 'html-to-image';
import { ResultImage } from '../share/ResultImage';
import { ResultImageDisplay } from '../share/ResultImageDisplay';
import { type Question } from '../../types';
import { Spinner } from '../ui/Spinner';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';
import SharePreviewModal from '../share/SharePreviewModal';
import { useCopyToClipboard } from '../../hooks/useCopyToClipboard';

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
    const [isSharing, setIsSharing] = useState(false);
    const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    
    // 클립보드 복사 훅 사용
    const { copy, isCopied, error: copyError } = useCopyToClipboard();

    const imageRef = useRef<HTMLDivElement>(null);
    const shareUrl = window.location.href;
    const pageTitle = resultData ? `${resultData.examName} 시험 결과` : '시험 결과';

    useEffect(() => {
        return () => {
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
        };
    }, [previewImageUrl]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            if (mediaQuery.matches) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };
        handleChange();
        mediaQuery.addEventListener('change', handleChange);
        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    const handleCopyLink = () => {
        copy(shareUrl);
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
            
            // 기존 URL이 있다면 해제
            if (previewImageUrl) {
                URL.revokeObjectURL(previewImageUrl);
            }
            const blob = await (await fetch(dataUrl)).blob();
            const objectUrl = URL.createObjectURL(blob);
            setPreviewImageUrl(objectUrl);

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
            if (!previewImageUrl) {
                throw new Error("이미지 URL이 없습니다.");
            }
            const response = await fetch(previewImageUrl);
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
        <div className="min-h-screen bg-background py-10">
            <Helmet>
                <title>{pageTitle} - {siteConfig.title}</title>
                <meta name="description" content={`${pageTitle}를 확인하고 공유해보세요.`} />
            </Helmet>

            <div className="text-center mb-8">
                <Link to="/" className="text-2xl font-bold text-brand hover:underline">
                    {siteConfig.title}
                </Link>
                <p className="text-muted-foreground">시간 관리 능력을 극대화하여 최고의 성과를 만드세요.</p>
            </div>

            {loading && <div className="flex justify-center"><Spinner /></div>}
            {error && (
                <div className="text-center text-destructive bg-destructive/10 p-6 rounded-lg mx-4">
                    <h2 className="text-xl font-bold mb-2">오류</h2>
                    <p>{error}</p>
                    <Button onClick={() => window.location.href = siteConfig.domain} className="mt-4">
                        홈으로 돌아가기
                    </Button>
                </div>
            )}
            {resultData && (
                <div className="flex justify-center px-4">
                    <ResultImageDisplay
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
                        {isCopied ? '✓ 복사 완료!' : '링크 복사'}
                    </Button>
                    <Button onClick={generateAndShowPreview} className="flex-1">
                        {isSharing ? <Spinner /> : '공유하기'}
                    </Button>
                </div>
                {copyError && (
                    <p className="text-sm text-destructive">{copyError}</p>
                )}
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary hover:underline">
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
                    examName={resultData?.examName}
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