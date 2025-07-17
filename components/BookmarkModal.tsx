import React, { useState, useEffect } from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatTime } from '../utils/formatters';
import { generateCSV, copyToClipboard, downloadCSV, type ExportData } from '../utils/exportUtils';

interface BookmarkData {
    id: number;
    name?: string; // 시험 이름 (선택적)
    date: string;
    questions: Question[];
    summary: string;
}

interface BookmarkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoadBookmark: (questions: Question[]) => void;
}

const BookmarkModal: React.FC<BookmarkModalProps> = ({ isOpen, onClose, onLoadBookmark }) => {
    const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editingName, setEditingName] = useState<string>('');

    useEffect(() => {
        if (isOpen) {
            const savedBookmarks = JSON.parse(localStorage.getItem('examBookmarks') || '[]');
            setBookmarks(savedBookmarks);
        }
    }, [isOpen]);

    const handleDeleteBookmark = (id: number) => {
        const updatedBookmarks = bookmarks.filter(b => b.id !== id);
        localStorage.setItem('examBookmarks', JSON.stringify(updatedBookmarks));
        setBookmarks(updatedBookmarks);
    };

    const handleStartEdit = (bookmark: BookmarkData) => {
        setEditingId(bookmark.id);
        setEditingName(bookmark.name || '');
    };

    const handleSaveEdit = () => {
        if (!editingId) return;
        
        const updatedBookmarks = bookmarks.map(b => 
            b.id === editingId ? { ...b, name: editingName.trim() } : b
        );
        localStorage.setItem('examBookmarks', JSON.stringify(updatedBookmarks));
        setBookmarks(updatedBookmarks);
        setEditingId(null);
        setEditingName('');
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditingName('');
    };

    const handleLoadBookmark = (bookmark: BookmarkData) => {
        onLoadBookmark(bookmark.questions);
        onClose();
    };

    const handleExportBookmark = async (bookmark: BookmarkData) => {
        const totalTime = bookmark.questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions: bookmark.questions,
            totalTime,
            totalQuestions: bookmark.questions.length,
            date: new Date(bookmark.date).toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        const success = await copyToClipboard(csvData);
        
        if (success) {
            alert('풀이 데이터가 클립보드에 복사되었습니다!\n\n엑셀에서 Ctrl+V로 붙여넣기 하세요.');
        } else {
            alert('클립보드 복사에 실패했습니다.');
        }
    };

    const handleDownloadBookmarkCSV = (bookmark: BookmarkData) => {
        const totalTime = bookmark.questions.reduce((sum, q) => sum + q.solveTime, 0);
        const exportData: ExportData = {
            questions: bookmark.questions,
            totalTime,
            totalQuestions: bookmark.questions.length,
            date: new Date(bookmark.date).toLocaleString('ko-KR')
        };

        const csvData = generateCSV(exportData);
        const filename = `시험기록_${new Date(bookmark.date).toISOString().split('T')[0]}.csv`;
        downloadCSV(csvData, filename);
    };

    if (!isOpen) return null;

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
                    {bookmarks.length === 0 ? (
                        <div className="text-center text-slate-500 p-8">
                            저장된 시험 기록이 없습니다.
                        </div>
                    ) : (
                        bookmarks.map((bookmark) => (
                            <Card key={bookmark.id} className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                                    <div className="flex-1 w-full">
                                        {editingId === bookmark.id ? (
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
                                                    {bookmark.name || '이름 없는 시험'}
                                                </h3>
                                                <button
                                                    onClick={() => handleStartEdit(bookmark)}
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
                                            {new Date(bookmark.date).toLocaleString('ko-KR')} • {bookmark.summary}
                                        </p>
                                        <div className="text-xs text-slate-500">
                                            총 소요시간: {formatTime(bookmark.questions.reduce((sum, q) => sum + q.solveTime, 0))}
                                        </div>
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleLoadBookmark(bookmark)}
                                                variant="primary"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                불러오기
                                            </Button>
                                            <Button 
                                                onClick={() => handleDeleteBookmark(bookmark.id)}
                                                variant="danger"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                삭제
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button 
                                                onClick={() => handleExportBookmark(bookmark)}
                                                variant="secondary"
                                                size="sm"
                                                className="flex-1 sm:flex-none text-xs sm:text-sm"
                                            >
                                                CSV 복사
                                            </Button>
                                            <Button 
                                                onClick={() => handleDownloadBookmarkCSV(bookmark)}
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

export default BookmarkModal; 