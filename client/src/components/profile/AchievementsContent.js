import React, { useState, useEffect } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";
import { StarIcon } from '../common/ProfileIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ProgressRing = ({ percentage, color, size = 68, stroke = 6 }) => {
    const radius = (size / 2) - (stroke);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex-shrink-0 group" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90 transition-transform duration-500 group-hover:rotate-0" width={size} height={size}>
                <circle
                    className="text-slate-800"
                    strokeWidth={stroke}
                    stroke="currentColor"
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                />
                <circle
                    strokeWidth={stroke}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    stroke={color}
                    fill="transparent"
                    r={radius}
                    cx={size / 2}
                    cy={size / 2}
                    style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-black text-white">
                {Math.round(percentage)}%
            </span>
        </div>
    );
};

const ProgressSummaryCard = ({ title, stats, color }) => (
    <div className="bg-slate-800/40 backdrop-blur-md p-5 rounded-2xl border border-white/5 flex items-center space-x-5
                    transition-all duration-300 ease-out hover:border-blue-500/30 hover:bg-slate-800/60 shadow-sm">
        <ProgressRing percentage={stats?.percent ?? 0} color={color} />
        <div>
            <h3 className="font-bold text-sm text-slate-500 uppercase tracking-widest mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-white leading-none">{stats?.completed ?? 0}</span>
                <span className="text-base font-bold text-slate-500">/ {stats?.total ?? 0}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-bold">DOKONČENÉ</p>
        </div>
    </div>
);

const TestResultCard = ({ result, color, percentage, onViewResult }) => (
    <div className="bg-slate-800/40 backdrop-blur-sm p-4 rounded-2xl border border-white/5 flex flex-col
                    transition-all duration-300 ease-out hover:border-blue-500/30 hover:bg-slate-800/60 shadow-sm group">
        <div className="flex justify-between items-start mb-3">
            <div className="flex flex-col min-w-0 pr-2">
                <h4 className="font-bold text-[11px] uppercase tracking-widest mb-1">
                    {result.cheated ? (
                        <span className="text-red-500 font-extrabold flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                            Anulované
                        </span>
                    ) : (
                        <span className="text-blue-500/60 font-black">Dokončené</span>
                    )}
                </h4>
                <h4 className="font-bold text-lg text-slate-100 line-clamp-1 group-hover:text-white transition-colors" title={result.title}>
                    {result.title}
                </h4>
            </div>
            <div className="flex flex-col items-end shrink-0">
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black ${result.cheated ? 'text-red-500' : 'text-white'}`}>{result.score}</span>
                    <span className="text-[12px] font-bold text-slate-500">/ {result.maxScore}</span>
                </div>
            </div>
        </div>

        <div className="mt-auto space-y-3">
            <div className="space-y-1.5">
                <div className="flex justify-between items-end">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">Úspešnosť</span>
                    <span className="text-[13px] font-black" style={{ color }}>{Math.round(percentage)}%</span>
                </div>
                <div className="w-full bg-slate-700/30 rounded-full h-1 overflow-hidden border border-white/5 p-[0.5px]">
                    <div
                        className="h-full rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${percentage}%`, backgroundColor: color, transition: 'width 0.7s cubic-bezier(0.1, 0, 0.2, 1)' }}>
                    </div>
                </div>
            </div>

            {result.testResultId && (
                <button
                    onClick={() => onViewResult(result.testResultId)}
                    className="w-full py-2.5 bg-slate-900/50 hover:bg-blue-600 border border-white/5 hover:border-blue-500 text-slate-400 hover:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-[0.97]"
                >
                    Analyzovať test
                </button>
            )}
        </div>
    </div>
);

const AchievementsContent = ({ stats, statsLoading, beigeTextColor, onViewResult }) => {
    const [activeSubTab, setActiveSubTab] = useState('stats'); // 'stats' or 'leaderboard'
    const [leaderboard, setLeaderboard] = useState([]);
    const [leaderboardLoading, setLeaderboardLoading] = useState(false);
    const [leaderboardError, setLeaderboardError] = useState(null);

    useEffect(() => {
        if (activeSubTab === 'leaderboard') {
            setLeaderboardLoading(true);
            axios.get(`${API_URL}/api/leaderboard`, { headers: authHeader() })
                .then(res => {
                    setLeaderboard(Array.isArray(res.data) ? res.data : []);
                    setLeaderboardLoading(false);
                })
                .catch(err => {
                    console.error("Leaderboard error:", err);
                    setLeaderboardError("Nepodarilo sa načítať rebríček.");
                    setLeaderboardLoading(false);
                });
        }
    }, [activeSubTab]);

    if (statsLoading) {
        return <div className="text-center text-lg text-slate-400">Načítavam úspechy...</div>;
    }
    if (!stats) {
        return <div className="text-center text-red-500">Nepodarilo sa načítať úspechy.</div>;
    }

    const { lectureStats, seminarStats, testStats } = stats;

    const getProgressColor = (percent) => {
        if (percent >= 80) return '#22c55e';
        if (percent >= 50) return '#f59e0b';
        return '#ef4444';
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-2">
                <h2 className="text-3xl font-bold" style={{ color: beigeTextColor }}>Úspechy a rebríček</h2>

                <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700/50 self-start sm:self-center">
                    <button
                        onClick={() => setActiveSubTab('stats')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                    >
                        Moje štatistiky
                    </button>
                    <button
                        onClick={() => setActiveSubTab('leaderboard')}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeSubTab === 'leaderboard' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'}`}
                    >
                        Rebríček študentov
                    </button>
                </div>
            </div>

            {activeSubTab === 'stats' ? (
                <div className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <ProgressSummaryCard
                            title="Prednášky"
                            stats={lectureStats}
                            color={getProgressColor(lectureStats?.percent ?? 0)}
                        />
                        <ProgressSummaryCard
                            title="Cvičenia"
                            stats={seminarStats}
                            color={getProgressColor(seminarStats?.percent ?? 0)}
                        />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-6 text-blue-400 flex items-center">
                            <StarIcon className="w-7 h-7 mr-3" /> Výsledky testov
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {testStats?.detailedResults && testStats.detailedResults.length > 0 ? (
                                (() => {
                                    const sortedResults = [...testStats.detailedResults].sort((a, b) => {
                                        const titleA = (a.title || "").toLowerCase();
                                        const titleB = (b.title || "").toLowerCase();
                                        if (titleA.includes("vstupny")) return 1;
                                        if (titleB.includes("vstupny")) return -1;
                                        return (b.testId || 0) - (a.testId || 0);
                                    });
                                    return sortedResults.map((result, index) => {
                                        const percentage = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0;
                                        return (
                                            <TestResultCard
                                                key={index}
                                                result={result}
                                                percentage={percentage}
                                                color={getProgressColor(percentage)}
                                                onViewResult={onViewResult}
                                            />
                                        );
                                    });
                                })()
                            ) : (
                                <p className="text-slate-400 col-span-full text-center py-6">
                                    Zatiaľ žiadne dokončené testy.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in">
                    {leaderboardLoading ? (
                        <div className="flex justify-center p-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>
                    ) : leaderboardError ? (
                        <div className="bg-red-900/30 border border-red-700/50 p-6 rounded-2xl text-red-300 text-center">
                            {leaderboardError}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {leaderboard.length > 0 && (
                                <>
                                    {(() => {
                                        const currentUserIndex = leaderboard.findIndex(u => u.isCurrentUser);
                                        const currentUser = leaderboard[currentUserIndex];
                                        const totalStudents = leaderboard.length;
                                        const rank = currentUserIndex + 1;
                                        const percentile = totalStudents > 0 ? ((rank / totalStudents) * 100).toFixed(1) : 0;
                                        const nearestBetterScore = currentUserIndex > 0 ? leaderboard[currentUserIndex - 1].points : "-";

                                        if (!currentUser) return null;

                                        return (
                                            <div className="space-y-6">
                                                <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-700/50 border-b border-slate-700/50 bg-slate-800/60">
                                                        <div className="p-4 text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider">Poradie</div>
                                                        <div className="p-4 text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider">Percentil</div>
                                                        <div className="p-4 text-center font-bold text-blue-400 text-[10px] uppercase tracking-wider">Celkové skóre</div>
                                                        <div className="p-4 text-center font-bold text-slate-400 text-[10px] uppercase tracking-wider">Najbližšie lepšie</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-700/50 bg-slate-800/20">
                                                        <div className="p-6 text-center font-mono text-2xl text-white tracking-tight">{rank}./{totalStudents}</div>
                                                        <div className="p-6 text-center font-mono text-2xl text-white tracking-tight">{percentile} %</div>
                                                        <div className="p-6 text-center font-mono text-2xl font-bold text-blue-400 tracking-tight">{currentUser.points}</div>
                                                        <div className="p-6 text-center font-mono text-2xl text-slate-500 tracking-tight">{nearestBetterScore}</div>
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 text-sm pl-1">
                                                    Patríte medzi <span className="font-bold text-slate-300">{percentile} %</span> najlepších študentov podľa dosiahnutého študijného skóre.
                                                </p>
                                            </div>
                                        );
                                    })()}

                                </>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export { ProgressRing, ProgressSummaryCard, TestResultCard };
export default AchievementsContent;
