import React, { useState } from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatTime } from '../utils/formatters';
import { generateCSV, copyToClipboard, downloadCSV, type ExportData } from '../utils/exportUtils';
import { useExamRecord, type ExamRecord } from '../hooks/useExamRecord';

interface RecordModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadRecord: (record: ExamRecord) => void;
}

const RecordModal: React.FC<RecordModalProps> = ({ isOpen, onClose, onLoadRecord }) => {
    const { records, updateRecordName, deleteRecord } = useExamRecord();
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');

    const handleStartEdit = (record: ExamRecord) => {
        setEditingId(record.id);
        setEditingName(record.name || '');
    };

    const handleSaveEdit = () => {
        if (!editingId) return;
        updateRecordName(editingId, editingName);
        setEditingId(null);
        setEditingName('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleLoadRecord = (record: ExamRecord) => {
        onLoadRecord(record);
        onClose();
    };

    const handleExportRecord = async (record: ExamRecord) => {
        const totalTime = record.questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions: record.questions,
            totalTime,
            totalQuestions: record.questions.length,
            date: new Date(record.date).toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        const success = await copyToClipboard(csvData);
        
        if (success) {
            alert('풀이 데이터가 클립보드에 복사되었습니다!\n\n엑셀에서 Ctrl+V로 붙여넣기 하세요.');
        } else {
            alert('클립보드 복사에 실패했습니다.');
        }
    };

    const handleDownloadRecordCSV = (record: ExamRecord) => {
        const totalTime = record.questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions: record.questions,
            totalTime,
            totalQuestions: record.questions.length,
            date: new Date(record.date).toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        const filename = `시험기록_${new Date(record.date).toISOString().split('T')[0]}.csv`;
        downloadCSV(csvData, filename);
    };

    if (!isOpen) return null;

    const recordList = Object.values(records);

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] min-w-0 overflow-hidden flex flex-col modal-container" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">시험 기록 목록</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        저장된 시험 기록을 확인하고 불러올 수 있습니다.
                    </p>
                </header>
                
                <main className="overflow-y-auto overflow-x-hidden p-4 sm:p-6 space-y-4">
                    {recordList.length === 0 ? (
                        <div className="text-center text-slate-500 p-8">
                            저장된 시험 기록이 없습니다.
                        </div>
                    ) : (
                        recordList.map((record) => (
                            <Card key={record.id} className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex-1 w-full">
                                        {editingId === record.id ? (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                                                <input
                                                    type="text"
                                                    value={editingName}
                                                    onChange={(e) => setEditingName(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleSaveEdit();
                                                        if (e.key === 'Escape') handleCancelEdit();
                                                    }}
                                                    className="flex-1 px-2 py-1 text-sm font-semibold bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:outline-none focus:ring-2 focus:ring-primary-500 text-base"
                                                    autoFocus
                                                />
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={handleSaveEdit}
                                                        className="opacity-70 hover:opacity-100 transition-opacity p-1"
                                                        title="저장"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="opacity-70 hover:opacity-100 transition-opacity p-1"
                                                        title="취소"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 mb-2">
                                                <h3 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
                                                    {record.name || '이름 없는 시험'}
                                                </h3>
                                                <button
                                                    onClick={() => handleStartEdit(record)}
                                                    className="opacity-50 hover:opacity-100 transition-opacity p-1"
                                                    title="이름 변경"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            {new Date(record.date).toLocaleString('ko-KR')} • {record.summary}
                                        </p>
                                        <div className="text-xs text-slate-500">
                                            총 소요시간: {formatTime(record.questions.reduce((sum, q) => sum + q.solveTime, 0))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleLoadRecord(record)}
                                                variant="primary"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                불러오기
                                            </Button>
                                            <Button 
                                                onClick={() => deleteRecord(record.id)}
                                                variant="danger"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                삭제
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleExportRecord(record)}
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                CSV 복사
                                            </Button>
                                            <Button 
                                                onClick={() => handleDownloadRecordCSV(record)}
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                CSV 다운로드
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </main>
                
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <Button onClick={onClose} variant="secondary" className="text-sm px-3 py-2">
                        닫기
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default RecordModal; 