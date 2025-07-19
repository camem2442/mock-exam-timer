import { useState, useCallback } from 'react';
import { copyToClipboard } from '../utils/clipboard';

interface UseCopyToClipboardReturn {
  copy: (text: string) => Promise<void>;
  isCopied: boolean;
  error: string | null;
  reset: () => void;
}

export const useCopyToClipboard = (duration = 2000): UseCopyToClipboardReturn => {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  let timeoutId: NodeJS.Timeout | null = null;

  const reset = useCallback(() => {
    setIsCopied(false);
    setError(null);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }, []);

  const copy = useCallback(async (text: string) => {
    // 이전 타임아웃 클리어
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    try {
      const result = await copyToClipboard(text);
      
      if (result.success) {
        setIsCopied(true);
        setError(null);
        
        // 지정된 시간 후 상태 리셋
        timeoutId = setTimeout(() => {
          setIsCopied(false);
        }, duration);
      } else {
        setIsCopied(false);
        setError(result.error || '복사에 실패했습니다.');
        
        // 에러도 일정 시간 후 리셋
        timeoutId = setTimeout(() => {
          setError(null);
        }, duration * 2); // 에러는 더 오래 표시
      }
    } catch (err) {
      setIsCopied(false);
      setError('예기치 않은 오류가 발생했습니다.');
      
      timeoutId = setTimeout(() => {
        setError(null);
      }, duration * 2);
    }
  }, [duration]);

  return {
    copy,
    isCopied,
    error,
    reset
  };
};