import React, { useState, useEffect, useCallback, useRef } from 'react';
import { type Question, type SolveEvent } from '../types';
import ReviewModal from './ReviewModal';
import LiveStatusPanel from './exam/LiveStatusPanel';
import SetupPanel from './exam/SetupPanel';
import TimerDisplay from './exam/TimerDisplay';
import ControlToolbar from './exam/ControlToolbar';
import QuickNav from './exam/QuickNav';
import { Card } from './ui/Card';
import DynamicMarkingWindow from './exam/DynamicMarkingWindow';
import ProblemList from './exam/ProblemList';
import { Button } from './ui/Button';
import StatusPanelModal from './exam/StatusPanelModal';
import { GradingModal } from './review/GradingModal';
import BookmarkModal from './BookmarkModal'; // 시험 기록 모달

const ExamScreen: React.FC = () => {
    // Component State
    const [isExamActive, setIsExamActive] = useState(false);
    const [showReview, setShowReview] = useState(false);
    const [isGradingModalOpen, setIsGradingModalOpen] = useState(false);

    // Setup Form State
    const [startQuestionStr, setStartQuestionStr] = useState('1');
    const [endQuestionStr, setEndQuestionStr] = useState('45');
    const [totalMinutesStr, setTotalMinutesStr] = useState('70');
    const [isUnlimitedTime, setIsUnlimitedTime] = useState(false);
    const [setupError, setSetupError] = useState('');
    const [submittedCorrectAnswers, setSubmittedCorrectAnswers] = useState<Record<number, string>>({});
    const [gradingModalInputs, setGradingModalInputs] = useState<Record<number, string>>({});
    const [gradingModalSubjective, setGradingModalSubjective] = useState<Set<number>>(new Set());


    // Exam Data State
    const [questions, setQuestions] = useState<Record<number, Question>>({});
    const [questionNumbers, setQuestionNumbers] = useState<number[]>([]);
    const [subjectiveInputs, setSubjectiveInputs] = useState<Record<number, string>>({});

    // Timer State
    const [totalElapsedTime, setTotalElapsedTime] = useState(0);
    const [overallTimeLeft, setOverallTimeLeft] = useState(Infinity);
    const [currentProblemTime, setCurrentProblemTime] = useState(0);
    const [lapCounter, setLapCounter] = useState(0);
    const [timeUp, setTimeUp] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    // Interaction State
    const [focusedQuestionNumber, setFocusedQuestionNumber] = useState<number | null>(null);
    const [batchMode, setBatchMode] = useState(false);
    const [batchSelectedQuestions, setBatchSelectedQuestions] = useState<Set<number>>(new Set());
    const [isStatusPanelVisible, setIsStatusPanelVisible] = useState(false);
    const [isBookmarkModalOpen, setIsBookmarkModalOpen] = useState(false);
    
    // Refs for timer and scrolling
    const timerRef = useRef<number | undefined>(undefined);
    // Convert refs to state for localStorage persistence
    const [startTime, setStartTime] = useState(0);
    const [lastLapTimestamp, setLastLapTimestamp] = useState(0);
    const [pauseTime, setPauseTime] = useState(0);
    const examConfigRef = useRef({ totalMinutes: 70, isUnlimited: false });

    const problemRefs = useRef<Record<number, HTMLDivElement | null>>({});
    const problemListContainerRef = useRef<HTMLDivElement | null>(null);

    // Effect for saving state to localStorage
    useEffect(() => {
        const isReviewing = !isExamActive && showReview;
        if (isExamActive || isReviewing) {
             const stateToSave = {
                questions, questionNumbers, subjectiveInputs,
                totalElapsedTime, overallTimeLeft, currentProblemTime,
                lapCounter, timeUp, isPaused,
                startTime, lastLapTimestamp, pauseTime,
                focusedQuestionNumber, batchMode, batchSelectedQuestions: Array.from(batchSelectedQuestions),
                examConfig: examConfigRef.current,
                startQuestionStr, endQuestionStr, totalMinutesStr, isUnlimitedTime,
                submittedCorrectAnswers,
                gradingModalInputs,
                gradingModalSubjective: Array.from(gradingModalSubjective),
                // Add flags to know where we are
                isExamActive,
                showReview,
            };
            localStorage.setItem('examState', JSON.stringify(stateToSave));
        }
        // Data is now cleared only on explicit reset
    }, [
        isExamActive, showReview, questions, questionNumbers, subjectiveInputs,
        totalElapsedTime, overallTimeLeft, currentProblemTime,
        lapCounter, timeUp, isPaused, startTime, lastLapTimestamp, pauseTime,
        focusedQuestionNumber, batchMode, batchSelectedQuestions, submittedCorrectAnswers,
        gradingModalInputs, gradingModalSubjective
    ]);

     // Effect for loading state from localStorage on initial mount
    useEffect(() => {
        const savedStateJSON = localStorage.getItem('examState');
        if (savedStateJSON) {
            if (window.confirm('이전 시험에 이어서 진행하시겠습니까?')) {
                const savedState = JSON.parse(savedStateJSON);
                
                setQuestions(savedState.questions);
                setQuestionNumbers(savedState.questionNumbers);
                setSubjectiveInputs(savedState.subjectiveInputs);
                setTotalElapsedTime(savedState.totalElapsedTime);
                setOverallTimeLeft(savedState.overallTimeLeft);
                setCurrentProblemTime(savedState.currentProblemTime);
                setLapCounter(savedState.lapCounter);
                setTimeUp(savedState.timeUp);
                setIsPaused(savedState.isPaused);
                setStartTime(savedState.startTime);
                setLastLapTimestamp(savedState.lastLapTimestamp);
                setPauseTime(savedState.pauseTime);
                setFocusedQuestionNumber(savedState.focusedQuestionNumber);
                setBatchMode(savedState.batchMode);
                setBatchSelectedQuestions(new Set(savedState.batchSelectedQuestions));
                examConfigRef.current = savedState.examConfig;
                setStartQuestionStr(savedState.startQuestionStr);
                setEndQuestionStr(savedState.endQuestionStr);
                setTotalMinutesStr(savedState.totalMinutesStr);
                setIsUnlimitedTime(savedState.isUnlimitedTime);
                setSubmittedCorrectAnswers(savedState.submittedCorrectAnswers || {});
                setGradingModalInputs(savedState.gradingModalInputs || {});
                setGradingModalSubjective(new Set(savedState.gradingModalSubjective || []));

                // Restore flags
                setIsExamActive(savedState.isExamActive);
                setShowReview(savedState.showReview);

            } else {
                localStorage.removeItem('examState');
            }
        }
    }, []);


    const setProblemRef = (qNum: number, el: HTMLDivElement | null) => {
        problemRefs.current[qNum] = el;
    };

    const resetExamState = useCallback(() => {
        setIsExamActive(false);
        setShowReview(false);
        setQuestions({});
        setQuestionNumbers([]);
        setSubjectiveInputs({});
        setTotalElapsedTime(0);
        setOverallTimeLeft(Infinity);
        setCurrentProblemTime(0);
        setFocusedQuestionNumber(null);
        setBatchMode(false);
        setBatchSelectedQuestions(new Set());
        setSetupError('');
        setLapCounter(0);
        setTimeUp(false);
        setIsPaused(false);
        setIsGradingModalOpen(false);
        setSubmittedCorrectAnswers({});
        setGradingModalInputs({});
        setGradingModalSubjective(new Set());
        if (typeof timerRef.current === 'number') {
            cancelAnimationFrame(timerRef.current);
            timerRef.current = undefined;
        }
        problemRefs.current = {};
        localStorage.removeItem('examState');
    }, []);

    const handleFinishExam = useCallback(() => {
        if (!isExamActive) return;
        setIsExamActive(false);
        setPauseTime(performance.now());
        if (typeof timerRef.current === 'number') {
            cancelAnimationFrame(timerRef.current);
            timerRef.current = undefined;
        }
        if (overallTimeLeft <= 0 && !isUnlimitedTime) {
            setTimeUp(true);
        }
        setShowReview(true);
    }, [isExamActive, overallTimeLeft, isUnlimitedTime]);
    
    const handleTogglePause = useCallback(() => {
        setIsPaused(prevPaused => {
            if (prevPaused) { // Resuming
                const pausedDuration = performance.now() - pauseTime;
                setStartTime(prev => prev + pausedDuration);
                setLastLapTimestamp(prev => prev + pausedDuration);
            } else { // Pausing
                setPauseTime(performance.now());
            }
            return !prevPaused;
        });
    }, [pauseTime]);

    const handleJumpToQuestion = useCallback((questionNumber: number) => {
        setFocusedQuestionNumber(questionNumber);
        
        const container = problemListContainerRef.current;
        const targetElement = problemRefs.current[questionNumber];

        if (container && targetElement) {
            const containerRect = container.getBoundingClientRect();
            const targetRect = targetElement.getBoundingClientRect();

            const isVisible = targetRect.top >= containerRect.top && targetRect.bottom <= containerRect.bottom;
            if(isVisible) return; // Don't scroll if already visible

            const offset = targetElement.offsetTop - container.offsetTop;
            container.scrollTo({
                top: offset,
                behavior: 'smooth',
            });
        }
    }, []);

    const findNextQuestion = useCallback((currentQNum: number): number | null => {
        const currentIndex = questionNumbers.indexOf(currentQNum);
        if (currentIndex > -1 && currentIndex < questionNumbers.length - 1) {
            return questionNumbers[currentIndex + 1];
        }
        const firstUnanswered = questionNumbers.find(qNum => questions[qNum]?.attempts === 0 && qNum > currentQNum);
        if(firstUnanswered) return firstUnanswered;
        
        const firstUnansweredFromStart = questionNumbers.find(qNum => questions[qNum]?.attempts === 0);
        return firstUnansweredFromStart ?? null;
    }, [questionNumbers, questions]);
    
    const handleStartExam = useCallback(() => {
        const start = parseInt(startQuestionStr, 10);
        const end = parseInt(endQuestionStr, 10);
        const totalMinutes = parseInt(totalMinutesStr, 10);

        if (isNaN(start) || isNaN(end) || (!isUnlimitedTime && isNaN(totalMinutes)) || start <= 0 || end <= 0 || start > end) {
            setSetupError('유효한 문제 번호와 시험 시간을 입력해주세요.');
            return;
        }
        
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

        resetExamState();

        const initialQuestions: Record<number, Question> = {};
        const qNumbers: number[] = [];
        for (let i = start; i <= end; i++) {
            qNumbers.push(i);
            initialQuestions[i] = { number: i, solveTime: 0, answer: null, attempts: 0, solveEvents: [] };
        }
        
        setQuestions(initialQuestions);
        setQuestionNumbers(qNumbers);
        
        const firstQuestion = qNumbers[0];
        setFocusedQuestionNumber(firstQuestion);
        
        examConfigRef.current = { totalMinutes, isUnlimited: isUnlimitedTime };
        const totalSeconds = totalMinutes * 60;
        setOverallTimeLeft(isUnlimitedTime ? Infinity : totalSeconds);
        
        const now = performance.now();
        setStartTime(now);
        setLastLapTimestamp(now);
        setTimeUp(false);

        setIsExamActive(true);
    }, [startQuestionStr, endQuestionStr, totalMinutesStr, isUnlimitedTime, resetExamState]);
    
    const handleContinueExam = useCallback(() => {
        if (pauseTime === 0) return;
        const pausedDuration = performance.now() - pauseTime;
        setStartTime(prev => prev + pausedDuration);
        setLastLapTimestamp(prev => prev + pausedDuration);
        
        setShowReview(false);
        setIsExamActive(true);
    }, [pauseTime]);
    
    const handleRestartExam = useCallback(() => {
        setShowReview(false);
        resetExamState();
    }, [resetExamState]);

    const handleLap = useCallback((questionNumber: number, answer?: string) => {
        if (!isExamActive) return;
        
        handleJumpToQuestion(questionNumber);

        if (batchMode) {
            setBatchSelectedQuestions(prev => {
                const newSet = new Set(prev);
                if (newSet.has(questionNumber)) {
                    newSet.delete(questionNumber);
                } else {
                    newSet.add(questionNumber);
                }
                return newSet;
            });
            if (answer !== undefined) {
                 setQuestions(prev => ({
                    ...prev,
                    [questionNumber]: { ...prev[questionNumber], answer: answer === '' ? null : answer }
                }));
            }
            return;
        }
        
        const now = performance.now();
        const timeToAdd = (now - lastLapTimestamp) / 1000;
        const lapTimestamp = (now - startTime) / 1000;
        const lapStartTime = lapTimestamp - timeToAdd;
        
        setQuestions(prevQuestions => {
            const questionToUpdate = prevQuestions[questionNumber];
            if (!questionToUpdate) return prevQuestions;

            const newEvent: SolveEvent = { timestamp: lapTimestamp, duration: timeToAdd, answer };

            return {
                ...prevQuestions,
                [questionNumber]: {
                    ...questionToUpdate,
                    solveTime: questionToUpdate.solveTime + timeToAdd,
                    attempts: questionToUpdate.attempts + 1,
                    answer: answer !== undefined ? (answer === '' ? null : answer) : questionToUpdate.answer,
                    solveEvents: [...questionToUpdate.solveEvents, newEvent],
                    startTime: lapStartTime
                }
            };
        });
        
        setLastLapTimestamp(now);
        setCurrentProblemTime(0);
        setLapCounter(c => c + 1);
        
        const nextQuestionNumber = findNextQuestion(questionNumber);
        if (nextQuestionNumber !== null) {
            handleJumpToQuestion(nextQuestionNumber);
        }

    }, [isExamActive, batchMode, findNextQuestion, handleJumpToQuestion, lastLapTimestamp, startTime]);

    const handleBatchRecord = useCallback(() => {
        if (!isExamActive || batchSelectedQuestions.size === 0) return;

        const now = performance.now();
        const timeSinceLastLap = (now - lastLapTimestamp) / 1000;
        const timePerQuestion = timeSinceLastLap / batchSelectedQuestions.size;
        const lapTimestamp = (now - startTime) / 1000;
        const lapStartTime = lapTimestamp - timeSinceLastLap;
        
        setQuestions(prev => {
            const newQuestions = { ...prev };
            const newEvent: Omit<SolveEvent, 'answer'> = { timestamp: lapTimestamp, duration: timePerQuestion };
            batchSelectedQuestions.forEach(qNum => {
                const existingQ = newQuestions[qNum];
                if (existingQ) {
                    newQuestions[qNum] = {
                        ...existingQ,
                        solveTime: existingQ.solveTime + timePerQuestion,
                        attempts: existingQ.attempts + 1,
                        solveEvents: [...existingQ.solveEvents, { ...newEvent, answer: existingQ.answer ?? undefined }],
                        startTime: lapStartTime
                    };
                }
            });
            return newQuestions;
        });

        setLastLapTimestamp(now);
        setCurrentProblemTime(0);
        setBatchSelectedQuestions(new Set());
        setBatchMode(false);
        setLapCounter(c => c + 1);
    }, [isExamActive, batchSelectedQuestions, lastLapTimestamp, startTime]);

    const handleResetCurrentTime = useCallback(() => {
        if (!isExamActive) return;
        setLastLapTimestamp(performance.now());
        setCurrentProblemTime(0);
    }, [isExamActive]);
    
    const handleQuestionFocus = useCallback((questionNumber: number) => {
        setFocusedQuestionNumber(questionNumber);
    }, []);

    const handleGradeSubmit = (submittedAnswers: Record<number, string>) => {
        setSubmittedCorrectAnswers(submittedAnswers);
        setIsGradingModalOpen(false);
    };

    const handleLoadBookmark = (bookmarkQuestions: Question[]) => {
        // 즐겨찾기에서 불러온 데이터로 상태 복원
        const questionNumbers = bookmarkQuestions.map(q => q.number);
        setQuestions(bookmarkQuestions.reduce((acc, q) => ({ ...acc, [q.number]: q }), {}));
        setQuestionNumbers(questionNumbers);
        setFocusedQuestionNumber(questionNumbers[0]);
        setIsExamActive(false);
        setShowReview(true);
    };

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


    useEffect(() => {
        if (!isExamActive || isPaused) {
            if (timerRef.current) {
                cancelAnimationFrame(timerRef.current);
                timerRef.current = undefined;
            }
            return;
        };

        const tick = (timestamp: number) => {
            const totalElapsed = (timestamp - startTime) / 1000;
            const currentProblemElapsed = (timestamp - lastLapTimestamp) / 1000;

            setTotalElapsedTime(totalElapsed);
            setCurrentProblemTime(currentProblemElapsed);
            
            if (!examConfigRef.current.isUnlimited) {
                const timeLeft = (examConfigRef.current.totalMinutes * 60) - totalElapsed;
                setOverallTimeLeft(timeLeft);
                if (timeLeft <= 0 && !timeUp) {
                   handleFinishExam();
                   return; // Stop the loop
                }
            }
            timerRef.current = requestAnimationFrame(tick);
        };

        timerRef.current = requestAnimationFrame(tick);
        return () => {
            if (typeof timerRef.current === 'number') cancelAnimationFrame(timerRef.current);
        };
    }, [isExamActive, isPaused, handleFinishExam, timeUp, startTime, lastLapTimestamp]);

    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (!isExamActive || isPaused || showReview || isGradingModalOpen) {
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
    }, [isExamActive, isPaused, showReview, isGradingModalOpen, focusedQuestionNumber, handleLap]);


    const focusedQuestion = focusedQuestionNumber ? questions[focusedQuestionNumber] : null;

    return (
        <>
            {showReview && <ReviewModal 
                questions={questionsWithGrading} 
                onContinue={handleContinueExam} 
                onRestart={handleRestartExam} 
                onGradeRequest={() => setIsGradingModalOpen(true)}
            />}
            <GradingModal
                isOpen={isGradingModalOpen}
                onClose={() => setIsGradingModalOpen(false)}
                onSubmit={handleGradeSubmit}
                startProblem={questionNumbers.length > 0 ? questionNumbers[0] : parseInt(startQuestionStr) || 1}
                endProblem={questionNumbers.length > 0 ? questionNumbers[questionNumbers.length - 1] : parseInt(endQuestionStr) || 45}
                answers={gradingModalInputs}
                onAnswerChange={setGradingModalInputs}
                subjectiveProblems={gradingModalSubjective}
                onSubjectiveChange={setGradingModalSubjective}
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

            <BookmarkModal
                isOpen={isBookmarkModalOpen}
                onClose={() => setIsBookmarkModalOpen(false)}
                onLoadBookmark={handleLoadBookmark}
            />

             {/* Mobile: Toggle button - now outside the grid */}
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
                {/* Desktop: Always visible on the left */}
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
                    {isExamActive && (
                        <Card className="sticky top-8 z-10 bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-sm">
                            <TimerDisplay 
                                isUnlimited={isUnlimitedTime}
                                timeLeft={overallTimeLeft}
                                totalElapsed={totalElapsedTime}
                                currentProblem={currentProblemTime}
                                isExamActive={isExamActive}
                                isPaused={isPaused}
                                timeUp={timeUp}
                                onTogglePause={handleTogglePause}
                                onResetTime={handleResetCurrentTime}
                                onFinish={handleFinishExam}
                                startQuestion={startQuestionStr}
                                endQuestion={endQuestionStr}
                                totalMinutes={totalMinutesStr}
                            />
                        </Card>
                    )}

                    {!isExamActive && (
                        <>
                            <Card>
                                <SetupPanel
                                    startQuestion={startQuestionStr}
                                    setStartQuestion={setStartQuestionStr}
                                    endQuestion={endQuestionStr}
                                    setEndQuestion={setEndQuestionStr}
                                    totalMinutes={totalMinutesStr}
                                    setTotalMinutes={setTotalMinutesStr}
                                    isUnlimited={isUnlimitedTime}
                                    setIsUnlimited={setIsUnlimitedTime}
                                    isExamActive={isExamActive}
                                    onStart={handleStartExam}
                                    error={setupError}
                                />
                            </Card>
                            
                            <Card>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold mb-4 text-slate-800 dark:text-slate-200">
                                        저장된 시험 기록
                                    </h3>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                                        이전에 저장한 시험 기록을 확인할 수 있습니다.
                                    </p>
                                    <Button 
                                        onClick={() => setIsBookmarkModalOpen(true)}
                                        variant="secondary"
                                        className="w-full"
                                    >
                                        시험 기록 목록 보기
                                    </Button>
                                </div>
                            </Card>
                        </>
                    )}

                    {isExamActive && focusedQuestion && (
                         <Card>
                           <DynamicMarkingWindow
                               key={`focused-${focusedQuestion.number}`}
                               isExamActive={isExamActive}
                               question={focusedQuestion}
                               batchSelected={batchSelectedQuestions.has(focusedQuestion.number)}
                               onLap={handleLap}
                               subjectiveInput={subjectiveInputs[focusedQuestion.number] ?? ''}
                               onSubjectiveInputChange={(value) => setSubjectiveInputs(prev => ({...prev, [focusedQuestion.number]: value}))}
                           />
                         </Card>
                    )}

                    {isExamActive && (
                        <QuickNav 
                            questionNumbers={questionNumbers} 
                            onJumpTo={handleJumpToQuestion}
                            focusedQuestionNumber={focusedQuestionNumber}
                        />
                    )}

                    <Card className="space-y-4">
                        <ControlToolbar
                            isExamActive={isExamActive}
                            batchMode={batchMode}
                            onBatchModeChange={(enabled) => {
                                setBatchMode(enabled);
                                if (!enabled) {
                                    setBatchSelectedQuestions(new Set());
                                }
                            }}
                            onBatchRecord={handleBatchRecord}
                            isBatchRecordDisabled={!isExamActive || !batchMode || batchSelectedQuestions.size === 0}
                        />
                       
                       <div className="border-t border-slate-700 pt-4">
                           {isExamActive ? (
                             <div>
                               <h3 className="text-lg font-bold mb-3">전체 문제 목록</h3>
                               <ProblemList
                                    ref={problemListContainerRef}
                                    isExamActive={isExamActive}
                                    questionNumbers={questionNumbers}
                                    questions={questions}
                                    batchSelectedQuestions={batchSelectedQuestions}
                                    subjectiveInputs={subjectiveInputs}
                                    onLap={handleLap}
                                    onSubjectiveInputChange={(qNum, val) => setSubjectiveInputs(prev => ({...prev, [qNum]: val}))}
                                    setProblemRef={setProblemRef}
                                    onQuestionFocus={handleQuestionFocus}
                               />
                             </div>
                           ) : (
                             <div className="text-center text-slate-500 p-8">시험을 설정하고 시작하세요.</div>
                           )}
                       </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default ExamScreen;