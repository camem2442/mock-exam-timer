import { useState, useEffect, useCallback } from 'react';
import { type Question } from '../types';

/**
 * 저장된 단일 시험 기록의 데이터 구조
 */
export interface ExamRecord {
  id: number;
  name?: string;
  date: string;
  questions: Question[];
  summary: string;
}

const STORAGE_KEY = 'examRecords';
const LEGACY_STORAGE_KEY = 'examBookmarks';

export const useExamRecord = () => {
  const [records, setRecords] = useState<Record<number, ExamRecord>>({});
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);

  // Load records from localStorage on initial mount
  useEffect(() => {
    try {
      const rawData = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (rawData) {
        const parsedData = JSON.parse(rawData);
        
        // 데이터가 배열인지 객체인지 확인하여 처리
        if (Array.isArray(parsedData)) {
          // 배열 형식 (기존 방식)
          const recordsObject = parsedData.reduce((acc, record) => {
            if (record && typeof record.id !== 'undefined') {
              acc[record.id] = record;
            }
            return acc;
          }, {} as Record<number, ExamRecord>);
          setRecords(recordsObject);
        } else if (typeof parsedData === 'object' && parsedData !== null) {
          // 객체 형식 (안전 장치)
          setRecords(parsedData);
        }
      }
    } catch (error) {
      console.error("Failed to load or parse exam records from localStorage", error);
      // 만약 파싱에 실패하면, 이전 키들을 삭제하여 문제를 해결 시도
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, []);

  const addRecord = useCallback((newRecordData: Omit<ExamRecord, 'id' | 'date' | 'summary'>) => {
    setRecords(prevRecords => {
        const newId = Date.now();
        const newRecord: ExamRecord = {
            id: newId,
            date: new Date().toISOString(),
            ...newRecordData,
            summary: `${newRecordData.questions.length}문제, 총 ${Math.round(newRecordData.questions.reduce((sum, q) => sum + q.solveTime, 0))}초`
        };
        const updatedRecords = { ...prevRecords, [newId]: newRecord };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(Object.values(updatedRecords)));
        return updatedRecords;
    });
}, []);

  // Save records to localStorage whenever they change
  useEffect(() => {
    const recordsArray = Object.values(records);
    if (recordsArray.length > 0) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recordsArray));
    } else {
        // 기록이 모두 삭제되었을 경우 localStorageからも削除
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem(LEGACY_STORAGE_KEY);
    }
  }, [records]);

  const updateRecordName = useCallback((id: number, name: string) => {
    setRecords(prevRecords => {
      if (!prevRecords[id]) return prevRecords;
      return {
        ...prevRecords,
        [id]: { ...prevRecords[id], name: name.trim() },
      };
    });
  }, []);

  const deleteRecord = (id: number) => {
    setRecords(prevRecords => {
      const { [id]: _, ...remaining } = prevRecords;
      return remaining;
    });
  };
  
  return { records, isRecordModalOpen, setIsRecordModalOpen, addRecord, updateRecordName, deleteRecord };
}; 