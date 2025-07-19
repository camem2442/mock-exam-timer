import React from 'react';
import { Card } from '../ui/Card';
import { Link } from 'react-router-dom';
import { siteConfig } from '../../config/site';

export const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            개인정보 처리방침
                        </h1>
                        <p className="text-lg text-muted-foreground">최종 수정일: 2025년 7월 19일</p>
                        <div className="border-b border-border mt-6"></div>
                    </header>
                    
                    <main className="space-y-8 text-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">1. 총칙</h2>
                            <p className="text-lg leading-relaxed">
                                모의고사 타이머 & 분석기(이하 '서비스')는 사용자의 개인정보를 중요시하며, 정보통신망 이용촉진 및 정보보호에 관한 법률을 준수하고 있습니다. 본 개인정보 처리방침을 통해 사용자가 제공하는 개인정보가 어떠한 용도와 방식으로 이용되고 있으며, 개인정보보호를 위해 어떠한 조치가 취해지고 있는지 알려드립니다.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">2. 수집하는 개인정보 항목 및 수집 방법</h2>
                            <p className="text-lg leading-relaxed mb-4">
                                본 서비스는 대부분의 기능을 개인정보 수집 없이 제공합니다.
                            </p>
                            <ul className="list-disc space-y-2 pl-6 text-lg">
                                <li><strong>기본 이용:</strong> 시험 기록, 답안 등 모든 데이터는 사용자의 브라우저(Local Storage)에만 저장되며, 서비스 서버로 전송되지 않습니다.</li>
                                <li><strong>공유 기능 이용 시:</strong> 공유 링크 생성을 위해, 해당 시험의 데이터(시험 이름, 문제별 풀이 기록, 답안 및 채점 결과)가 서버에 저장됩니다. 이 데이터는 개인을 식별할 수 없는 익명화된 정보이며, 고유 주소(URL)를 통해서만 접근 가능합니다.</li>
                                <li><strong>문의 시:</strong> 문의 내용에 대한 답변을 위해서만 이메일 주소가 이용됩니다.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">3. 개인정보의 수집 및 이용 목적</h2>
                            <ul className="list-disc space-y-2 pl-6 text-lg">
                                <li><strong>시험 데이터:</strong> 사용자가 생성한 고유 주소(URL)를 통해 타인에게 시험 결과를 공유하고, 해당 내용을 조회할 수 있도록 링크가 유지되는 동안 보관됩니다.</li>
                                <li><strong>이메일 주소:</strong> 문의사항에 대한 회신 및 안내 목적으로만 이용됩니다.</li>
                                <li><strong>서비스 이용 통계:</strong> 서비스 개선 및 통계 분석을 위해 비식별화된 익명 데이터(방문 기록 등)를 수집할 수 있습니다.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">4. 개인정보의 보유 및 이용기간</h2>
                             <p className="text-lg leading-relaxed">
                                사용자의 공유 데이터는 원칙적으로 해당 공유 링크가 유효한 동안 보유하며, 삭제 요청 시 지체 없이 파기합니다. 문의를 위해 제공된 이메일 주소는 답변 완료 후 1년간 보관 후 파기됩니다.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">5. 사용자의 권리 및 행사 방법</h2>
                            <p className="text-lg leading-relaxed">
                                사용자는 언제든지 자신의 공유 기록에 대한 삭제를 요청할 수 있습니다. 삭제를 원하시는 경우, 공유된 결과의 주소(URL)와 함께 문의 이메일로 요청해 주시면 본인 확인 절차 후 처리해 드립니다.
                            </p>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">6. 개인정보 보호 책임자</h2>
                            <p className="text-lg">
                                <strong>이메일:</strong> <a href={`mailto:${siteConfig.contact.email}`} className="text-primary hover:underline">{siteConfig.contact.email}</a>
                            </p>
                        </section>
                    </main>

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