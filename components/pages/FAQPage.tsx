import React from 'react';
import { Card } from '../ui/Card';
import { SocialShareBadges } from '../ui/SocialShareBadges';
import { siteConfig } from '../../config/site';

export const FAQPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                            자주 묻는 질문 (FAQ)
                        </h1>
                        <div className="border-b border-slate-200 dark:border-slate-700 mb-6"></div>
                    </header>
                    <main className="space-y-8 text-slate-700 dark:text-slate-300">
                        <section className="space-y-6">
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Q. 모의고사 타이머는 어떤 시험에 사용할 수 있나요?
                                </h3>
                                <p className="text-lg">
                                    A. 수능, 공무원시험, LEET, CPA, 토익, 토플 등 모든 종류의 시험에 활용할 수 있습니다. 문제별 풀이 시간을 기록하고 분석하여 효율적인 시험 준비를 도와줍니다.
                                </p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Q. 모바일에서도 사용할 수 있나요?
                                </h3>
                                <p className="text-lg">
                                    A. 네, 모바일에서도 사용할 수 있도록 반응형 디자인으로 제작되었습니다. 터치 인터페이스에 최적화되어 있으며, 대부분의 모바일 브라우저에서 정상적으로 작동합니다. 또한, '홈 화면에 추가' 기능을 지원하여 앱처럼 편리하게 사용할 수 있습니다.
                                </p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Q. 시험 기록은 어떻게 저장되나요?
                                </h3>
                                <p className="text-lg">
                                    A. 시험 기록은 기본적으로 사용자의 브라우저(로컬 스토리지)에 저장됩니다. 또한, '결과 공유하기' 기능을 사용하면 해당 결과가 저희 데이터베이스에 익명으로 저장되어 영구적인 링크가 생성됩니다. 로컬 기록은 CSV 형태로 내보내기하여 백업할 수 있습니다.
                                </p>
                            </div>
                            <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
                                <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                    Q. 데이터는 안전하게 보관되나요?
                                </h3>
                                <p className="text-lg">
                                    A. 시험 기록, 답안 등 대부분의 데이터는 사용자의 브라우저에만 안전하게 저장됩니다. 공유 기능을 사용할 경우, 결과 이미지와 링크 생성을 위해 시험 데이터가 일시적으로 서버에 전송됩니다. 이 데이터는 익명으로 처리되며 개인을 식별하는 데 사용되지 않습니다. 브라우저를 바꾸거나 데이터를 삭제하면 저장된 기록이 사라질 수 있으니 주의해주세요.
                                </p>
                            </div>
                        </section>
                        <div className="text-center text-xs text-slate-500 dark:text-slate-400 mt-8">
                            본 사이트는 방문 통계 분석을 위해 비식별화된 익명 데이터만 수집합니다. 개인정보는 저장/전송하지 않습니다.
                        </div>
                    </main>

                    <div className="my-8">
                        <SocialShareBadges />
                    </div>
                    <footer className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                        <div className="text-center">
                            <a 
                                href="/" 
                                className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
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