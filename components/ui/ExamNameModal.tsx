import React, { useState, useEffect } from 'react';
import { Button } from './Button';

interface ExamNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (name: string) => void;
}

export const ExamNameModal: React.FC<ExamNameModalProps> = ({ isOpen, onClose, onSave }) => {
    const [examName, setExamName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setExamName('');
        }
    }, [isOpen]);

    const handleSave = () => {
        const trimmedName = examName.trim();
        if (trimmedName) {
            onSave(trimmedName);
            onClose();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div 
                className="bg-card dark:bg-card/95 rounded-2xl shadow-2xl w-full max-w-md min-w-0 overflow-hidden flex flex-col modal-container" 
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 sm:p-6 border-b border-border flex-shrink-0">
                    <h2 className="text-lg sm:text-xl font-bold text-foreground">시험 기록 저장</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        시험 기록의 이름을 입력해주세요.
                    </p>
                </header>
                
                <main className="p-4 sm:p-6">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="examName" className="block text-sm font-medium text-foreground mb-2">
                                시험 이름
                            </label>
                            <input
                                id="examName"
                                type="text"
                                value={examName}
                                onChange={(e) => setExamName(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="예: 2024 수능 국어, PSAT 언어논리, 모의고사 1회차"
                                className="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring text-base"
                                autoFocus
                            />
                        </div>
                        <div className="text-xs text-muted-foreground">
                            구체적인 이름을 입력하면 나중에 찾기 쉽습니다.
                        </div>
                    </div>
                </main>
                
                <footer className="p-4 border-t border-border flex justify-end gap-2">
                    <Button onClick={onClose} variant="secondary" className="text-sm px-3 py-2">
                        취소
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        variant="default"
                        disabled={!examName.trim()}
                        className="text-sm px-3 py-2"
                    >
                        저장
                    </Button>
                </footer>
            </div>
        </div>
    );
}; 