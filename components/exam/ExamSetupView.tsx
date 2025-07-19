import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import SetupPanel from './SetupPanel';
import { type useExamSetup } from '../../hooks/useExamSetup';

type ExamSetupReturn = ReturnType<typeof useExamSetup>;

interface ExamSetupViewProps {
  examSetup: ExamSetupReturn;
  onStart: () => void;
  onShowRecords: () => void;
  error: string;
}

export const ExamSetupView: React.FC<ExamSetupViewProps> = ({
  examSetup,
  onStart,
  onShowRecords,
  error,
}) => {
  const {
    examName, setExamName,
    startQuestionStr, setStartQuestionStr,
    endQuestionStr, setEndQuestionStr,
    totalMinutesStr, setTotalMinutesStr,
    isUnlimitedTime, setIsUnlimitedTime,
  } = examSetup;

  return (
    <div className="lg:col-span-3 space-y-8">
      <Card>
        <SetupPanel
          examName={examName}
          setExamName={setExamName}
          startQuestion={startQuestionStr}
          setStartQuestion={setStartQuestionStr}
          endQuestion={endQuestionStr}
          setEndQuestion={setEndQuestionStr}
          totalMinutes={totalMinutesStr}
          setTotalMinutes={setTotalMinutesStr}
          isUnlimited={isUnlimitedTime}
          setIsUnlimited={setIsUnlimitedTime}
          isExamActive={false} // This view is only shown when exam is not active
          onStart={onStart}
          error={error}
          onShowRecords={onShowRecords}
        />
      </Card>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            저장된 시험 기록
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            이전에 저장한 시험 기록을 확인할 수 있습니다.
          </p>
          <Button 
            onClick={onShowRecords}
            variant="secondary"
            className="w-full"
          >
            시험 기록 목록 보기
          </Button>
        </div>
      </Card>
    </div>
  );
}; 