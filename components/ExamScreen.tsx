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
    const { canInstall, triggerInstallPrompt } = usePwaInstall();
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
    } = examSession;

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
        setTotalMinutesStr(String(Math.round(totalTimeInSeconds / 60)));
        alert('시험 기록을 설정창에 불러왔습니다. 내용을 확인하고 시험을 시작하세요.');
    }, [setExamName, setStartQuestionStr, setEndQuestionStr, setTotalMinutesStr]);


    const questionsWithGrading = React.useMemo(() => {
        if (Object.keys(submittedCorrectAnswers).length === 0) {
            return Object.values(questions);
        }
        return Object.values(questions).map(q => {
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
                    <hr className="border-slate-200 dark:border-slate-700" />
                    <div className="flex flex-col gap-2">
                        {canInstall && (
                            <Button variant="outline" onClick={triggerInstallPrompt}>
                                📲 홈 화면에 추가
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
                            🔗 서비스 공유하기
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
                            examName={examName}
                            isUnlimitedTime={isUnlimitedTime}
                            startQuestionStr={startQuestionStr}
                            endQuestionStr={endQuestionStr}
                            totalMinutesStr={totalMinutesStr}
                            timer={timer}
                            examSession={examSession}
                            onFinishExam={handleFinishExam}
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
        </>
    );
};

export default ExamScreen;