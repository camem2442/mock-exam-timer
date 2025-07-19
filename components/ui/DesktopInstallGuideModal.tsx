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
            <h2 className="text-xl font-bold text-foreground">
              💻 앱으로 설치하기
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
            
            <div className="bg-info/50 border border-info/70 rounded-lg p-3">
              <p className="text-info-foreground text-sm">
                💡 설치 후에는 바탕화면이나 시작 메뉴의 아이콘으로 바로 실행할 수 있습니다!
              </p>
            </div>

            <div className="border-t border-border pt-4 mt-4">
              <h3 className="text-base font-semibold text-left text-foreground mb-2">
                📱 모바일에서 설치하기
              </h3>
              <p className="text-left text-muted-foreground text-sm">
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