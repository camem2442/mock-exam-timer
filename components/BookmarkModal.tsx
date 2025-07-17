import React, { useState, useEffect } from 'react';
import { type Question } from '../types';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { formatTime } from '../utils/formatters';

interface BookmarkData {
    id: number;
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

    const handleLoadBookmark = (bookmark: BookmarkData) => {
        onLoadBookmark(bookmark.questions);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-slate-50 dark:bg-slate-900/95 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">시험 기록 목록</h2>
                    <p className="mt-2 text-slate-600 dark:text-slate-400">
                        저장된 시험 기록을 확인하고 불러올 수 있습니다.
                    </p>
                </header>
                
                <main className="overflow-y-auto overflow-x-hidden p-6 space-y-4">
                    {bookmarks.length === 0 ? (
                        <div className="text-center text-slate-500 p-8">
                            저장된 시험 기록이 없습니다.
                        </div>
                    ) : (
                        bookmarks.map((bookmark) => (
                            <Card key={bookmark.id} className="p-4">
                                <div className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                                            {new Date(bookmark.date).toLocaleString('ko-KR')}
                                        </h3>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                                            {bookmark.summary}
                                        </p>
                                        <div className="text-xs text-slate-500">
                                            총 소요시간: {formatTime(bookmark.questions.reduce((sum, q) => sum + q.solveTime, 0))}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button 
                                            onClick={() => handleLoadBookmark(bookmark)}
                                            variant="primary"
                                            size="sm"
                                        >
                                            불러오기
                                        </Button>
                                        <Button 
                                            onClick={() => handleDeleteBookmark(bookmark.id)}
                                            variant="danger"
                                            size="sm"
                                        >
                                            삭제
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    )}
                </main>
                
                <footer className="p-4 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                    <Button onClick={onClose} variant="secondary">
                        닫기
                    </Button>
                </footer>
            </div>
        </div>
    );
};

export default BookmarkModal; 