import React, { useState, useEffect, useCallback, useRef } from 'react';
import { type Question } from '../types';
import ReviewModal from './ReviewModal';
import LiveStatusPanel from './exam/LiveStatusPanel';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import StatusPanelModal from './exam/StatusPanelModal';
import { GradingModal } from './review/GradingModal';
import RecordModal from './RecordModal';
import { SocialShareBadges } from './ui/SocialShareBadges';
import { useExamSetup } from '../hooks/useExamSetup';
import { useReview } from '../hooks/useReview';
import { useExamRecord, type ExamRecord } from '../hooks/useExamRecord';
import { useExamPersistence, type PersistenceState } from '../hooks/useExamPersistence';
import { ConfirmModal } from './ui/ConfirmModal';
import { useTimer, type TimerRestoreState } from '../hooks/useTimer';
import { useExamSession } from '../hooks/useExamSession';
import { ExamSetupView } from './exam/ExamSetupView';
import { ActiveExamView } from './exam/ActiveExamView';
import { usePwaInstall } from '../hooks/usePwaInstall';
import { siteConfig } from '../config/site';
import { IOSInstallGuideModal } from './ui/IOSInstallGuideModal';

const ExamScreen: React.FC = () => {
    // --- State ---
    const [isExamActive, setIsExamActive] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [setupError, setSetupError] = useState('');
    const [isStatusPanelVisible, setIsStatusPanelVisible] = useState(false);
    const [showRestartConfirm, setShowRestartConfirm] = useState(false);
    
    // --- Refs ---
    const problemRefs = useRef<Record<number, HTMLDivElement | null>>({});

    // --- Hooks ---
    const examSetup = useExamSetup();
    const { canInstall, triggerInstallPrompt, isIOS, isStandalone, showIOSGuide, closeIOSGuide } = usePwaInstall();
    const {
        examName, setExamName,
        startQuestionStr, setStartQuestionStr,
        endQuestionStr, setEndQuestionStr,
        totalMinutesStr, setTotalMinutesStr,
        isUnlimitedTime, setIsUnlimitedTime
    } = examSetup;
    const examRecord = useExamRecord();

    const [restoredTimerState, setRestoredTimerState] = useState<TimerRestoreState | undefined>();
    const handleFinishExam = useCallback(() => {
        if (!isExamActive) return;
        setShowReview(true);
        // timer.stop() is implicitly called by onTimeUp in the hook
    }, [isExamActive]);
    
    const timer = useTimer({
        totalMinutes: parseInt(totalMinutesStr, 10) || 0,
        isUnlimited: isUnlimitedTime,
        onTimeUp: handleFinishExam,
        restoreState: restoredTimerState,
    });
    
    const examSession = useExamSession(timer, isExamActive);
    const {
        questions, questionNumbers, subjectiveInputs, lapCounter,
        batchMode, batchSelectedQuestions, handleLap, reset: resetSession,
        focusedQuestionNumber, setFocusedQuestionNumber,
        isMarkingMode, toggleMarkingMode,
    } = examSession;

    // 일괄 선택 모드 변경 시 선택된 문제들도 함께 관리
    const handleBatchModeChange = useCallback((enabled: boolean) => {
        examSession.setBatchMode(enabled);
        if (!enabled) {
            // 일괄 선택을 끄면 선택된 문제들도 초기화
            examSession.setBatchSelectedQuestions(new Set());
        }
    }, [examSession]);

    const review = useReview(questionNumbers);
    const {
        isGradingModalOpen, setIsGradingModalOpen,
        submittedCorrectAnswers, setSubmittedCorrectAnswers,
        grading,
    } = review;

    // --- Persistence ---
    const restoreStateFromPersistence = useCallback((newState: Partial<PersistenceState>) => {
        if (newState.isExamActive !== undefined) setIsExamActive(newState.isExamActive);
        if (newState.showReview !== undefined) setShowReview(newState.showReview);
        if (newState.focusedQuestionNumber !== undefined) setFocusedQuestionNumber(newState.focusedQuestionNumber);

        // Pass restoration data to children hooks
        if (newState.questions !== undefined) examSession.setQuestions(newState.questions);
        if (newState.questionNumbers !== undefined) examSession.setQuestionNumbers(newState.questionNumbers);
        if (newState.subjectiveInputs !== undefined) examSession.setSubjectiveInputs(newState.subjectiveInputs);
        if (newState.lapCounter !== undefined) examSession.setLapCounter(newState.lapCounter);
        if (newState.batchMode !== undefined) examSession.setBatchMode(newState.batchMode);
        if (newState.batchSelectedQuestions !== undefined) examSession.setBatchSelectedQuestions(newState.batchSelectedQuestions);

        // Restore grading state
        if (newState.gradingAnswers !== undefined) grading.setAnswers(newState.gradingAnswers);
        if (newState.gradingSubjective !== undefined) grading.setSubjectiveProblems(newState.gradingSubjective);

        if (newState.totalElapsedTime !== undefined) {
            setRestoredTimerState({
                elapsedTime: newState.totalElapsedTime ?? 0,
                currentProblemTime: newState.currentProblemTime ?? 0,
                isPaused: newState.isPaused ?? true,
                timeUp: newState.timeUp ?? false,
            });
        }
    }, [examSession, setFocusedQuestionNumber, grading]);

    useExamPersistence({
        examSetup,
        examSession,
        timerState: timer,
        examScreenState: {
            isExamActive,
            showReview,
            focusedQuestionNumber: focusedQuestionNumber,
        },
        setState: restoreStateFromPersistence,
        review: { ...review, setSubmittedCorrectAnswers }
    });
    
    // --- Event Handlers ---
    const resetExamState = useCallback(() => {
        setIsExamActive(false);
        setShowReview(false);
        setSetupError('');
        setIsGradingModalOpen(false);
        setSubmittedCorrectAnswers({});
        grading.reset();
        resetSession();
        timer.reset();
    }, [resetSession, timer, setIsGradingModalOpen, setSubmittedCorrectAnswers, grading]);
    
    const handleStartExam = useCallback(() => {
        const start = parseInt(startQuestionStr, 10);
        const end = parseInt(endQuestionStr, 10);
        const totalMinutes = parseInt(totalMinutesStr, 10);

        if (isNaN(start) || isNaN(end) || (!isUnlimitedTime && isNaN(totalMinutes)) || start <= 0 || end <= 0 || start > end) {
            setSetupError('유효한 문제 번호와 시험 시간을 입력해주세요.');
            return;
        }
        
        window.scrollTo({ top: 0, behavior: 'smooth' });

        resetExamState();

        const initialQuestions: Record<number, Question> = {};
        const qNumbers: number[] = [];
        for (let i = start; i <= end; i++) {
            qNumbers.push(i);
            initialQuestions[i] = { number: i, solveTime: 0, answer: null, attempts: 0, solveEvents: [] };
        }
        
        examSession.setQuestions(initialQuestions);
        examSession.setQuestionNumbers(qNumbers);
        setFocusedQuestionNumber(qNumbers[0]);

        setIsExamActive(true);
        timer.start();
    }, [startQuestionStr, endQuestionStr, totalMinutesStr, isUnlimitedTime, resetExamState, timer, examSession, setFocusedQuestionNumber]);
    
    const handleContinueExam = useCallback(() => {
        setShowReview(false);
    }, []);
    
    const handleRestartExam = useCallback(() => {
        setShowRestartConfirm(true);
    }, []);

    const handleConfirmRestart = useCallback(() => {
        setShowRestartConfirm(false);
        setShowReview(false);
        resetExamState();
    }, [resetExamState]);

    const handleLoadRecord = useCallback((record: ExamRecord) => {
        const loadedQuestions = record.questions;
        if (loadedQuestions.length === 0) return;
        const firstQ = loadedQuestions[0];
        const lastQ = loadedQuestions[loadedQuestions.length - 1];
        setExamName(`(복원) ${record.name || '기록'}`);
        setStartQuestionStr(String(firstQ.number));
        setEndQuestionStr(String(lastQ.number));
        const totalTimeInSeconds = loadedQuestions.reduce((acc, q) => acc + q.solveTime, 0);
        const totalMinutes = Math.round(totalTimeInSeconds / 60);
        setTotalMinutesStr(String(totalMinutes));
        setIsUnlimitedTime(totalMinutes <= 0);
        alert('시험 기록을 설정창에 불러왔습니다. 내용을 확인하고 시험을 시작하세요.');
    }, [setExamName, setStartQuestionStr, setEndQuestionStr, setTotalMinutesStr, setIsUnlimitedTime]);


    const questionsWithGrading = React.useMemo(() => {
        const questionsArray = Object.values(questions);
        if (Object.keys(submittedCorrectAnswers).length === 0) {
            // 채점 전, isCorrect를 undefined로 명시적으로 추가
            return questionsArray.map(q => ({ ...q, isCorrect: undefined }));
        }
        
        // 채점 후
        return questionsArray.map(q => {
            const correctAnswer = submittedCorrectAnswers[q.number];
            let isCorrect: boolean | undefined = undefined;
            if (correctAnswer !== undefined && correctAnswer !== null) {
                const userAnswerTrimmed = (q.answer || '').toString().trim();
                const correctAnswerTrimmed = correctAnswer.toString().trim();
                isCorrect = userAnswerTrimmed !== '' && userAnswerTrimmed === correctAnswerTrimmed;
            }
            return { ...q, isCorrect };
        });
    }, [questions, submittedCorrectAnswers]);

    // Keyboard shortcut handler
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (!isExamActive || timer.isPaused || showReview || isGradingModalOpen) {
                return;
            }
            const target = e.target as HTMLElement;
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
                return;
            }
            if (['1', '2', '3', '4', '5'].includes(e.key)) {
                e.preventDefault();
                if (focusedQuestionNumber) {
                    handleLap(focusedQuestionNumber, e.key);
                }
            }
        };
        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            window.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [isExamActive, timer.isPaused, showReview, isGradingModalOpen, focusedQuestionNumber, handleLap]);

    return (
        <>
            {showReview && <ReviewModal 
                key={JSON.stringify(submittedCorrectAnswers)}
                questions={questionsWithGrading} 
                examName={examName}
                onExamNameChange={setExamName}
                onContinue={handleContinueExam} 
                onRestart={handleRestartExam} 
                onGradeRequest={() => setIsGradingModalOpen(true)}
                totalMinutes={parseInt(totalMinutesStr, 10)}
            />}
            <GradingModal
                isOpen={isGradingModalOpen}
                onClose={() => setIsGradingModalOpen(false)}
                startProblem={questionNumbers.length > 0 ? questionNumbers[0] : parseInt(startQuestionStr) || 1}
                endProblem={questionNumbers.length > 0 ? questionNumbers[questionNumbers.length - 1] : parseInt(endQuestionStr) || 45}
                grading={grading}
            />

            <StatusPanelModal
                isOpen={isStatusPanelVisible}
                onClose={() => setIsStatusPanelVisible(false)}
                questionNumbers={questionNumbers}
                questions={questions}
                currentQuestion={focusedQuestionNumber}
                batchMode={batchMode}
                lapCounter={lapCounter}
            />

            <RecordModal
                isOpen={examRecord.isRecordModalOpen}
                onClose={() => examRecord.setIsRecordModalOpen(false)}
                onLoadRecord={handleLoadRecord}
            />

            <ConfirmModal
                isOpen={showRestartConfirm}
                onClose={() => setShowRestartConfirm(false)}
                onConfirm={handleConfirmRestart}
                title="새로운 시험 시작"
                message="현재 진행 중인 시험이 종료되고 모든 기록이 초기화됩니다. 정말 새로운 시험을 시작하시겠습니까?"
            >
                <div className="space-y-4">
                    <hr className="border-border" />
                    <div className="flex flex-col gap-2">
                        {canInstall && !isStandalone && (
                            <Button variant="outline" onClick={async () => {
                                const result = await triggerInstallPrompt();
                                
                                // 결과에 따른 처리
                                if (result?.type === 'already-installed') {
                                    alert('이미 앱으로 실행 중입니다!');
                                } else if (result?.type === 'not-supported') {
                                    alert('이미 앱이 설치되어 있거나, 브라우저에서 지원하지 않습니다.');
                                }
                            }}>
                                <span className="flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V8" />
                                    </svg>
                                    <span>{isIOS ? '홈 화면에 추가 (iOS)' : '홈 화면에 추가'}</span>
                                </span>
                            </Button>
                        )}
                        <Button
                            variant="outline"
                            onClick={async () => {
                                const shareText = `${siteConfig.title}\n\n${siteConfig.description}\n\n${siteConfig.domain}`;
                                if (navigator.share) {
                                    try {
                                        await navigator.share({
                                            title: siteConfig.title,
                                            text: shareText,
                                            url: siteConfig.domain,
                                        });
                                    } catch (error) {
                                        /* User cancelled share */
                                    }
                                } else {
                                    await navigator.clipboard.writeText(shareText);
                                    alert('공유 텍스트가 클립보드에 복사되었습니다.');
                                }
                            }}
                        >
                            <span className="flex items-center gap-2">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                </svg>
                                <span>타이머 공유하기</span>
                            </span>
                        </Button>
                    </div>
                </div>
            </ConfirmModal>

            <div className="lg:hidden mb-8">
                <Button 
                    variant="secondary" 
                    className="w-full"
                    onClick={() => setIsStatusPanelVisible(true)}
                >
                    실시간 풀이 현황 보기
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                <div className="hidden lg:block lg:col-span-2 sticky top-8">
                    <Card>
                        <LiveStatusPanel
                            questionNumbers={questionNumbers}
                            questions={questions}
                            currentQuestion={focusedQuestionNumber}
                            batchMode={batchMode}
                            lapCounter={lapCounter}
                        />
                    </Card>
                </div>

                <div className="lg:col-span-3 space-y-8">
                    {!isExamActive ? (
                        <ExamSetupView 
                            examSetup={examSetup}
                                onStart={handleStartExam}
                            onShowRecords={() => examRecord.setIsRecordModalOpen(true)}
                                error={setupError}
                            />
                    ) : (
                        <ActiveExamView
                            problemRefs={problemRefs}
                            questions={questionsWithGrading}
                            onLap={handleLap}
                            focusedQuestionNumber={focusedQuestionNumber}
                            setFocusedQuestionNumber={setFocusedQuestionNumber}
                            subjectiveInputs={subjectiveInputs}
                            onSubjectiveInputChange={(number, value) => examSession.setSubjectiveInputs(prev => ({...prev, [number]: value}))}
                            batchMode={batchMode}
                            onBatchModeChange={handleBatchModeChange}
                            onBatchRecord={examSession.handleBatchRecord}
                            batchSelectedQuestions={batchSelectedQuestions}
                            onFinishExam={handleFinishExam}
                            isExamActive={isExamActive}
                            isMarkingMode={isMarkingMode}
                            onMarkingModeChange={toggleMarkingMode}
                            timer={{
                                timeLeft: timer.timeLeft,
                                elapsedTime: timer.elapsedTime,
                                currentProblemTime: timer.currentProblemTime,
                                overtime: timer.overtime,
                                isPaused: timer.isPaused,
                                timeUp: timer.timeUp,
                                togglePause: timer.togglePause,
                                recordLap: timer.recordLap,
                            }}
                            examName={examName}
                            isUnlimitedTime={isUnlimitedTime}
                            startQuestionStr={startQuestionStr}
                            endQuestionStr={endQuestionStr}
                            totalMinutesStr={totalMinutesStr}
                        />
                    )}
                </div>
            </div>
            
            {!isExamActive && (
                <div className="mt-8">
                    <Card>
                        <div className="p-6">
                            <SocialShareBadges />
                        </div>
                    </Card>
                </div>
            )}
            
            <IOSInstallGuideModal isOpen={showIOSGuide} onClose={closeIOSGuide} />
        </>
    );
};

export default ExamScreen;