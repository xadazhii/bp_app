import React from 'react';
import { DownloadIcon, TrashIcon, UserCircleIcon, EyeIcon, CheatedIcon, SearchIcon } from './AdminIcons';

export const StudentGrades = ({ adminCtx }) => {
    const {
        studentGrades, gradesLoading, gradesViewMode, studentSearchQuery
    } = adminCtx.state;

    return (<div className="space-y-8">
                                <div className="flex flex-col gap-6 mb-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h2 className="text-3xl font-bold text-blue-400">Výsledky</h2>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                            <button
                                                onClick={adminCtx.handleExportGrades}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95 text-[11px] uppercase tracking-widest border border-emerald-500/20"
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-2" /> Exportovať
                                            </button>
                                            <div className="bg-[#0f172a]/60 p-1.5 rounded-2xl flex border border-white/5 shadow-inner">
                                                <button
                                                    onClick={() => adminCtx.setState({ gradesViewMode: 'cards' })}
                                                    className={`flex-1 sm:flex-none px-5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${gradesViewMode === 'cards' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                                >
                                                    Karty
                                                </button>
                                                <button
                                                    onClick={() => adminCtx.setState({ gradesViewMode: 'table' })}
                                                    className={`flex-1 sm:flex-none px-5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${gradesViewMode === 'table' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                                >
                                                    Tabuľka
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder={window.innerWidth < 640 ? "Hľadať študenta..." : "Hľadať študenta podľa mena alebo emailu..."}
                                            value={studentSearchQuery}
                                            onChange={(e) => adminCtx.setState({ studentSearchQuery: e.target.value })}
                                            className="block w-full pl-12 pr-4 py-3 bg-[#0f172a] border border-white/5 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-inner text-sm"
                                        />
                                        {studentSearchQuery && (
                                            <button
                                                onClick={() => adminCtx.setState({ studentSearchQuery: "" })}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {gradesLoading ? (
                                    <p className="text-slate-400">Načítavam hodnotenia...</p>
                                ) : (
                                    <>
                                        {gradesViewMode === 'cards' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {studentGrades.studentGrades
                                                    .filter(s =>
                                                        s.username.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                                                        s.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
                                                    )
                                                    .map(student => {
                                                        const currentWeek = adminCtx.getCurrentWeek();
                                                        const filteredTests = studentGrades.tests.filter(t => {
                                                            const wn = t.weekNumber || 0;
                                                            if (wn === 0) return true;
                                                            if (wn >= 1 && wn <= 12) return wn <= currentWeek;
                                                            if (wn === 13) return currentWeek >= 12;
                                                            if (wn === 14) return currentWeek >= 13;
                                                            return false;
                                                        });

                                                        const completedTests = filteredTests.filter(t => student.scores[t.id] !== undefined && t.maxScore > 0);
                                                        const averagePercent = completedTests.length > 0
                                                            ? (completedTests.reduce((sum, t) => sum + (student.scores[t.id] / t.maxScore) * 100, 0) / completedTests.length).toFixed(1)
                                                            : null;
                                                        return (
                                                            <div key={student.id} className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-[2rem] shadow-xl p-5 sm:p-7 transition-all hover:border-blue-500/40 hover:bg-white/5 group">
                                                                <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6 pb-6 border-b border-white/5">
                                                                    <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
                                                                        <div className="relative flex-shrink-0">
                                                                            <UserCircleIcon className="w-12 h-12 text-slate-500 group-hover:text-blue-400 transition-colors" />
                                                                            <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-emerald-500 border-2 border-slate-800 rounded-full shadow-sm"></div>
                                                                        </div>
                                                                        <div className="min-w-0 pr-2">
                                                                            <p className="font-bold text-white text-lg tracking-tight truncate leading-tight">{student.username}</p>
                                                                            <p className="text-sm text-slate-500 font-medium truncate">{student.email}</p>
                                                                        </div>
                                                                    </div>
                                                                    <div className="flex flex-col items-end flex-shrink-0 ml-auto sm:ml-0">
                                                                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mb-1.5 whitespace-nowrap opacity-60">Priemerné skóre</p>
                                                                        <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full shadow-sm">
                                                                            <p className="text-2xl font-black text-blue-400 leading-none">{averagePercent !== null ? `${averagePercent.replace('.', ',')} %` : 'N/A'}</p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-4">
                                                                        <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider">Výsledky testov</h4>
                                                                        <div className="h-px flex-grow bg-[#15203d]/50 mx-4"></div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                                        {filteredTests.map(test => {
                                                                            const score = student.scores[test.id];
                                                                            const maxScore = test.maxScore;
                                                                            const percentage = maxScore > 0 && score !== undefined ? (score / maxScore) * 100 : 0;
                                                                            const getProgressColor = (percent) => {
                                                                                if (percent >= 90) return 'bg-emerald-500';
                                                                                if (percent >= 75) return 'bg-blue-500';
                                                                                if (percent >= 50) return 'bg-amber-500';
                                                                                return 'bg-rose-500';
                                                                            }
                                                                            return (
                                                                                <div
                                                                                    key={test.id}
                                                                                    className={`p-3 rounded-2xl text-center transition-all duration-300 border flex flex-col justify-between h-full relative group/test ${student.cheatedMap && student.cheatedMap[test.id]
                                                                                        ? 'bg-rose-500/5 border-rose-500/20 shadow-md'
                                                                                        : score !== undefined ? 'bg-[#0f172a]/40 border-white/5 hover:bg-[#0f172a]/60' : 'bg-[#0f172a]/20 border-slate-800/50 opacity-60'
                                                                                        }`}
                                                                                >
                                                                                    {student.cheatedMap && student.cheatedMap[test.id] && (
                                                                                        <div className="absolute top-1 right-1 bg-red-500 rounded-full p-0.5 shadow shadow-red-500/50">
                                                                                            <CheatedIcon className="w-2.5 h-2.5 text-white" title="Študent podvádzal" />
                                                                                        </div>
                                                                                    )}
                                                                                    <div className="mb-2">
                                                                                        <p className={`text-[9px] uppercase font-black tracking-widest truncate mb-1.5 ${student.cheatedMap && student.cheatedMap[test.id] ? 'text-rose-400' : 'text-slate-500'}`} title={test.title}>
                                                                                            {test.title}
                                                                                        </p>
                                                                                        <div className="flex items-center justify-center gap-1.5">
                                                                                            <span className={`text-xl font-black ${score !== undefined ? (student.cheatedMap && student.cheatedMap[test.id] ? 'text-rose-500' : 'text-white') : 'text-slate-700'}`}>
                                                                                                {score !== undefined ? score : '—'}
                                                                                            </span>
                                                                                            {score !== undefined && (
                                                                                                <span className="text-[10px] text-slate-500 font-bold opacity-60">/ {maxScore}</span>
                                                                                            )}
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="w-full bg-[#0f172a]/80 rounded-full h-1 mt-2 overflow-hidden border border-white/5">
                                                                                        {score !== undefined && (
                                                                                            <div
                                                                                                className={`h-full rounded-full transition-all duration-1000 ${student.cheatedMap && student.cheatedMap[test.id] ? 'bg-rose-600' : getProgressColor(percentage)}`}
                                                                                                style={{ width: `${percentage}%` }}
                                                                                            ></div>
                                                                                        )}
                                                                                    </div>
                                                                                    {score !== undefined && student.resultIds && student.resultIds[test.id] && (
                                                                                        <button
                                                                                            onClick={() => adminCtx.setState({ viewedResultId: student.resultIds[test.id] })}
                                                                                            className="mt-3 w-full py-2 text-[9px] font-black uppercase tracking-widest text-blue-400 hover:text-white hover:bg-blue-600 rounded-2xl border border-blue-500/20 hover:border-blue-500 transition-all flex items-center justify-center gap-2 group/btn shadow-inner"
                                                                                        >
                                                                                            <EyeIcon className="w-3 h-3 group-hover/btn:scale-110 transition-transform" /> Detail
                                                                                        </button>
                                                                                    )}
                                                                                </div>
                                                                            );
                                                                        })}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        )}
                                        {gradesViewMode === 'table' && (
                                            <div className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
                                                <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                    <table className="min-w-full border-separate border-spacing-0">
                                                        <thead>
                                                            <tr className="bg-[#0f172a]/60">
                                                                <th className="px-4 py-4 text-left text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-[11px] sticky left-0 bg-[#0f172a] z-20 border-b border-white/5">Študent</th>
                                                                {studentGrades.tests.filter(t => {
                                                                    const wn = t.weekNumber || 0;
                                                                    const currentWeek = adminCtx.getCurrentWeek();
                                                                    if (wn === 0) return true;
                                                                    if (wn >= 1 && wn <= 12) return wn <= currentWeek;
                                                                    if (wn === 13) return currentWeek >= 12;
                                                                    if (wn === 14) return currentWeek >= 13;
                                                                    return false;
                                                                }).map(test => (
                                                                    <th key={test.id} className="px-4 py-4 text-center text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-[11px] border-b border-white/5 min-w-[80px]" title={test.title}>
                                                                        {test.title}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-700/30">
                                                            {studentGrades.studentGrades
                                                                .filter(s =>
                                                                    s.username.toLowerCase().includes(studentSearchQuery.toLowerCase()) ||
                                                                    s.email.toLowerCase().includes(studentSearchQuery.toLowerCase())
                                                                )
                                                                .map(student => {
                                                                    const currentWeek = adminCtx.getCurrentWeek();
                                                                    const filteredTestsInTable = studentGrades.tests.filter(t => {
                                                                        const wn = t.weekNumber || 0;
                                                                        if (wn === 0) return true;
                                                                        if (wn >= 1 && wn <= 12) return wn <= currentWeek;
                                                                        if (wn === 13) return currentWeek >= 12;
                                                                        if (wn === 14) return currentWeek >= 13;
                                                                        return false;
                                                                    });
                                                                    return (
                                                                        <tr key={student.id} className="hover:bg-white/5 transition-colors group">
                                                                            <td className="px-4 py-3 sticky left-0 bg-[#0f172a]/90 backdrop-blur-md z-10 border-r border-white/5 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)]">
                                                                                <div className="flex items-center gap-3 max-w-[120px] md:max-w-none">
                                                                                    <div className="w-8 h-8 rounded-lg bg-slate-800/40 flex items-center justify-center text-slate-300 font-black text-[10px] flex-shrink-0">
                                                                                        {student.username.substring(0, 1).toUpperCase()}
                                                                                    </div>
                                                                                    <div className="min-w-0">
                                                                                        <p className="font-bold text-white text-[12px] md:text-sm tracking-tight truncate leading-tight group-hover:text-blue-400 transition-colors">{student.username}</p>
                                                                                        <p className="text-[10px] text-slate-500 truncate mt-0.5">{student.email}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </td>
                                                                            {filteredTestsInTable.map(test => {
                                                                                const score = student.scores[test.id];
                                                                                const isCheated = student.cheatedMap && student.cheatedMap[test.id];
                                                                                const resultId = student.resultIds && student.resultIds[test.id];

                                                                                return (
                                                                                    <td key={test.id} className={`px-2 md:px-4 py-4 text-center align-top transition-all ${isCheated ? 'bg-rose-500/5' : ''}`}>
                                                                                        <div className="flex flex-col items-center gap-3">
                                                                                            <div className={`relative inline-flex items-center justify-center min-w-[48px] px-2.5 py-1.5 rounded-2xl border transition-all ${isCheated
                                                                                                ? 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-[0_0_15px_-3px_rgba(244,63,94,0.2)]'
                                                                                                : score !== undefined
                                                                                                    ? 'bg-[#0f172a]/60 border-white/5 text-white shadow-inner'
                                                                                                    : 'bg-[#0f172a]/30 border-slate-800 text-slate-600'
                                                                                                }`}>
                                                                                                <span className={`text-[12px] md:text-sm font-black font-mono ${isCheated ? 'animate-pulse' : ''}`}>
                                                                                                    {score !== undefined ? score : '—'}
                                                                                                </span>
                                                                                                {score !== undefined && (
                                                                                                    <span className="text-[9px] text-slate-500 font-bold ml-1.5 opacity-60">/{test.maxScore}</span>
                                                                                                )}

                                                                                                {isCheated && (
                                                                                                    <div className="absolute -top-1 -right-1">
                                                                                                        <div className="w-2.5 h-2.5 bg-rose-500 rounded-full animate-ping absolute"></div>
                                                                                                        <div className="w-2.5 h-2.5 bg-rose-500 rounded-full relative border-2 border-slate-900"></div>
                                                                                                    </div>
                                                                                                )}
                                                                                            </div>

                                                                                            <div className="h-6 flex items-center justify-center">
                                                                                                {resultId ? (
                                                                                                    <button
                                                                                                        onClick={() => adminCtx.setState({ viewedResultId: resultId })}
                                                                                                        className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 border border-blue-500/20"
                                                                                                        title="Zobraziť detail"
                                                                                                    >
                                                                                                        <EyeIcon className="w-4 h-4" />
                                                                                                        <span className="text-[10px] font-black uppercase tracking-tighter md:hidden">Detail</span>
                                                                                                    </button>
                                                                                                ) : (
                                                                                                    <div className="h-6" />
                                                                                                )}
                                                                                            </div>
                                                                                        </div>
                                                                                    </td>
                                                                                );
                                                                            })}
                                                                        </tr>
                                                                    );
                                                                })}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>);
};