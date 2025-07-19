import React from 'react';
import { Card } from '../ui/Card';
import { SocialShareBadges } from '../ui/SocialShareBadges';
import { siteConfig } from '../../config/site';

export const ChangelogPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <header className="mb-8">
                        <div className="flex justify-between items-center">
                            <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                                업데이트 기록
                            </h1>
                            <span className="text-lg text-muted-foreground font-semibold">
                               v{siteConfig.seo.version}
                            </span>
                        </div>
                        <div className="border-b border-border mt-4 mb-6"></div>
                    </header>
                    
                    <main className="space-y-8 text-muted-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">최신 업데이트</h2>
                            <div className="space-y-6">
                                <div className="border-l-4 border-primary pl-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        v1.4.0 (2025년 7월 19일)
                                    </h3>
                                    <ul className="list-disc space-y-2 pl-6 text-lg">
                                        <li className="pl-2">다크모드/라이트모드 지원</li>
                                        <li className="pl-2">풀이 기록표 정렬/필터 추가</li>
                                        <li className="pl-2">풀이 시간 분석 리포트 상세화</li>
                                        <li className="pl-2">UI/UX 개선</li>
                                    </ul>
                                </div>
                                <div className="border-l-4 border-border pl-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        v1.3.0 (2025년 7월 19일)
                                    </h3>
                                    <ul className="list-disc space-y-2 pl-6 text-lg">
                                        <li className="pl-2">PWA 지원 및 '홈 화면에 추가' 기능</li>
                                        <li className="pl-2">결과 이미지/링크 공유 기능</li>
                                    </ul>
                                </div>
                                <div className="border-l-4 border-border pl-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        v1.2.0 (2025년 7월 17일)
                                    </h3>
                                    <ul className="list-disc space-y-2 pl-6 text-lg">
                                        <li className="pl-2">시험 이름 입력 기능 추가</li>
                                        <li className="pl-2">타이머 화면에 시험 이름 표시</li>
                                        <li className="pl-2">모바일 UI 개선 및 반응형 디자인 강화</li>
                                    </ul>
                                </div>
                                
                                <div className="border-l-4 border-border pl-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        v1.1.0 (2025년 7월 17일)
                                    </h3>
                                    <ul className="list-disc space-y-2 pl-6 text-lg">
                                        <li className="pl-2">시험 기록 저장 및 관리 기능 추가</li>
                                        <li className="pl-2">CSV 내보내기 기능</li>
                                        <li className="pl-2">일괄 채점 모드 개선</li>
                                        <li className="pl-2">모바일 최적화</li>
                                    </ul>
                                </div>
                                
                                <div className="border-l-4 border-border pl-6">
                                    <h3 className="text-xl font-semibold text-foreground mb-2">
                                        v1.0.0 (2025년 7월 15일)
                                    </h3>
                                    <ul className="list-disc space-y-2 pl-6 text-lg">
                                        <li className="pl-2">기본 타이머 및 문제 풀이 기록 기능</li>
                                        <li className="pl-2">풀이 과정 분석 리포트</li>
                                        <li className="pl-2">키보드 단축키 지원</li>
                                        <li className="pl-2">주관식 답안 입력 기능</li>
                                        <li className="pl-2">시험 프리셋 제공 (국어, 수학, 영어, 사회, 과학)</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                        

                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">피드백 및 제안</h2>
                            <p className="text-lg mb-4">
                                새로운 기능 제안이나 버그 리포트가 있으시면 언제든지 문의해주세요.
                            </p>
                            <div className="bg-primary/10 p-4 rounded-lg">
                                <p className="text-lg">
                                    <strong>문의:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a>
                                </p>
                            </div>
                        </section>
                    </main>

                    <div className="my-8">
                        <SocialShareBadges />
                    </div>
                    
                    <footer className="mt-12 pt-8 border-t border-border">
                        <div className="text-center">
                            <a 
                                href="/" 
                                className="inline-flex items-center gap-2 text-primary hover:text-primary/90 transition-colors"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                메인으로 돌아가기
                            </a>
                        </div>
                    </footer>
                </Card>
            </div>
        </div>
    );
}; 