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
    const captureRef = useRef<HTMLDivElement>(null); // 캡처용 숨김 ref 추가
    const [isLoading, setIsLoading] = useState(false);
    const [showDownloadNotice, setShowDownloadNotice] = useState(false);

    const handlePreviewImage = () => {
        setShowShareImageModal(false);
        setShowPreviewModal(true);
    };

    const handleShareImage = async () => {
        if (!captureRef.current) {
            alert('캡처용 가상 div(captureRef)가 null입니다.');
            return;
        }
        setIsLoading(true);
        try {
            await new Promise((resolve) => setTimeout(resolve, 100)); // 렌더 타이밍 여유
            const blob = await htmlToImage.toBlob(captureRef.current, {
                pixelRatio: 2,
            });
            if (!blob) {
                alert('Blob 생성 실패 (html-to-image 변환 실패)');
                setIsLoading(false);
                return;
            }
            const file = new File([blob], `${shareExamName || '시험결과'}.png`, { type: blob.type });

            // 모바일/데스크톱/맥 사파리 환경 분기
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
            const isMacSafari = /Macintosh.*Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
            if (isMobile && !isMacSafari && navigator.canShare && navigator.canShare({ files: [file] }) && navigator.share) {
                try {
                    await navigator.share({ files: [file], title: shareExamName || '시험결과' });
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
            alert('이미지 공유/생성 중 오류 발생: ' + errorMsg);
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
                <div className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center">
                    <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl p-0">
                        {/* 닫기 버튼 */}
                        <button
                          onClick={() => setShowPreviewModal(false)}
                          className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                          aria-label="닫기"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                        {/* 이미지 미리보기 */}
                        <div className="flex justify-center items-center p-6">
                          <div style={{ width: 420 }}>
                            <ResultImage 
                              questions={questions} 
                              examName={shareExamName} 
                              includeGrading={includeGrading} 
                              blurAnswer={blurAnswer}
                              totalMinutes={totalMinutes}
                            />
                          </div>
                        </div>
                        {/* 하단 버튼 */}
                        <div className="flex gap-2 p-4 border-t border-slate-200 dark:border-slate-700">
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
                        {/* 캡처용 숨김 div: 화면 밖에 렌더링, 오직 420px 고정 크기 */}
                        <div
                          ref={captureRef}
                          style={{
                            width: 420,
                            position: 'absolute',
                            left: -9999,
                            top: 0,
                            zIndex: -1,
                            background: '#0f172a',
                            padding: 0,
                            margin: 0,
                            overflow: 'visible',
                          }}
                        >
                          <ResultImage
                            questions={questions}
                            examName={shareExamName}
                            includeGrading={includeGrading}
                            blurAnswer={blurAnswer}
                            totalMinutes={totalMinutes}
                          />
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