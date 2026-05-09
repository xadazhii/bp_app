import React from "react";
import { UserIcon, ExclamationTriangleIcon, ClockIcon, TrendingUpIcon } from './AdminIcons';

const classifyGain = (gainPercent) => {
    if (gainPercent == null) return null;
    if (gainPercent < 0) return { label: 'Regresia', color: 'rose', bg: 'bg-rose-500/10', border: 'border-rose-500/20', text: 'text-rose-400' };
    if (gainPercent < 30) return { label: 'Nízky zisk', color: 'amber', bg: 'bg-amber-500/10', border: 'border-amber-500/20', text: 'text-amber-400' };
    if (gainPercent <= 70) return { label: 'Stredný zisk', color: 'blue', bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400' };
    return { label: 'Vysoký zisk', color: 'emerald', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', text: 'text-emerald-400' };
};

export const ProgressAnalysis = ({ summaryData, currentWeek }) => {
    const [legendOpen, setLegendOpen] = React.useState(false);
    const legendRef = React.useRef(null);

    React.useEffect(() => {
        if (!legendOpen) return;
        const handler = (e) => {
            if (legendRef.current && !legendRef.current.contains(e.target)) {
                setLegendOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [legendOpen]);

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
                    <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 tracking-tight flex items-center gap-2">
                        Analýza progresu
                        <span ref={legendRef} className="relative inline-block">
                            <button
                                type="button"
                                onClick={() => setLegendOpen(o => !o)}
                                className="inline-flex items-center justify-center w-6 h-6 sm:w-5 sm:h-5 rounded-full bg-slate-800/50 hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 text-xs sm:text-[10px] font-bold transition-colors border border-white/10"
                                aria-label="Vysvetlenie farieb"
                            >
                                ?
                            </button>
                            {legendOpen && (
                                <>
                                    <div
                                        className="sm:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
                                        onClick={() => setLegendOpen(false)}
                                    />
                                    <div
                                        className="fixed sm:absolute z-50 sm:z-30 left-1/2 sm:left-0 top-1/2 sm:top-full -translate-x-1/2 sm:translate-x-0 -translate-y-1/2 sm:translate-y-0 sm:mt-2 w-[calc(100vw-2rem)] max-w-[340px] sm:w-72 sm:max-w-none bg-slate-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden text-left cursor-default"
                                    >
                                        <div className="px-4 py-3 bg-slate-800/40 border-b border-white/5 flex items-center justify-between">
                                            <p className="text-[11px] uppercase tracking-widest text-slate-300 font-bold">Hakeho klasifikácia ⟨g⟩</p>
                                            <button
                                                type="button"
                                                onClick={() => setLegendOpen(false)}
                                                className="sm:hidden w-7 h-7 rounded-lg bg-slate-800/60 text-slate-400 hover:text-rose-400 transition-colors flex items-center justify-center text-lg leading-none"
                                                aria-label="Zatvoriť"
                                            >
                                                ×
                                            </button>
                                        </div>
                                        <div className="p-4 space-y-3">
                                            <div className="flex items-start gap-3">
                                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)] flex-shrink-0 mt-0.5"></span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                                        <span className="text-emerald-400 font-black text-sm tracking-tight">high-g</span>
                                                        <span className="text-slate-400 text-xs font-medium tabular-nums">g &gt; 0,7</span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs leading-snug mt-1">Vysoká miera aktívneho učenia</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="w-3.5 h-3.5 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.6)] flex-shrink-0 mt-0.5"></span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                                        <span className="text-blue-400 font-black text-sm tracking-tight">medium-g</span>
                                                        <span className="text-slate-400 text-xs font-medium tabular-nums">0,3 ≤ g ≤ 0,7</span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs leading-snug mt-1">Stredný stupeň interaktivity</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <span className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.6)] flex-shrink-0 mt-0.5"></span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                                        <span className="text-amber-400 font-black text-sm tracking-tight">low-g</span>
                                                        <span className="text-slate-400 text-xs font-medium tabular-nums">g &lt; 0,3</span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs leading-snug mt-1">Pasívna výučba</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 pt-3 pb-4 bg-slate-800/30 border-t border-white/5">
                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-2.5">Rozšírenie</p>
                                            <div className="flex items-start gap-3">
                                                <span className="w-3.5 h-3.5 rounded-full bg-rose-400 shadow-[0_0_10px_rgba(251,113,133,0.6)] flex-shrink-0 mt-0.5"></span>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-baseline justify-between gap-2 flex-wrap">
                                                        <span className="text-rose-400 font-black text-sm tracking-tight">regresia</span>
                                                        <span className="text-slate-400 text-xs font-medium tabular-nums">g &lt; 0</span>
                                                    </div>
                                                    <p className="text-slate-400 text-xs leading-snug mt-1">Strata vedomostí medzi testami</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </span>
                    </h2>
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
                    <div className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-2xl px-5 py-4 flex items-center gap-4 shadow-lg transition-all hover:border-blue-500/30 group self-start lg:self-auto w-full sm:w-auto">
                        {(() => {
                            const cls = exitTest && summaryData.globalNormalizedGain != null ? classifyGain(summaryData.globalNormalizedGain) : null;
                            return (
                                <div className={`p-2.5 rounded-xl group-hover:scale-110 transition-transform flex-shrink-0 ${cls ? cls.bg : 'bg-blue-500/10'}`}>
                                    <TrendingUpIcon className={`w-5 h-5 ${cls ? cls.text : 'text-blue-400'}`} />
                                </div>
                            );
                        })()}
                        <div className="leading-tight">
                            <p className="text-slate-500 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-0.5">Globálny rast</p>
                            <p className="text-xl sm:text-2xl font-black text-white flex items-baseline gap-1">
                                {exitTest ? (() => {
                                    const cls = summaryData.globalNormalizedGain != null ? classifyGain(summaryData.globalNormalizedGain) : null;
                                    return (
                                        <span className={cls ? cls.text : 'text-white'}>
                                            {avgProgress >= 0 ? '+' : ''}{avgProgress.replace('.', ',')}
                                            <span className="text-sm font-bold ml-0.5">%</span>
                                        </span>
                                    );
                                })() : (
                                    <span className="text-slate-600 italic text-base">—</span>
                                )}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            <div className="lg:hidden space-y-3">
                {studentsProgress.map(student => (
                    <div key={student.id} className="bg-slate-800/10 backdrop-blur-sm border border-white/5 rounded-2xl p-5 shadow-lg group">
                        <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                            <div className="w-10 h-10 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-300 font-black text-xs uppercase shadow-inner flex-shrink-0">
                                {student.username.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-white text-base leading-tight truncate">{student.username}</div>
                                <div className="text-[11px] text-slate-500 truncate mt-0.5">{student.email}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Vstupný test</p>
                                <p className="text-base font-black text-white">
                                    {student.entryScore !== null ? student.entryScore : <span className="text-slate-600 italic text-sm font-normal">N/A</span>}
                                    {student.entryScore !== null && <span className="text-[10px] text-slate-500 font-bold ml-1">/ {student.maxScores[entryTest.id] ?? entryTest.maxScore}b</span>}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-1">Záverečný test</p>
                                <p className="text-base font-black text-white">
                                    {exitTest ? (
                                        <>
                                            {student.exitScore !== null ? student.exitScore : <span className="text-slate-600 italic text-sm font-normal">N/A</span>}
                                            {student.exitScore !== null && <span className="text-[10px] text-slate-500 font-bold ml-1">/ {student.maxScores[exitTest.id] ?? exitTest.maxScore}b</span>}
                                        </>
                                    ) : (
                                        <span className="text-slate-700 font-bold text-sm">Čaká sa...</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center gap-2">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zisk (g)</p>
                            {student.progress !== null ? (() => {
                                const cls = classifyGain(student.progress);
                                return (
                                    <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-black ${cls.bg} ${cls.border} ${cls.text}`}>
                                        {student.progress >= 0 ? '+' : ''}{student.progress.toFixed(1).replace('.', ',')}%
                                    </span>
                                );
                            })() : (
                                <span className="text-slate-600 text-[11px] uppercase font-bold italic">Nedostupné</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <div className="hidden lg:block overflow-x-auto rounded-2xl border border-white/5 shadow-xl">
                <table className="min-w-full bg-slate-800/10 backdrop-blur-sm overflow-hidden">
                    <thead>
                        <tr className="bg-[#0f172a]/60 border-b border-white/5">
                            <th className="px-6 py-4 text-left text-slate-400 font-bold uppercase tracking-widest text-[11px]">Študent</th>
                            <th className="px-6 py-4 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">Vstupný test</th>
                            <th className="px-6 py-4 text-center text-slate-400 font-bold uppercase tracking-widest text-[11px]">Záverečný test</th>
                            <th className="px-6 py-4 text-right text-slate-400 font-bold uppercase tracking-widest text-[11px]">Normalizovaný zisk (g)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/40">
                        {studentsProgress.map(student => (
                            <tr key={student.id} className="hover:bg-white/5 transition-all group">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-slate-800/40 flex items-center justify-center text-slate-300 font-black text-[11px] shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors flex-shrink-0">
                                            {student.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-white text-[15px] leading-tight group-hover:text-blue-400 transition-colors">{student.username}</div>
                                            <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {student.entryScore !== null ? (
                                        <span className="text-base font-black text-white">
                                            {student.entryScore}
                                            <span className="text-[11px] text-slate-500 font-bold ml-1">/ {student.maxScores[entryTest.id] ?? entryTest.maxScore}b</span>
                                        </span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-slate-800/20 text-slate-500/50 text-[10px] uppercase font-black tracking-widest rounded border border-white/5">Chýba</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {exitTest ? (
                                        student.exitScore !== null ? (
                                            <span className="text-base font-black text-white">
                                                {student.exitScore}
                                                <span className="text-[11px] text-slate-500 font-bold ml-1">/ {student.maxScores[exitTest.id] ?? exitTest.maxScore}b</span>
                                            </span>
                                        ) : (
                                            <span className="px-2 py-0.5 bg-slate-800/20 text-slate-500/50 text-[10px] uppercase font-black tracking-widest rounded border border-white/5">Chýba</span>
                                        )
                                    ) : (
                                        <span className="text-slate-700 font-bold text-[11px] uppercase tracking-tighter">Čaká sa...</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    {student.progress !== null ? (() => {
                                        const cls = classifyGain(student.progress);
                                        return (
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-lg border text-sm font-black ${cls.bg} ${cls.border} ${cls.text}`}>
                                                {student.progress >= 0 ? '+' : ''}{student.progress.toFixed(1).replace('.', ',')}%
                                            </span>
                                        );
                                    })() : (
                                        <span className="text-slate-700 font-bold text-[11px] uppercase tracking-widest italic">{exitTest ? 'N/A' : 'Nedostupné'}</span>
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

        </div>
    );
};