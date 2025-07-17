import { type Question } from '../types';
import { formatTime } from './formatters';

export interface ExportData {
  questions: Question[];
  totalTime: number;
  totalQuestions: number;
  date: string;
}

/**
 * 문제 데이터를 CSV 형식으로 변환
 */
export const generateCSV = (data: ExportData): string => {
  const { questions, totalTime, totalQuestions, date } = data;
  
  // CSV 헤더 (한글)
  const headers = [
    '문제번호',
    '소요시간(초)',
    '소요시간(분:초)',
    '답안',
    '정답여부',
    '시도횟수',
    '시작시간(초)',
    '종료시간(초)'
  ].join(',');

  // CSV 데이터 행들
  const rows = questions.map(q => [
    q.number,
    q.solveTime.toFixed(1),
    formatTime(q.solveTime),
    q.answer || '미입력',
    q.isCorrect === true ? 'O' : q.isCorrect === false ? 'X' : '-',
    q.attempts,
    q.startTime ? q.startTime.toFixed(1) : '-',
    q.solveEvents.length > 0 ? q.solveEvents[q.solveEvents.length - 1].timestamp.toFixed(1) : '-'
  ].join(','));

  // 요약 정보
  const summary = [
    '',
    '',
    '',
    '',
    '',
    '',
    '',
    ''
  ].join(',');
  
  const summary2 = [
    '총 문제 수',
    totalQuestions,
    '',
    '',
    '',
    '',
    '',
    ''
  ].join(',');
  
  const summary3 = [
    '총 소요시간(초)',
    totalTime.toFixed(1),
    '',
    '',
    '',
    '',
    '',
    ''
  ].join(',');
  
  const summary4 = [
    '총 소요시간(분:초)',
    formatTime(totalTime),
    '',
    '',
    '',
    '',
    '',
    ''
  ].join(',');
  
  const summary5 = [
    '내보내기 날짜',
    date,
    '',
    '',
    '',
    '',
    '',
    ''
  ].join(',');

  return [
    headers,
    ...rows,
    summary,
    summary2,
    summary3,
    summary4,
    summary5
  ].join('\n');
};

/**
 * 클립보드에 CSV 복사
 */
export const copyToClipboard = async (csvData: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(csvData);
    return true;
  } catch (error) {
    // 폴백: 수동 복사
    const textArea = document.createElement('textarea');
    textArea.value = csvData;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};

/**
 * CSV 파일 다운로드
 */
export const downloadCSV = (csvData: string, filename: string): void => {
  const blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * 엑셀용 TSV 형식 생성 (탭으로 구분)
 */
export const generateTSV = (data: ExportData): string => {
  const csvData = generateCSV(data);
  return csvData.replace(/,/g, '\t');
}; 