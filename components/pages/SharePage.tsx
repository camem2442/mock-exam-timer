import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ResultImage } from '../share/ResultImage';
import { type Question } from '../../types';
import { Spinner } from '../ui/Spinner';
import { siteConfig } from '../../config/site';
import { Button } from '../ui/Button';

interface SharedResultData {
    questions: Question[];
    examName: string;
    totalMinutes?: number;
    includeGrading: boolean;
    blurAnswer: boolean;
}

const SharePage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [resultData, setResultData] = useState<SharedResultData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setLoading(false);
            setError('잘못된 접근입니다. 공유 ID가 없습니다.');
            return;
        }

        const fetchResult = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/get-result?id=${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('존재하지 않는 결과 페이지입니다.');
                    }
                    throw new Error('결과를 불러오는 데 실패했습니다.');
                }
                const data = await response.json();
                setResultData(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : String(err));
            } finally {
                setLoading(false);
            }
        };

        fetchResult();
    }, [id]);

    const pageTitle = resultData ? `${resultData.examName} 시험 결과` : '시험 결과';

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950 py-10">
            <Helmet>
                <title>{pageTitle} - {siteConfig.title}</title>
                <meta name="description" content={`${pageTitle}를 확인하고 공유해보세요.`} />
            </Helmet>

            <div className="text-center mb-8">
                <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400 hover:underline">
                    {siteConfig.title}
                </Link>
                <p className="text-slate-500 dark:text-slate-400">나만의 시험 분석 파트너</p>
            </div>

            {loading && <Spinner />}
            {error && (
                <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-6 rounded-lg">
                    <h2 className="text-xl font-bold mb-2">오류</h2>
                    <p>{error}</p>
                    <Button onClick={() => window.location.href = '/'} className="mt-4">
                        홈으로 돌아가기
                    </Button>
                </div>
            )}
            {resultData && (
                 <div className="bg-white dark:bg-slate-900 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800">
                    <ResultImage
                        questions={resultData.questions}
                        examName={resultData.examName}
                        totalMinutes={resultData.totalMinutes}
                        includeGrading={resultData.includeGrading}
                        blurAnswer={resultData.blurAnswer}
                    />
                </div>
            )}
        </div>
    );
};

export default SharePage; 