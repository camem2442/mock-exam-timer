import { useState, useEffect, useRef, useCallback } from 'react';

export interface TimerRestoreState {
  elapsedTime: number;
  currentProblemTime: number;
  isPaused: boolean;
  timeUp: boolean;
}

interface UseTimerProps {
  totalMinutes: number;
  isUnlimited: boolean;
  onTimeUp?: () => void;
  restoreState?: TimerRestoreState;
}

export const useTimer = ({ totalMinutes, isUnlimited, onTimeUp, restoreState }: UseTimerProps) => {
  const totalTimeInSeconds = totalMinutes * 60;

  // Core state - the single source of truth for time.
  const [elapsedTime, setElapsedTime] = useState(0);
  const [currentProblemTime, setCurrentProblemTime] = useState(0);

  // Control states
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [timeUp, setTimeUp] = useState(false);
  
  // Derived state, calculated from the core state
  const timeLeft = isUnlimited ? Infinity : totalTimeInSeconds - elapsedTime;
  const overtime = timeUp ? elapsedTime - totalTimeInSeconds : 0;

  // Refs for internal timer mechanics
  const intervalRef = useRef<number | null>(null);
  const timeUpFiredRef = useRef(false);

  // Main timer tick effect
  useEffect(() => {
    // Timer should only run when the exam is active and not paused.
    if (isRunning && !isPaused) {
      intervalRef.current = window.setInterval(() => {
        // Increment timers by the interval duration (0.05 seconds)
        setElapsedTime(prev => prev + 0.05);
        setCurrentProblemTime(prev => prev + 0.05);
      }, 50);
    }
    
    // Cleanup: clear interval when component unmounts or dependencies change.
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused]);

  // Effect to check if time is up
  useEffect(() => {
    if (!isUnlimited && timeLeft <= 0 && !timeUp && !timeUpFiredRef.current) {
      setTimeUp(true);
      setIsPaused(true); // Automatically pause
      onTimeUp?.();
      timeUpFiredRef.current = true;
    }
  }, [timeLeft, isUnlimited, timeUp, onTimeUp]);
  
  // Effect to load state from restore prop
  useEffect(() => {
    if (restoreState) {
      setElapsedTime(restoreState.elapsedTime);
      setCurrentProblemTime(restoreState.currentProblemTime);
      setTimeUp(restoreState.timeUp ?? false);
      timeUpFiredRef.current = restoreState.timeUp ?? false;
      setIsPaused(true); // Always restore in paused state
      setIsRunning(true); // It was running before
    }
  }, [restoreState]);

  const start = useCallback(() => {
    // Reset all timer states to their initial values.
    setElapsedTime(0);
    setCurrentProblemTime(0);
    setTimeUp(false);
    timeUpFiredRef.current = false;
    setIsRunning(true);
    
    // Start paused, then unpause after a short delay
    // This gives the user a moment to see the initial time (e.g., 80:00)
    setIsPaused(true);

    const startTimeout = setTimeout(() => {
      setIsPaused(false);
    }, 500); // 0.5-second delay

    // Cleanup timeout if the component unmounts before it fires
    return () => clearTimeout(startTimeout);
  }, []);

  const togglePause = useCallback(() => {
    if (!isRunning) return;
    setIsPaused(p => !p);
  }, [isRunning]);

  const stop = useCallback(() => {
    // Stop should just be a definitive pause.
    // It doesn't need to change the isRunning state, 
    // because resuming is handled by togglePause.
    setIsPaused(true);
  }, []);

  const recordLap = useCallback(() => {
    // Simply reset the current problem's timer. Total elapsed time is unaffected.
    setCurrentProblemTime(0);
  }, []);

  const reset = useCallback(() => {
    setElapsedTime(0);
    setCurrentProblemTime(0);
    setTimeUp(false);
    timeUpFiredRef.current = false;
    setIsPaused(true);
    setIsRunning(false);
  }, []);

  return {
    elapsedTime,
    timeLeft,
    currentProblemTime,
    overtime,
    isPaused,
    isRunning,
    timeUp,
    start,
    togglePause,
    stop,
    recordLap,
    reset,
  };
}; 