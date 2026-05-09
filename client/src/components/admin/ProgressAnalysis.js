import React from "react";
import { UserIcon, ExclamationTriangleIcon, ClockIcon, TrendingUpIcon } from './AdminIcons';
import { ProgressChartModal } from './ProgressChartModal';

const classifyGain = (gainPercent) => {
    if (gainPercent == null) return null;
    if (gainPercent < 0) return { label: 'Regresia', color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' };
    if (gainPercent < 30) return { label: 'Nízky zisk', color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
    if (gainPercent < 70) return { label: 'Stredný zisk', color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
    return { label: 'Vysoký zisk', color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
};

export const ProgressAnalysis = ({ summaryData, currentWeek }) => {
    const [chartOpen, setChartOpen] = React.useState(false);

    if (!summaryData) return (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Pripravujem analýzu...</p>
        </div>
    );

    const entryTest = summaryData.tests.find(t => t.weekNumber === 0);
    const exitTest = summaryData.tests.find(t => t.weekNumber === 13 && currentWeek >= 12);

    const studentsProgress = summaryData.studentGrades.map(student => {
        const entryScore = entryTest ? (student.scores[entryTest.id] ?? null) : null;
        const exitScore = exitTest ? (student.scores[exitTest.id] ?? null) : null;

        const progress = student.normalizedGain ?? null;

        return {
            ...student,
            entryScore,
            exitScore,
            progress
        };
    });

    const avgProgress = summaryData.globalNormalizedGain != null
        ? summaryData.globalNormalizedGain.toFixed(1)
        : '0';

    if (!entryTest) {
        return (
            <div className="p-12 bg-slate-800/10 backdrop-blur-sm rounded-[2rem] border border-white/5 text-center animate-fade-in">
                <div className="w-20 h-20 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ExclamationTriangleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Vstupný test chýba</h3>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Pre analýzu progresu systém vyžaduje prítomnosť <strong>Vstupného testu</strong> priradeného k týždňu 0.
                    <br /><br />
                    Vytvorte prosím test v sekcii "Testy" a nastavte mu týždeň 0.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-fade-in pb-12">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                <div className="max-w-xl">
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 tracking-tight">Analýza progresu</h2>
                    <p className="text-slate-400 mt-1 text-xs sm:text-sm leading-relaxed flex flex-col sm:flex-row sm:items-center gap-2">
                        Objektívne meranie progresu pomocou Hakeho normalizovaného zisku.
                        {!exitTest && (
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/5 border border-blue-500/10 rounded-full text-[10px] font-bold text-blue-400/80 uppercase tracking-wider">
                                <ClockIcon className="w-3.5 h-3.5" />
                                Zber dát: Porovnanie po 12. týždni (teraz {currentWeek}.)
                            </span>
                        )}
                    </p>
                </div>
                {studentsProgress.length > 0 && (
                <div className="flex flex-col sm:flex-row gap-2.5 self-start lg:self-auto w-full sm:w-auto">
                    {exitTest && (
                        <button
                            onClick={() => setChartOpen(true)}
                            type="button"
                            className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg transition-all hover:border-blue-500/30 hover:bg-slate-800/20 group w-full sm:w-auto text-left active:scale-[0.98]"
                        >
                            <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                                <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M3 3v18h18" />
                                    <circle cx="8" cy="14" r="1.5" fill="currentColor" />
                                    <circle cx="13" cy="9" r="1.5" fill="currentColor" />
                                    <circle cx="18" cy="6" r="1.5" fill="currentColor" />
                                </svg>
                            </div>
                            <div className="leading-tight">
                                <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Vizualizácia</p>
                                <p className="text-sm font-black text-white tracking-tight">Zobraziť graf</p>
                            </div>
                        </button>
                    )}
                    <div className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg transition-all hover:border-blue-500/30 group w-full sm:w-auto">
                        <div className="p-2 bg-blue-500/10 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0">
                            <TrendingUpIcon className="w-4 h-4 text-blue-400" />
                        </div>
                        <div className="leading-tight">
                            <p className="text-slate-500 text-[9px] font-bold uppercase tracking-widest">Globálny rast</p>
                            <p className="text-lg font-black text-white flex items-baseline gap-1">
                                {exitTest ? (
                                    <>
                                        {avgProgress >= 0 ? '+' : ''}{avgProgress.replace('.', ',')}
                                        <span className="text-xs text-blue-400 font-bold">%</span>
                                        {summaryData.globalNormalizedGain != null && (() => {
                                            const cls = classifyGain(summaryData.globalNormalizedGain);
                                            return cls ? (
                                                <span className={`ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${cls.bg} ${cls.border} ${cls.text} border`}>
                                                    {cls.label}
                                                </span>
                                            ) : null;
                                        })()}
                                    </>
                                ) : (
                                    <span className="text-slate-600 italic text-sm">—</span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>
                )}
            </div>

            <div className="lg:hidden space-y-2.5">
                {studentsProgress.map(student => (
                    <div key={student.id} className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-2xl p-4 shadow-lg group">
                        <div className="flex items-center gap-3 mb-3 pb-3 border-b border-white/5">
                            <div className="w-8 h-8 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-300 font-black text-[10px] uppercase shadow-inner flex-shrink-0">
                                {student.username.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-white text-sm leading-tight truncate">{student.username}</div>
                                <div className="text-[10px] text-slate-500 truncate">{student.email}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">Vstupný test</p>
                                <p className="text-sm font-black text-white">
                                    {student.entryScore !== null ? student.entryScore : <span className="text-slate-600 italic text-xs font-normal">N/A</span>}
                                    {student.entryScore !== null && <span className="text-[9px] text-slate-500 font-bold ml-1">/ {student.maxScores[entryTest.id] ?? entryTest.maxScore}b</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-[9px] uppercase font-bold text-slate-500 tracking-wider mb-0.5">Záverečný test</p>
                                <p className="text-sm font-black text-white">
                                    {exitTest ? (
                                        <>
                                            {student.exitScore !== null ? student.exitScore : <span className="text-slate-600 italic text-xs font-normal">N/A</span>}
                                            {student.exitScore !== null && <span className="text-[9px] text-slate-500 font-bold ml-1">/ {student.maxScores[exitTest.id] ?? exitTest.maxScore}b</span>}
                                        </>
                                    ) : (
                                        <span className="text-slate-700 font-bold text-xs">Čaká sa...</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white/5 flex justify-between items-center gap-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Zisk (g)</p>
                            {student.progress !== null ? (() => {
                                const cls = classifyGain(student.progress);
                                return (
                                    <span className={`inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-black ${cls.bg} ${cls.border} ${cls.text}`}>
                                        {student.progress >= 0 ? '+' : ''}{student.progress.toFixed(1).replace('.', ',')}%
                                        <span className="opacity-50 font-normal">·</span>
                                        <span className="text-[9px] uppercase tracking-wider opacity-90 font-bold">{cls.label}</span>
                                    </span>
                                );
                            })() : (
                                <span className="text-slate-600 text-[10px] uppercase font-bold italic">Nedostupné</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-white/5 shadow-xl">
                <table className="min-w-full bg-slate-800/10 backdrop-blur-sm overflow-hidden">
                    <thead>
                        <tr className="bg-[#0f172a]/60 border-b border-white/5">
                            <th className="px-5 py-3 text-left text-slate-400 font-bold uppercase tracking-widest text-[10px]">Študent</th>
                            <th className="px-5 py-3 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vstupný test</th>
                            <th className="px-5 py-3 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Záverečný test</th>
                            <th className="px-5 py-3 text-right text-slate-400 font-bold uppercase tracking-widest text-[10px]">Normalizovaný zisk (g)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/40">
                        {studentsProgress.map(student => (
                            <tr key={student.id} className="hover:bg-white/5 transition-all group">
                                <td className="px-5 py-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-300 font-black text-[10px] shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                            {student.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-white text-sm leading-tight group-hover:text-blue-400 transition-colors">{student.username}</div>
                                            <div className="text-[10px] text-slate-500 font-medium truncate">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-5 py-3 text-center">
                                    {student.entryScore !== null ? (
                                        <span className="text-sm font-black text-white">
                                            {student.entryScore}
                                            <span className="text-[10px] text-slate-500 font-bold ml-1">/ {student.maxScores[entryTest.id] ?? entryTest.maxScore}b</span>
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-slate-800/20 text-slate-500/50 text-[9px] uppercase font-black tracking-widest rounded border border-white/5">Chýba</span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-center">
                                    {exitTest ? (
                                        student.exitScore !== null ? (
                                            <span className="text-sm font-black text-white">
                                                {student.exitScore}
                                                <span className="text-[10px] text-slate-500 font-bold ml-1">/ {student.maxScores[exitTest.id] ?? exitTest.maxScore}b</span>
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-slate-800/20 text-slate-500/50 text-[9px] uppercase font-black tracking-widest rounded border border-white/5">Chýba</span>
                                        )
                                    ) : (
                                        <span className="text-slate-700 font-bold text-[10px] uppercase tracking-tighter">Čaká sa...</span>
                                    )}
                                </td>
                                <td className="px-5 py-3 text-right">
                                    {student.progress !== null ? (() => {
                                        const cls = classifyGain(student.progress);
                                        return (
                                            <span className={`inline-flex items-baseline gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-black ${cls.bg} ${cls.border} ${cls.text}`}>
                                                {student.progress >= 0 ? '+' : ''}{student.progress.toFixed(1).replace('.', ',')}%
                                                <span className="opacity-50 font-normal">·</span>
                                                <span className="text-[9px] uppercase tracking-wider opacity-90 font-bold">{cls.label}</span>
                                            </span>
                                        );
                                    })() : (
                                        <span className="text-slate-700 font-bold text-[10px] uppercase tracking-widest italic">{exitTest ? 'N/A' : 'Nedostupné'}</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {studentsProgress.length === 0 && (
                <div className="p-12 text-center bg-slate-800/10 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/5 shadow-inner">
                    <div className="w-16 h-16 bg-slate-800/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Zatiaľ žiadni študenti na analýzu</p>
                </div>
            )}

            {chartOpen && (
                <ProgressChartModal
                    studentsProgress={studentsProgress}
                    entryTest={entryTest}
                    exitTest={exitTest}
                    globalGain={summaryData.globalNormalizedGain}
                    onClose={() => setChartOpen(false)}
                />
            )}
        </div>
    );
};