import React from 'react';
import { Card } from '../ui/Card';
import { SocialShareBadges } from '../ui/SocialShareBadges';

export const GuidePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-4">
                            사용 방법 안내
                        </h1>
                        <div className="border-b border-slate-200 dark:border-slate-700 mb-6"></div>
                    </header>
                    
                    <main className="space-y-8 text-slate-700 dark:text-slate-300">
                        <section>
                            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">1. 시험 설정</h2>
                            <p className="mb-4 text-lg">
                                시작하기 전에 풀이할 시험을 설정합니다.
                            </p>
                            <ul className="list-disc space-y-3 pl-6 text-lg">
                                <li className="pl-2"><strong>과목 프리셋:</strong> 국어, 수학 등 주요 과목 버튼을 누르면 해당 과목의 시험 시간과 문제 번호가 자동으로 입력됩니다.</li>
                                <li className="pl-2"><strong>직접 입력:</strong> 시작/종료 번호와 총 시험 시간을 직접 설정할 수 있습니다.</li>
                                <li className="pl-2"><strong>무제한 모드:</strong> 시간 제한 없이 자유롭게 문제를 풀고 싶을 때 이 옵션을 활성화하세요.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">2. 시험 진행</h2>
                            <p className="mb-4 text-lg">
                                '시험 시작' 버튼을 누르면 타이머가 작동하며 문제 풀이를 기록할 수 있습니다.
                            </p>
                            <ul className="list-disc space-y-4 pl-6 text-lg">
                                <li className="pl-2">
                                    <strong>답안 마킹:</strong>
                                    <ul className="list-['\2013'] space-y-3 pl-6 mt-3">
                                        <li className="pl-2"><strong>클릭:</strong> 문제 번호(예: <span className="font-mono bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded">13번</span>) 또는 객관식 번호(1~5)를 클릭하여 답안을 기록합니다.</li>
                                        <li className="pl-2"><strong>키보드 단축키:</strong> 키보드의 숫자 키 (1, 2, 3, 4, 5)를 누르면 현재 포커스된 문제의 답이 바로 마킹되고 다음 문제로 넘어갑니다. (가장 빠른 방법)</li>
                                        <li className="pl-2"><strong>주관식:</strong> 답안 입력 후 '저장' 버튼을 누르거나 Enter 키를 쳐서 기록합니다.</li>
                                    </ul>
                                </li>
                                <li className="pl-2"><strong>현재 문제 리셋:</strong> '현재 문제 풀이 시간'을 0으로 초기화합니다.</li>
                                <li className="pl-2">
                                    <strong>일괄 선택 (배치 모드):</strong>
                                    <ul className="list-['\2013'] space-y-3 pl-6 mt-3">
                                        <li className="pl-2">'일괄 채점 모드' 토글을 켜면 여러 문제를 동시에 선택할 수 있습니다.</li>
                                        <li className="pl-2">선택 후 '일괄 기록' 버튼을 누르면, 마지막 기록부터 현재까지의 시간을 선택된 문제들에 균등하게 배분하여 기록합니다.</li>
                                        <li className="pl-2">여러 쉬운 문제를 연속으로 푼 뒤, 한 번에 시간을 기록하고 싶을 때 유용합니다.</li>
                                    </ul>
                                </li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">3. 시험 종료 및 분석</h2>
                            <p className="mb-4 text-lg">
                                '시험 종료' 버튼을 누르면 풀이가 중단되고 '풀이 과정 분석 리포트'가 나타납니다.
                            </p>
                            <ul className="list-disc space-y-3 pl-6 text-lg">
                                <li className="pl-2"><strong>결과 확인:</strong> 최종 답안, 문제별 풀이 시간, 풀이 시간 분석, 시각화 차트 등을 통해 자신의 풀이 습관을 복기할 수 있습니다.</li>
                                <li className="pl-2"><strong>이어서 진행:</strong> 잠시 쉬었다가 다시 시험을 이어갈 수 있습니다.</li>
                                <li className="pl-2"><strong>새로운 시험 시작:</strong> 현재 기록을 모두 초기화하고 새로운 시험을 시작합니다.</li>
                            </ul>
                        </section>
                        
                        <section>
                            <h2 className="text-2xl font-semibold text-primary-600 dark:text-primary-400 mb-4">4. 시험 기록 저장 및 관리</h2>
                            <p className="mb-4 text-lg">
                                풀이 과정 분석 리포트에서 시험 결과를 저장하고 관리할 수 있습니다.
                            </p>
                            <ul className="list-disc space-y-3 pl-6 text-lg">
                                <li className="pl-2"><strong>시험 기록 저장:</strong> '시험 기록 저장 (베타)' 버튼을 클릭하면 시험 이름을 입력하여 브라우저 저장소에 저장할 수 있습니다.</li>
                                <li className="pl-2"><strong>저장된 기록 확인:</strong> 메인 화면의 '저장된 시험 기록' 버튼을 클릭하면 이전에 저장한 시험 기록을 확인할 수 있습니다.</li>
                                <li className="pl-2"><strong>기록 불러오기:</strong> 저장된 기록을 클릭하여 이전 결과를 다시 확인하거나 분석할 수 있습니다.</li>
                                <li className="pl-2"><strong>기록 편집:</strong> 저장된 기록에서 연필 아이콘을 클릭하여 이름을 변경할 수 있습니다.</li>
                                <li className="pl-2"><strong>데이터 내보내기:</strong> 각 기록에서 CSV 복사 또는 CSV 다운로드 버튼을 사용하여 엑셀이나 구글 시트에서 분석할 수 있습니다.</li>
                                <li className="pl-2"><strong>주의사항:</strong> 브라우저를 바꾸거나 데이터를 삭제하면 저장된 기록이 사라질 수 있습니다. 모바일에서는 브라우저 설정에 따라 저장 용량이 제한될 수 있습니다.</li>
                            </ul>
                        </section>
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