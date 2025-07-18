import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { type Question } from '../../types';
import { Button } from '../ui/Button';
import ShareSettingsModal from './ShareSettingsModal';
import SharePreviewModal from './SharePreviewModal';
import { siteConfig } from '../../config/site';
import { ResultImage } from '../share/ResultImage'; // ResultImage를 직접 사용하기 위해 import

interface ShareImageButtonProps {
    questions: Question[];
    examName: string;
    totalMinutes?: number;
}

const ShareImageButton: React.FC<ShareImageButtonProps> = ({ questions, examName, totalMinutes }) => {
    // --- State Management ---
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    
    // Share options state
    const [includeGrading, setIncludeGrading] = useState(true);
    const [blurAnswer, setBlurAnswer] = useState(false);

    // 상태 세분화: 이미지 생성 로딩, URL/공유 로딩
    const [isImageLoading, setIsImageLoading] = useState(false);
    const [isUrlLoading, setIsUrlLoading] = useState(false);
    const [isSharing, setIsSharing] = useState(false);

    const [shareUrl, setShareUrl] = useState<string | null>(null);
    const [generatedImageFile, setGeneratedImageFile] = useState<File | null>(null);
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null); // 미리보기용 이미지 URL state 추가
    const [error, setError] = useState<string | null>(null);
    const imageRef = useRef<HTMLDivElement>(null); // DOM 요소를 참조하기 위한 ref

    // --- Handlers ---
    const handleOpenSettings = () => {
        setError(null);
        setShareUrl(null);
        setGeneratedImageFile(null);
        setShowSettingsModal(true);
    };
    
    const handleCloseSettings = () => setShowSettingsModal(false);

    const handlePreview = async () => {
        setShowSettingsModal(false);
        setShowPreviewModal(true);

        // 이미 생성된 결과가 있다면 건너뜁니다.
        if (shareUrl && generatedImageFile) {
            return;
        }

        setIsImageLoading(true);
        setIsUrlLoading(false); // URL 로딩 상태 초기화
        setError(null);
        setShareUrl(null); // 이전 URL 초기화

        // 잠시 기다려 숨겨진 ResultImage가 렌더링될 시간을 줍니다.
        await new Promise(resolve => setTimeout(resolve, 100));

        if (!imageRef.current) {
            setError('이미지 생성에 필요한 요소를 찾지 못했습니다.');
            setIsImageLoading(false);
            return;
        }

        try {
            // 1. html-to-image를 사용하여 클라이언트 사이드에서 이미지 생성
            const dataUrl = await htmlToImage.toPng(imageRef.current, { 
                cacheBust: true,
                pixelRatio: 2,
            });
            
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], 'result.png', { type: 'image/png' });
            
            setGeneratedImageFile(file);
            setPreviewImageUrl(dataUrl);
            setIsImageLoading(false); // 이미지 로딩 완료
            
            // 2. 백그라운드에서 DB 저장 및 공유 링크 생성 시작
            setIsUrlLoading(true);
            fetch('/api/save-result', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    questions, 
                    examName: examName, // Use prop directly
                    totalMinutes, 
                    includeGrading, 
                    blurAnswer 
                }),
            })
            .then(response => {
                if (!response.ok) throw new Error('공유 링크 생성에 실패했습니다.');
                return response.json();
            })
            .then(data => {
                const newShareUrl = `${siteConfig.domain}/share/${data.id}`;
                setShareUrl(newShareUrl);
            })
            .catch(err => {
                setError(err.message || '링크 생성 중 오류가 발생했습니다.');
            })
            .finally(() => {
                setIsUrlLoading(false); // URL 로딩 완료 (성공 또는 실패)
            });

        } catch (err) {
            setError(err instanceof Error ? err.message : '알 수 없는 오류로 이미지 생성에 실패했습니다.');
            setIsImageLoading(false);
        }
    };
    
    const handleShare = async () => {
        if (!shareUrl || !generatedImageFile) {
            alert("아직 공유할 이미지가 준비되지 않았습니다. 잠시만 기다려주세요.");
            return;
        }
        setIsSharing(true);
        try {
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [generatedImageFile] })) {
                await navigator.share({
                    title: `${examName} 시험 결과 - ${siteConfig.title}`,
                    text: `${examName} 시험 결과 - ${siteConfig.title}`,
                    url: shareUrl,
                    files: [generatedImageFile],
                });
            } else {
                const downloadUrl = window.URL.createObjectURL(generatedImageFile);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = `mock-exam-result-${examName || 'image'}.png`;
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(downloadUrl);
            }
        } catch (error) {
            if ((error as Error).name !== 'AbortError') {
                 alert(`공유 오류: ${error instanceof Error ? error.message : String(error)}`);
            }
        } finally {
            setIsSharing(false);
        }
    };

    const handleClosePreview = () => setShowPreviewModal(false);

    const handleBackToSettings = () => {
        setShowPreviewModal(false);
        setShowSettingsModal(true);
    };

    return (
        <>
            <Button onClick={handleOpenSettings} variant="secondary" size="md" className="w-full sm:w-auto">
                결과 공유하기
            </Button>
            
            {/* 이미지 생성을 위한 보이지 않는 렌더링 영역 */}
            <div style={{ position: 'fixed', left: '-9999px', top: '-9999px' }}>
                <div ref={imageRef}>
                    <ResultImage
                        questions={questions}
                        examName={examName} // Use prop directly
                        totalMinutes={totalMinutes}
                        includeGrading={includeGrading}
                        blurAnswer={blurAnswer}
                    />
                </div>
            </div>

            <ShareSettingsModal
                isOpen={showSettingsModal}
                onClose={handleCloseSettings}
                onPreview={handlePreview}
                includeGrading={includeGrading}
                setIncludeGrading={setIncludeGrading}
                blurAnswer={blurAnswer}
                setBlurAnswer={setBlurAnswer}
            />

            <SharePreviewModal
                isOpen={showPreviewModal}
                onClose={handleClosePreview}
                onBackToSettings={handleBackToSettings}
                previewImageUrl={previewImageUrl}
                isLoading={isImageLoading} // 이미지 로딩 상태 전달
                isUrlLoading={isUrlLoading} // URL 로딩 상태 전달
                isSharing={isSharing}
                shareUrl={shareUrl}
                error={error}
                handleShare={handleShare}
                handleCopyLink={() => {
                    if (shareUrl) navigator.clipboard.writeText(shareUrl);
                }}
            />
        </>
    );
};

export default ShareImageButton; 