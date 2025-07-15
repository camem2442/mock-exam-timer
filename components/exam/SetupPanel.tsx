import type { FC } from 'react';
import { Input } from '../ui/Input';
import { ToggleSwitch } from '../ui/ToggleSwitch';
import { Button } from '../ui/Button';

const presetCategories = [
  {
    category: '수능',
    presets: [
      { label: '국어', minutes: 80, start: 1, end: 45 },
      { label: '수학', minutes: 100, start: 1, end: 30 },
      { label: '영어', minutes: 70, start: 1, end: 45 },
      { label: '영어(독해)', minutes: 45, start: 18, end: 45 },
      { label: '탐구', minutes: 30, start: 1, end: 20 }
    ]
  },
  {
    category: '공무원 시험 (PSAT)',
    presets: [
      { label: '5급 PSAT', minutes: 90, start: 1, end: 40 },
      { label: '7급 PSAT', minutes: 60, start: 1, end: 25 }
    ]
  },
  {
    category: 'LEET',
    presets: [
      { label: '언어이해', minutes: 70, start: 1, end: 30 },
      { label: '추리논증', minutes: 125, start: 1, end: 40 }
    ]
  },
  {
    category: 'CPA (1차)',
    presets: [
      { label: '1교시 (경영·경제)', minutes: 100, start: 1, end: 64 },
      { label: '2교시 (상법·세법)', minutes: 120, start: 1, end: 80 },
      { label: '3교시 (회계학)', minutes: 90, start: 1, end: 50 }
    ]
  }
];

interface Preset {
  label: string;
  minutes: number;
  start: number;
  end: number;
}
interface SetupPanelProps {
    startQuestion: string;
    setStartQuestion: (val: string) => void;
    endQuestion: string;
    setEndQuestion: (val: string) => void;
    totalMinutes: string;
    setTotalMinutes: (val: string) => void;
    isUnlimited: boolean;
    setIsUnlimited: (val: boolean) => void;
    isExamActive: boolean;
    onStart: () => void;
    error: string;
}

const SetupPanel: FC<SetupPanelProps> = ({
    startQuestion,
    setStartQuestion,
    endQuestion,
    setEndQuestion,
    totalMinutes,
    setTotalMinutes,
    isUnlimited,
    setIsUnlimited,
    isExamActive,
    onStart,
    error
}) => {
    const applyPreset = (preset: Preset) => {
        setStartQuestion(preset.start.toString());
        setEndQuestion(preset.end.toString());
        setTotalMinutes(preset.minutes.toString());
        setIsUnlimited(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">시험 설정</h2>
            </div>
            <div className="p-6">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-lg font-semibold mb-2">프리셋</h3>
                        <p className="text-sm text-gray-500 mb-4">자주 사용하는 시험 설정을 선택하세요.</p>
                        <div className="space-y-4">
                            {presetCategories.map(({ category, presets }) => (
                                <div key={category}>
                                    <h4 className="text-sm font-semibold mb-2 text-gray-600">{category}</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {presets.map((preset) => (
                                            <Button
                                                key={preset.label}
                                                onClick={() => applyPreset(preset)}
                                                variant="secondary"
                                                size="sm"
                                                className="text-xs sm:text-sm"
                                                disabled={isExamActive}
                                            >
                                                {preset.label}
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="border-t border-slate-200 dark:border-slate-700 my-4"></div>

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="시작 번호" type="number" value={startQuestion} onChange={e => setStartQuestion(e.target.value)} disabled={isExamActive}/>
                        <Input label="종료 번호" type="number" value={endQuestion} onChange={e => setEndQuestion(e.target.value)} disabled={isExamActive}/>
                    </div>
                    <Input label="총 시험 시간 (분)" type="number" value={totalMinutes} onChange={e => setTotalMinutes(e.target.value)} disabled={isUnlimited || isExamActive}/>
                    <ToggleSwitch label="무제한 모드" enabled={isUnlimited} onChange={setIsUnlimited} disabled={isExamActive}/>
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                    <Button onClick={onStart} size="lg" className="w-full" disabled={isExamActive}>
                        {isExamActive ? '시험 진행 중' : '시험 시작'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SetupPanel;