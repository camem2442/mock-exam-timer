import { useState, useEffect } from 'react';

export interface ExamSetupState {
  examName: string;
  startQuestionStr: string;
  endQuestionStr: string;
  totalMinutesStr: string;
  isUnlimitedTime: boolean;
}

export interface ExamSetupSetters {
  setExamName: React.Dispatch<React.SetStateAction<string>>;
  setStartQuestionStr: React.Dispatch<React.SetStateAction<string>>;
  setEndQuestionStr: React.Dispatch<React.SetStateAction<string>>;
  setTotalMinutesStr: React.Dispatch<React.SetStateAction<string>>;
  setIsUnlimitedTime: React.Dispatch<React.SetStateAction<boolean>>;
}

export type ExamSetup = ExamSetupState & ExamSetupSetters;

interface ExamPreset {
  name: string;
  start: number;
  end: number;
  time: number;
}

export const useExamSetup = () => {
  const [examName, setExamName] = useState('');
  const [startQuestionStr, setStartQuestionStr] = useState('1');
  const [endQuestionStr, setEndQuestionStr] = useState('45');
  const [totalMinutesStr, setTotalMinutesStr] = useState('70');
  const [isUnlimitedTime, setIsUnlimitedTime] = useState(false);

  // Effect for loading setup settings from localStorage on initial mount
  useEffect(() => {
    try {
      const savedSetupJSON = localStorage.getItem('examSetup');
      if (savedSetupJSON) {
        const savedSetup = JSON.parse(savedSetupJSON) as Partial<ExamSetupState>;
        setExamName(savedSetup.examName || '');
        setStartQuestionStr(savedSetup.startQuestionStr || '1');
        setEndQuestionStr(savedSetup.endQuestionStr || '45');
        setTotalMinutesStr(savedSetup.totalMinutesStr || '70');
        setIsUnlimitedTime(savedSetup.isUnlimitedTime || false);
      }
    } catch (error) {
      console.error("Failed to load or parse exam setup from localStorage", error);
    }
  }, []);

  // Effect for saving setup settings to localStorage
  useEffect(() => {
    try {
      const setupSettings: ExamSetupState = {
        examName,
        startQuestionStr,
        endQuestionStr,
        totalMinutesStr,
        isUnlimitedTime,
      };
      localStorage.setItem('examSetup', JSON.stringify(setupSettings));
    } catch (error) {
      console.error("Failed to save exam setup to localStorage", error);
    }
  }, [examName, startQuestionStr, endQuestionStr, totalMinutesStr, isUnlimitedTime]);

  const handlePresetClick = (preset: ExamPreset) => () => {
    setExamName(preset.name);
    setStartQuestionStr(String(preset.start));
    setEndQuestionStr(String(preset.end));
    setTotalMinutesStr(String(preset.time));
    setIsUnlimitedTime(false);
  };

  return {
    examName,
    setExamName,
    startQuestionStr,
    setStartQuestionStr,
    endQuestionStr,
    setEndQuestionStr,
    totalMinutesStr,
    setTotalMinutesStr,
    isUnlimitedTime,
    setIsUnlimitedTime,
    handlePresetClick,
  };
}; 