import React from 'react';
import { Button } from './Button';

interface IOSInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IOSInstallGuideModal: React.FC<IOSInstallGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-card dark:bg-card rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span>홈 화면에 추가</span>
            </h2>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Safari에서 홈 화면에 추가하여 앱처럼 사용할 수 있습니다.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-info rounded-full flex items-center justify-center">
                  <span className="text-info-foreground font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">공유 버튼 탭</p>
                  <p className="text-muted-foreground text-sm">
                    Safari 브라우저 하단의 공유 버튼
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v10m0-10L8 7m4-4l4 4" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12v7a2 2 0 002 2h14a2 2 0 002-2v-7" />
                    </svg>
                    을 탭하세요
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-info rounded-full flex items-center justify-center">
                  <span className="text-info-foreground font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">홈 화면에 추가 선택</p>
                  <p className="text-muted-foreground text-sm">
                    메뉴에서 "홈 화면에 추가"를 선택하세요
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-info rounded-full flex items-center justify-center">
                  <span className="text-info-foreground font-bold text-sm">3</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">추가 완료</p>
                  <p className="text-muted-foreground text-sm">
                    "추가"를 탭하여 설치를 완료하세요
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-info/50 border border-info/70 rounded-lg p-3">
              <p className="text-info-foreground text-sm flex items-start gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <span>설치 후에는 홈 화면의 앱 아이콘을 탭하여 실행할 수 있습니다!</span>
              </p>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose} variant="default">
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};