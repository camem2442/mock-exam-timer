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
            <h2 className="text-xl font-bold text-foreground">
              📱 홈 화면에 추가
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
                    Safari 브라우저 하단의 공유 버튼(□↑)을 탭하세요
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
              <p className="text-info-foreground text-sm">
                💡 설치 후에는 홈 화면의 앱 아이콘을 탭하여 실행할 수 있습니다!
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