import React, { useState, useEffect } from "react";
import authHeader from "../../services/auth-header";
import { StarIcon } from '../common/ProfileIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ProgressRing = ({ percentage, color, size = 80, stroke = 8 }) => {
    const radius = (size / 2) - (stroke);
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="relative flex-shrink-0" style={{ width: size, height: size }}>
            <svg className="transform -rotate-90" width={size} height={size}>
                <circle
                    className="text-slate-700"
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
                    style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
                {Math.round(percentage)}%
            </span>
        </div>
    );
};

const ProgressSummaryCard = ({ title, stats, color }) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex items-center space-x-5
                    transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/50">
        <ProgressRing percentage={stats?.percent ?? 0} color={color} />
        <div>
            <h3 className="font-bold text-xl text-blue-400">{title}</h3>
            <p className="text-sm text-slate-400 mt-1">Dokončené: {stats?.completed ?? 0} z {stats?.total ?? 0}</p>
        </div>
    </div>
);

const TestResultCard = ({ result, color, percentage }) => (
    <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 flex flex-col text-center
                    transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-2xl hover:shadow-slate-900/50">
        <h4 className="font-bold text-lg text-slate-200 truncate mb-3" title={result.title}>
            {result.title}
        </h4>
        <div className="my-3">
            <span className="text-5xl font-bold text-white">{result.score}</span>
            <span className="text-2xl text-slate-400"> / {result.maxScore}</span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2.5 my-2">
            <div
                className="h-2.5 rounded-full"
                style={{ width: `${percentage}%`, backgroundColor: color, transition: 'width 0.5s ease-in-out' }}>
            </div>
        </div>
        <p className="text-sm text-slate-400 mt-2">{Math.round(percentage)}% úspešnosť</p>
    </div>
);

const AchievementsContent = ({ stats, statsLoading, beigeTextColor }) => {
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
                            title="Semináre"
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
                                testStats.detailedResults.map((result, index) => {
                                    const percentage = result.maxScore > 0 ? (result.score / result.maxScore) * 100 : 0;
                                    return (
                                        <TestResultCard
                                            key={index}
                                            result={result}
                                            percentage={percentage}
                                            color={getProgressColor(percentage)}
                                        />
                                    );
                                })
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
