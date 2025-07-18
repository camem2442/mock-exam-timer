import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { SocialShareBadges } from './SocialShareBadges';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';

interface InfoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-card dark:bg-card/95 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] min-w-0 overflow-hidden flex flex-col modal-container" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-border flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">사용 방법 안내</h2>
                </header>
                <main className="overflow-y-auto p-4 sm:p-6 space-y-6 text-muted-foreground">
                    <div className="text-center">
                        <SocialShareBadges />
                    </div>
                    
                    <div className="border-t border-border my-6"></div>
                    
                    <section>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>빠른 시작</span>
                        </h3>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                                <div>
                                    <strong>시험 설정:</strong> 과목 프리셋 버튼을 누르거나 직접 시간과 문제 번호를 입력하세요.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                                <div>
                                    <strong>시험 시작:</strong> '시험 시작' 버튼을 누르면 타이머가 작동합니다.
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-3">
                                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                                <div>
                                    <strong>답안 기록:</strong> 문제 번호를 클릭하거나 키보드 숫자 키(1~5)를 사용하세요.
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <span className="bg-primary/10 text-primary rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                                <div>
                                    <strong>결과 확인:</strong> '시험 종료' 후 상세한 분석 리포트를 확인하세요.
                                </div>
                            </div>
                        </div>
                    </section>
                    
                     <section>
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                            <span>핵심 기능</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                            <div className="bg-muted p-3 rounded-lg">
                                <strong>키보드 단축키:</strong> 숫자 키 1~5로 빠른 답안 입력
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <strong>일괄 채점:</strong> 여러 문제를 동시에 선택하여 시간 기록
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <strong>주관식 지원:</strong> 텍스트 입력으로 주관식 답안 기록
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <strong>CSV 내보내기:</strong> 엑셀 활용을 위한 데이터 내보내기
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <strong>홈 화면에 추가:</strong> 앱처럼 설치하여 빠르게 접속
                            </div>
                            <div className="bg-muted p-3 rounded-lg">
                                <strong>결과 공유:</strong> 분석 결과를 이미지/링크로 공유
                            </div>
                        </div>
                    </section>
                    
                    <div className="border-t border-border my-6"></div>
                    
                    <section className="text-center space-y-4">
                        <h3 className="text-lg font-semibold text-primary mb-3 flex items-center justify-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            <span>더 자세한 정보가 필요하신가요?</span>
                        </h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            <Button asChild>
                                <Link to="/guide" onClick={onClose}>
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    상세 사용법
                                </Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link to="/changelog" onClick={onClose}>
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    업데이트 기록
                                </Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link to="/contact" onClick={onClose}>
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    문의하기
                                </Link>
                            </Button>
                            <Button asChild variant="secondary">
                                <Link to="/faq" onClick={onClose}>
                                    <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9h8M8 13h6m-6 4h8M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6" />
                                    </svg>
                                    자주 묻는 질문
                                </Link>
                            </Button>
                        </div>
                    </section>
                    
                    <div className="border-t border-border my-6"></div>
                    
                    <section className="text-center">
                        <p className="text-sm text-muted-foreground">
                            문의 : {siteConfig.contact.email} | © {siteConfig.copyright.year} {siteConfig.copyright.name}
                        </p>
                    </section>
                </main>
                 <footer className="p-4 bg-muted border-t border-border flex justify-end">
                    <Button onClick={onClose} variant="default" className="text-sm px-3 py-2">닫기</Button>
                </footer>
            </div>
        </div>
    );
};