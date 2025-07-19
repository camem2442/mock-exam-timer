import React from 'react';
import { Button } from './Button';

interface DesktopInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DesktopInstallGuideModal: React.FC<DesktopInstallGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-card dark:bg-card rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <svg xmlns="http://www.w.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>앱으로 설치하기</span>
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
              PC에서는 Chrome 브라우저를 사용하여 MockTimer를 앱처럼 설치하고 더 편리하게 이용할 수 있습니다.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-info rounded-full flex items-center justify-center">
                  <span className="text-info-foreground font-bold text-sm">1</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">Chrome 브라우저로 접속</p>
                  <p className="text-muted-foreground text-sm">
                    현재 브라우저에서는 자동 설치를 지원하지 않습니다.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-info rounded-full flex items-center justify-center">
                  <span className="text-info-foreground font-bold text-sm">2</span>
                </div>
                <div>
                  <p className="text-foreground font-medium">설치 아이콘 클릭</p>
                  <p className="text-muted-foreground text-sm">
                    주소창 오른쪽의 '앱 설치' 아이콘(컴퓨터와 아래 화살표 모양)을 클릭하세요.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-info/50 border border-info/70 rounded-lg p-3 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-info-foreground flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p className="text-info-foreground text-sm">
                설치 후에는 바탕화면이나 시작 메뉴의 아이콘으로 바로 실행할 수 있습니다!
              </p>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-base font-semibold text-left text-foreground mb-2 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                <span>모바일에서 설치하기</span>
              </h3>
              <p className="text-left text-muted-foreground text-sm pl-7">
                스마트폰 브라우저에서 접속하여 '홈 화면에 추가' 메뉴를 이용해 주세요. iOS 기기는 Safari 브라우저의 '공유' 메뉴에 있습니다.
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