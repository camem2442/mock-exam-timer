import React from 'react';
import { Card } from '../ui/Card';
import { SocialShareBadges } from '../ui/SocialShareBadges';
import { siteConfig } from '../../config/site';
import { Link } from 'react-router-dom';

export const ContactPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            문의 및 피드백
                        </h1>
                        <div className="border-b border-border mb-6"></div>
                    </header>
                    
                    <main className="space-y-8 text-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">문의 방법</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-muted p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">
                                        📧 이메일 문의
                                    </h3>
                                    <p className="text-lg mb-4">
                                        가장 빠른 답변을 받을 수 있는 방법입니다.
                                    </p>
                                    <a 
                                        href={`mailto:${siteConfig.contact.email}`}
                                        className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity text-lg font-medium"
                                    >
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        {siteConfig.contact.email}
                                    </a>
                                </div>
                                
                                <div className="bg-muted p-6 rounded-lg">
                                    <h3 className="text-xl font-semibold text-foreground mb-3">
                                        💬 피드백 유형
                                    </h3>
                                    <ul className="list-disc space-y-2 pl-6 text-lg">
                                        <li className="pl-2">버그 리포트</li>
                                        <li className="pl-2">새로운 기능 제안</li>
                                        <li className="pl-2">UI/UX 개선 의견</li>
                                        <li className="pl-2">사용법 문의</li>
                                        <li className="pl-2">기타 문의사항</li>
                                    </ul>
                                </div>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">자주 묻는 질문</h2>
                            <div className="space-y-4">
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Q: 모의고사 타이머는 어떤 시험에 사용할 수 있나요?
                                    </h3>
                                    <p className="text-lg">
                                        A: 수능, 공무원시험, LEET, CPA, 토익, 토플 등 모든 종류의 시험에 활용할 수 있습니다. 문제별 풀이 시간을 기록하고 분석하여 효율적인 시험 준비를 도와줍니다.
                                    </p>
                                </div>
                                
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Q: 모바일에서도 사용할 수 있나요?
                                    </h3>
                                    <p className="text-lg">
                                        A: 네, 모바일에서도 사용할 수 있도록 반응형 디자인으로 제작되었습니다. 터치 인터페이스에 최적화되어 있으며, 대부분의 모바일 브라우저에서 정상적으로 작동합니다. 또한, '홈 화면에 추가' 기능을 지원하여 앱처럼 편리하게 사용할 수 있습니다.
                                    </p>
                                </div>
                                
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Q: 시험 기록은 어떻게 저장되나요?
                                    </h3>
                                    <p className="text-lg">
                                        A: 브라우저의 로컬 스토리지에 저장되며, CSV 형태로 내보내기할 수 있습니다. 언제든지 이전 기록을 확인하고 분석할 수 있습니다.
                                    </p>
                                </div>
                                
                                <div className="border border-border rounded-lg p-4">
                                    <h3 className="text-lg font-semibold text-foreground mb-2">
                                        Q: 데이터는 안전하게 보관되나요?
                                    </h3>
                                    <p className="text-lg">
                                        A: 시험 기록, 답안 등 대부분의 데이터는 사용자의 브라우저에만 안전하게 저장됩니다. 공유 기능을 사용할 경우, 결과 이미지와 링크 생성을 위해 시험 데이터가 일시적으로 서버에 전송됩니다. 이 데이터는 익명으로 처리되며 개인을 식별하는 데 사용되지 않습니다. 브라우저를 바꾸거나 데이터를 삭제하면 저장된 기록이 사라질 수 있으니 주의해주세요.
                                    </p>
                                </div>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">개발자 정보</h2>
                            <div className="bg-muted p-6 rounded-lg">
                                <h3 className="text-xl font-semibold text-foreground mb-3">
                                    모의고사 타이머 & 분석기
                                </h3>
                                <p className="text-lg mb-4">
                                    수험생들의 효율적인 시험 준비를 돕기 위해 개발된 웹 애플리케이션입니다.
                                </p>
                                <div className="space-y-2 text-lg">
                                    <p><strong>문의:</strong> {siteConfig.contact.email}</p>
                                    <p><strong>버전:</strong> v1.2.0</p>
                                    <p><strong>최종 업데이트:</strong> 2025년 7월 17일</p>
                                </div>
                            </div>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-primary mb-4">개인정보 처리방침</h2>
                            <div className="bg-muted p-6 rounded-lg">
                                <p className="text-lg mb-4">
                                    모의고사 타이머 & 분석기는 사용자의 프라이버시 보호를 중요하게 생각하며, 개인정보를 최소한으로 처리합니다.
                                </p>
                                <ul className="list-disc space-y-2 pl-6 text-lg">
                                    <li className="pl-2">시험 기록, 답안 등 대부분의 데이터는 사용자의 브라우저에만 저장됩니다.</li>
                                    <li className="pl-2">결과 공유 기능 이용 시, 이미지 및 링크 생성을 위해 시험 데이터가 서버로 일시 전송될 수 있습니다. 이 데이터는 익명으로 처리되며 개인 식별 정보는 포함되지 않습니다.</li>
                                    <li className="pl-2">문의 시 제공되는 이메일 주소는 답변 목적으로만 사용됩니다.</li>
                                </ul>
                                <p className="text-xs text-muted-foreground mt-4">
                                  본 사이트는 방문 통계 분석을 위해 비식별화된 익명 데이터만 수집합니다. 개인정보는 저장/전송하지 않습니다.
                                </p>
                            </div>
                        </section>
                    </main>

                    <div className="my-8">
                        <SocialShareBadges />
                    </div>
                    
                    <footer className="mt-12 pt-8 border-t border-border">
                        <div className="text-center">
                            <Link 
                                to="/" 
                                className="inline-flex items-center gap-2 text-primary hover:opacity-80 transition-opacity"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                메인으로 돌아가기
                            </Link>
                        </div>
                    </footer>
                </Card>
            </div>
        </div>
    );
}; 