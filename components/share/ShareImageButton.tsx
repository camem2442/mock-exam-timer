import React, { useState, useRef } from 'react';
import { type Question } from '../../types';
import { Button } from '../ui/Button';
import * as htmlToImage from 'html-to-image';
import { ResultImage } from './ResultImage';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Spinner } from '../ui/Spinner';

interface ShareImageButtonProps {
    questions: Question[];
    examName: string;
    totalMinutes?: number;
}

const ShareImageButton: React.FC<ShareImageButtonProps> = ({ questions, examName, totalMinutes }) => {
    const [showShareImageModal, setShowShareImageModal] = useState(false);
    const [showPreviewModal, setShowPreviewModal] = useState(false);
    const [shareExamName, setShareExamName] = useState(examName);
    const [includeGrading, setIncludeGrading] = useState(true);
    const [blurAnswer, setBlurAnswer] = useState(false);
    const previewRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showDownloadNotice, setShowDownloadNotice] = useState(false);

    const handlePreviewImage = () => {
        setShowShareImageModal(false);
        setShowPreviewModal(true);
    };

    const handleShareImage = async () => {
        alert('[디버그] 공유하기 버튼 클릭\n' + JSON.stringify({
            shareExamName,
            includeGrading,
            blurAnswer,
            totalMinutes
        }, null, 2));
        if (!previewRef.current) {
            alert('[디버그] 미리보기 영역(previewRef)가 null입니다.');
            return;
        }
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 100)); // 렌더 타이밍 여유
            alert('[디버그] html-to-image 변환 시작');
            const blob = await htmlToImage.toBlob(previewRef.current, {
                pixelRatio: 2,
                // useCORS: true, // 필요시 활성화
            });
            if (!blob) {
                alert('[디버그] Blob 생성 실패 (html-to-image 변환 실패)');
                setIsLoading(false);
                return;
            }
            alert('[디버그] 이미지 Blob 생성 성공');
            const file = new File([blob], `${shareExamName || '시험결과'}.png`, { type: blob.type });

            // 모바일/데스크톱/맥 사파리 환경 분기
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isMacSafari = /Macintosh.*Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            if (isMobile && !isMacSafari && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
                alert('[디버그] Web Share API 지원, 공유 시도');
                try {
                    await navigator.share({ files: [file], title: shareExamName || '시험결과' });
                    alert('[디버그] Web Share API 공유 성공');
                } catch (e) {
                    // 공유 실패 시 다운로드로 폴백
                    triggerDownload(blob, file);
                }
            } else {
                triggerDownload(blob, file);
            }
        } catch (error) {
            let errorMsg = '';
            if (error instanceof Error) {
                errorMsg = error.stack || error.message;
            } else if (typeof error === 'object' && error !== null) {
                errorMsg = Object.entries(error)
                  .map(([k, v]) => `${k}: ${String(v)}`)
                  .join('\n');
            } else {
                errorMsg = String(error);
            }
            alert('[디버그] 이미지 공유/생성 중 오류 발생: ' + errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    function triggerDownload(blob: Blob, file: File) {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${file.name}`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      setShowDownloadNotice(true);
      setTimeout(() => setShowDownloadNotice(false), 2500);
    }

    return (
        <>
            {/* 메인 버튼 */}
            <Button 
                onClick={() => setShowShareImageModal(true)} 
                variant="secondary" 
                className="w-full sm:w-auto"
            >
                이미지로 공유 (베타)
            </Button>

            {/* 설정 모달 */}
            {showShareImageModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl p-6 w-full max-w-sm mx-auto">
                        <h3 className="text-lg font-bold mb-4 text-center">이미지로 공유</h3>
                        
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                    시험 이름
                                </label>
                                <input
                                    type="text"
                                    value={shareExamName}
                                    onChange={(e) => setShareExamName(e.target.value)}
                                    placeholder="시험 이름을 입력하세요"
                                    className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">정답 채점 정보 포함</span>
                                    <ToggleSwitch enabled={includeGrading} onChange={setIncludeGrading} />
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">스포방지(정답 블러)</span>
                                    <ToggleSwitch enabled={blurAnswer} onChange={setBlurAnswer} />
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex gap-2 mt-6">
                            <button 
                                className="flex-1 py-2 px-4 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md font-medium"
                                onClick={() => setShowShareImageModal(false)}
                            >
                                취소
                            </button>
                            <button 
                                className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-md font-medium"
                                onClick={handlePreviewImage}
                            >
                                미리보기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 미리보기 모달 */}
            {showPreviewModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-2 sm:p-4 overflow-x-hidden">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
                        <div className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200">공유 이미지 미리보기</h3>
                                <button 
                                    onClick={() => setShowPreviewModal(false)}
                                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        
                        <div className="flex-1 flex justify-center items-center overflow-y-auto max-h-[80vh] bg-transparent p-0 relative">
                           {isLoading && (
                             <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/40">
                               <Spinner />
                               <span className="mt-2 text-white text-sm">이미지 생성 중...</span>
                             </div>
                           )}
                            <div ref={previewRef} style={{maxWidth: '100vw'}}>
                                <div style={{ width: 420, maxWidth: '100%', fontFamily: "'Noto Sans KR', sans-serif" }}>
                                    <ResultImage 
                                        questions={questions} 
                                        examName={shareExamName} 
                                        includeGrading={includeGrading} 
                                        blurAnswer={blurAnswer}
                                        totalMinutes={totalMinutes}
                                    />
                                </div>
                            </div>
                           {/* 다운로드 안내 */}
                           {showDownloadNotice && (
                             <div className="w-full text-xs text-slate-400 text-center mt-3 absolute bottom-[-2.5rem] left-0">
                               이미지는 다운로드됩니다
                             </div>
                           )}
                        </div>
                        
                        <div className="sticky bottom-0 left-0 w-full bg-slate-800/80 dark:bg-slate-900/80 p-2 sm:p-4 flex flex-col sm:flex-row gap-2 z-10 rounded-b-xl backdrop-blur">
                            <div className="flex gap-2 mt-4 w-full">
                                <button 
                                    className="flex-1 py-3 px-4 bg-slate-500 text-white rounded-lg font-medium hover:bg-slate-600 transition-colors"
                                    onClick={() => { setShowPreviewModal(false); setShowShareImageModal(true); }}
                                    disabled={isLoading}
                                >
                                    수정하기
                                </button>
                                <Button
                                    type="button"
                                    className="flex-1"
                                    onClick={handleShareImage}
                                    disabled={isLoading}
                                >
                                    {isMobileDevice() ? '공유하기' : '이미지 다운로드'}
                                </Button>
                            </div>
                            {/* 설정 모달(공유 옵션 입력 단계)에서만 안내 문구 표시 */}
                            {showShareImageModal && !isMobileDevice() && (
                              <div className="text-xs text-slate-400 text-center mt-2">
                                이미지는 다운로드됩니다
                              </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

// 모바일 환경 판별 함수 (컴포넌트 하단에 추가)
function isMobileDevice() {
  const ua = navigator.userAgent;
  const isMobile = /iPhone|iPad|iPod|Android/i.test(ua);
  const isMacSafari = /Macintosh.*Safari/.test(ua) && !/Chrome/.test(ua);
  return isMobile && !isMacSafari;
}

export default ShareImageButton; 