import React from 'react';
import { Card } from '../ui/Card';
import { SocialShareBadges } from '../ui/SocialShareBadges';

export const GuidePage: React.FC = () => {
    return (
        <div className="min-h-screen bg-background py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <Card className="p-6 sm:p-8">
                    <header className="mb-8">
                        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                            사용 방법 안내
                        </h1>
                        <div className="border-b border-border mb-6"></div>
                    </header>
                    
                    <main className="space-y-8 text-muted-foreground">
                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">1. 시험 설정</h2>
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
                            <h2 className="text-2xl font-semibold text-brand mb-4">2. 시험 진행</h2>
                            <p className="mb-4 text-lg">
                                '시험 시작' 버튼을 누르면 타이머가 작동하며 문제 풀이를 기록할 수 있습니다.
                            </p>
                            <ul className="list-disc space-y-4 pl-6 text-lg">
                                <li className="pl-2">
                                    <strong>답안 마킹:</strong>
                                    <ul className="list-['\2013'] space-y-3 pl-6 mt-3">
                                        <li className="pl-2"><strong>클릭:</strong> 문제 번호(예: <span className="font-mono bg-muted px-2 py-1 rounded">13번</span>) 또는 객관식 번호(1~5)를 클릭하여 답안을 기록합니다.</li>
                                        <li className="pl-2"><strong>키보드 단축키:</strong> 키보드의 숫자 키 (1, 2, 3, 4, 5)를 누르면 현재 포커스된 문제의 답이 바로 마킹되고 다음 문제로 넘어갑니다. (가장 빠른 방법)</li>
                                        <li className="pl-2"><strong>주관식:</strong> 답안 입력 후 '저장' 버튼을 누르거나 Enter 키를 쳐서 기록합니다.</li>
                                    </ul>
                                </li>
                                <li className="pl-2">
                                    <strong>시간만 기록하고 넘어가기:</strong>
                                    <p className="pl-6 mt-2">
                                        문제를 풀다가 답을 정하지 못하고 다음 문제로 넘어가고 싶을 때, 해당 문제의 파란색 번호 버튼(예: <span className="font-mono bg-muted px-2 py-1 rounded">13번</span>)을 누르면 답안은 비워둔 채 현재까지의 풀이 시간만 기록되고 다음 문제로 넘어갑니다.
                                    </p>
                                </li>
                                <li className="pl-2">
                                    <strong>마킹 모드 (시간 기록 없이 답안만 수정):</strong>
                                    <ul className="list-['\2013'] space-y-3 pl-6 mt-3">
                                        <li className="pl-2">'마킹 모드' 토글을 켜면 타이머가 흐르더라도 모든 시간 기록 기능이 일시적으로 중지됩니다.</li>
                                        <li className="pl-2">시험 종료 후 OMR 카드에 답을 옮겨 적는 상황을 시뮬레이션 하거나, 이전에 마킹한 답을 시간 변화 없이 수정하고 싶을 때 유용합니다.</li>
                                        <li className="pl-2">예를 들어, 모든 문제를 다 푼 뒤 마킹 모드를 켜고 1번 문제부터 답안을 순서대로 클릭하면, 실제 OMR 마킹처럼 시간 기록 없이 답안만 입력할 수 있습니다.</li>
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
                            <h2 className="text-2xl font-semibold text-brand mb-4">3. 시험 종료 및 분석</h2>
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
                            <h2 className="text-2xl font-semibold text-brand mb-4">4. 시험 기록 저장 및 관리</h2>
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

                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">5. 결과 공유</h2>
                            <p className="mb-4 text-lg">
                                풀이 결과 분석 리포트나 공유된 링크 페이지에서 다른 사람에게 결과를 이미지와 링크로 공유할 수 있습니다.
                            </p>
                            <ul className="list-disc space-y-3 pl-6 text-lg">
                                <li className="pl-2"><strong>공유하기:</strong> '결과 공유하기' 또는 '공유하기' 버튼을 누르면 이미지 미리보기와 함께 공유 모달이 나타납니다.</li>
                                <li className="pl-2"><strong>이미지/링크 공유:</strong> 모달의 '이미지/링크 공유' 버튼을 누르면 운영체제의 기본 공유 창이 열리며, 카카오톡, 메시지 등으로 이미지와 링크를 함께 보낼 수 있습니다.</li>
                                <li className="pl-2"><strong>링크 저장:</strong> 공유 시 생성된 링크는 영구적으로 저장되므로, 언제든지 다시 접속하여 결과를 확인할 수 있습니다.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-brand mb-4">6. 홈 화면에 추가 (PWA)</h2>
                            <p className="mb-4 text-lg">
                                MockTimer를 스마트폰이나 PC에 앱처럼 설치하여 더 빠르고 편리하게 이용할 수 있습니다.
                            </p>
                            <ul className="list-disc space-y-3 pl-6 text-lg">
                                <li className="pl-2"><strong>설치 방법:</strong> 우측 상단 햄버거 메뉴(☰)를 열고 '홈 화면에 추가' 버튼을 누르세요.</li>
                                <li className="pl-2"><strong>지원 환경:</strong> Chrome, Safari 등 PWA를 지원하는 최신 브라우저에서 설치할 수 있습니다. 버튼이 보이지 않으면 해당 브라우저가 기능을 지원하지 않는 것입니다.</li>
                                <li className="pl-2"><strong>장점:</strong> 전체 화면으로 더 넓게 보고, 앱 아이콘으로 한번에 접속하는 등 더 쾌적한 환경에서 집중할 수 있습니다.</li>
                            </ul>
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