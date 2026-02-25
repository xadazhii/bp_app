import React from 'react';
import axios from 'axios';
import authHeader from '../../services/auth-header';
import { CheckCircleIcon } from '../common/Icons';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const TestResultDetailsModal = ({ resultId, onClose, onUpdate, beigeTextColor }) => {
    const [loading, setLoading] = React.useState(true);
    const [resultData, setResultData] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [evaluations, setEvaluations] = React.useState({});
    const [isUpdating, setIsUpdating] = React.useState(false);

    const fetchDetails = React.useCallback(async () => {
        try {
            const response = await axios.get(`${API_URL}/api/tests/results/${resultId}`, {
                headers: authHeader()
            });
            setResultData(response.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [resultId]);

    React.useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    React.useEffect(() => {
        if (resultData) {
            const initial = {};
            resultData.details.forEach(q => {
                initial[q.studentAnswerId] = {
                    isCorrect: q.isCorrect,
                    feedback: q.feedback || ""
                };
            });
            setEvaluations(initial);
        }
    }, [resultData]);

    const [confirming, setConfirming] = React.useState({});
    const [showRestartModal, setShowRestartModal] = React.useState(false);

    const handleUpdateAll = async () => {

        setIsUpdating(true);
        try {
            for (const [studentAnswerId, evalData] of Object.entries(evaluations)) {
                const original = resultData.details.find(q => q.studentAnswerId === Number(studentAnswerId));
                if (original && original.isCorrect === evalData.isCorrect && (original.feedback || "") === evalData.feedback) {
                    continue; // Skip if no changes
                }
                await axios.post(`${API_URL}/api/tests/results/evaluate-answer`, {
                    studentAnswerId,
                    isCorrect: evalData.isCorrect,
                    feedback: evalData.feedback
                }, { headers: authHeader() });
            }
            await fetchDetails();
            if (onUpdate) onUpdate();
            onClose(); // Close the modal after update
        } catch (err) {
            alert("Chyba pri ukladaní hodnotenia: " + err.message);
        } finally {
            setIsUpdating(false);
        }
    };

    if (loading) return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#121826] p-10 rounded-3xl border border-white/5 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Načítavam výsledky...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#121826] p-8 rounded-3xl border border-red-500/20 text-center max-w-sm w-full">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Chyba</h3>
                <p className="text-slate-400 mb-6">{error}</p>
                <button onClick={onClose} className="w-full bg-[#15203d] hover:bg-slate-600 text-white font-bold py-3 rounded-2xl transition-all">
                    Zavrieť
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
            <div className="bg-[#121826] border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
                <div className="p-4 sm:p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 bg-white/[0.02]">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] uppercase font-bold tracking-widest text-slate-500 mb-2 sm:mb-1">
                            <span className="truncate max-w-[120px]">{resultData.studentName || "Študent"}</span>
                            <span className="w-1 h-1 rounded-full bg-[#15203d] hidden xs:block"></span>
                            <span className="truncate max-w-[150px]">{resultData.studentEmail}</span>
                            {resultData.completedAt && (
                                <>
                                    <span className="w-1 h-1 rounded-full bg-[#15203d] hidden xs:block"></span>
                                    <span className="whitespace-nowrap">{new Date(resultData.completedAt).toLocaleString('sk-SK')}</span>
                                </>
                            )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight break-words">{resultData.testTitle}</h2>
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-3 sm:mt-2">
                            <span className="text-sm font-medium text-slate-400 whitespace-nowrap">
                                Skóre: <span className="text-blue-400 font-bold">{resultData.score} b.</span>
                            </span>
                            <div className="flex flex-wrap items-center gap-2">
                                {resultData.cheated && (
                                    <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded border border-red-500/20">Podvádzanie</span>
                                )}
                                <button
                                    onClick={() => setShowRestartModal(true)}
                                    className="px-2 py-1 sm:py-0.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 hover:border-orange-500/50 text-[10px] font-black uppercase rounded transition-all flex items-center gap-1.5"
                                    title="Zmazať výsledok a povoliť študentovi opakovať test"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                    Reštartovať
                                </button>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="absolute top-4 right-4 sm:static p-2 hover:bg-white/5 rounded-2xl transition-colors text-slate-400 hover:text-white bg-[#0f172a]/50 sm:bg-transparent">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {resultData.details.map((q, idx) => {
                        const evalLocal = evaluations[q.studentAnswerId] || { isCorrect: q.isCorrect, feedback: q.feedback || "" };
                        return (
                            <div key={q.questionId} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 sm:p-6 space-y-5">
                                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                                    <div className="flex gap-3 sm:gap-4 min-w-0">
                                        <span className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-black text-xs sm:text-sm border border-blue-500/20">
                                            {idx + 1}.
                                        </span>
                                        <h3 className="text-slate-100 font-bold leading-relaxed break-words text-sm sm:text-base pr-4">
                                            {q.questionText}
                                        </h3>
                                    </div>
                                    <div className="flex items-center self-start sm:self-auto shrink-0">
                                        <span className={`px-2.5 py-1 rounded-lg text-[9px] sm:text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${q.isCorrect ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-900/40' : 'bg-red-500 text-white shadow-lg shadow-red-900/40'}`}>
                                            {q.isCorrect ? `Správne (${q.earnedPoints ?? q.points ?? 0} b.)` : `Nesprávne (0 b.)`}
                                        </span>
                                    </div>
                                </div>

                                {q.type === 'CLOSED' ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                                        {q.allAnswers.map(ans => {
                                            const isSelected = q.selectedAnswerId === ans.id;
                                            const isCorrectAns = ans.pointsWeight > 0;
                                            let borderClass = "border-white/5";
                                            let bgClass = "bg-white/5";
                                            let icon = null;
                                            if (isSelected) {
                                                if (isCorrectAns) {
                                                    borderClass = "border-emerald-500/50";
                                                    bgClass = "bg-emerald-500/10";
                                                    icon = <CheckCircleIcon className="w-4 h-4 text-emerald-400" />;
                                                } else {
                                                    borderClass = "border-red-500/50";
                                                    bgClass = "bg-red-500/10";
                                                    icon = <ExclamationTriangleIcon className="w-4 h-4 text-red-400" />;
                                                }
                                            } else if (isCorrectAns) {
                                                borderClass = "border-emerald-500/30";
                                                bgClass = "bg-emerald-500/5";
                                            }
                                            return (
                                                <div key={ans.id} className={`p-3 rounded-2xl border ${borderClass} ${bgClass} flex items-center justify-between gap-3 transition-all`}>
                                                    <span className={`text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>{ans.text}</span>
                                                    {icon}
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="pl-0 sm:pl-12 space-y-3">
                                        <div className="p-3.5 bg-[#0f172a]/40 rounded-2xl border border-white/5">
                                            <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1.5 opacity-60">Odpoveď študenta:</p>
                                            <p className={`text-sm sm:text-base ${q.isCorrect ? 'text-emerald-400' : 'text-rose-400'} font-bold break-words`}>
                                                {q.studentTextResponse || "— Žiadna odpoveď —"}
                                            </p>
                                        </div>
                                        <div className="p-3.5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                            <p className="text-[9px] text-emerald-500/60 uppercase font-black tracking-widest mb-1.5 opacity-60">Správne varianty:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {q.allAnswers.filter(a => a.pointsWeight > 0).map(a => (
                                                    <span key={a.id} className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[11px] font-mono border border-emerald-500/20 break-all">
                                                        {a.text}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Evaluation Section for Admin */}
                                {!resultData.cheated && (
                                    <div className="pl-12 pt-4 mt-4 border-t border-white/5">
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-3">
                                            {q.type === 'OPEN' ? 'Manuálne hodnotenie a komentár' : 'Komentár pre študenta'}
                                        </p>
                                        <div className="space-y-4">
                                            {q.type === 'OPEN' && (
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                                    {confirming[q.studentAnswerId] ? (
                                                        <div className="flex flex-wrap items-center gap-3 bg-blue-500/10 border border-blue-500/20 px-3.5 py-2.5 rounded-2xl animate-fade-in w-full">
                                                            <QuestionMarkCircleIcon className="w-5 h-5 text-blue-400 shrink-0" />
                                                            <span className="text-xs font-black text-blue-100 flex-1">
                                                                Zmeniť na {confirming[q.studentAnswerId].targetIsCorrect ? 'SPRÁVNE' : 'NESPRÁVNE'}?
                                                            </span>
                                                            <div className="flex gap-2 w-full xs:w-auto">
                                                                <button
                                                                    onClick={() => {
                                                                        const target = confirming[q.studentAnswerId].targetIsCorrect;
                                                                        setEvaluations(prev => ({ ...prev, [q.studentAnswerId]: { ...prev[q.studentAnswerId], isCorrect: target } }));
                                                                        setConfirming(prev => ({ ...prev, [q.studentAnswerId]: null }));
                                                                    }}
                                                                    className="flex-1 xs:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-400 text-white text-[10px] font-black rounded-lg transition-all uppercase tracking-widest"
                                                                >
                                                                    Áno
                                                                </button>
                                                                <button
                                                                    onClick={() => setConfirming(prev => ({ ...prev, [q.studentAnswerId]: null }))}
                                                                    className="flex-1 xs:flex-none px-4 py-2 bg-[#15203d] hover:bg-slate-600 text-slate-300 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest"
                                                                >
                                                                    Nie
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <button
                                                                onClick={() => {
                                                                    if (!evalLocal.isCorrect) {
                                                                        setConfirming(prev => ({ ...prev, [q.studentAnswerId]: { targetIsCorrect: true } }));
                                                                    }
                                                                }}
                                                                className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${evalLocal.isCorrect ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/40' : 'bg-[#0f172a]/60 text-slate-500 border-white/5 hover:border-emerald-500/50'}`}
                                                            >
                                                                Označiť ako SPRÁVNE
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (evalLocal.isCorrect) {
                                                                        setConfirming(prev => ({ ...prev, [q.studentAnswerId]: { targetIsCorrect: false } }));
                                                                    }
                                                                }}
                                                                className={`w-full sm:w-auto px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${!evalLocal.isCorrect ? 'bg-rose-600 text-white border-rose-500 shadow-lg shadow-rose-900/40' : 'bg-[#0f172a]/60 text-slate-500 border-white/5 hover:border-rose-500/50'}`}
                                                            >
                                                                Označiť ako NESPRÁVNE
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                            <div className="relative">
                                                <textarea
                                                    placeholder="Pridať komentár pre študenta..."
                                                    value={evalLocal.feedback}
                                                    onChange={(e) => setEvaluations(prev => ({ ...prev, [q.studentAnswerId]: { ...prev[q.studentAnswerId], feedback: e.target.value } }))}
                                                    className="w-full bg-white/[0.02] border border-white/5 rounded-2xl p-3 text-sm text-slate-300 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 transition-all min-h-[80px]"
                                                />
                                            </div>
                                            {q.feedback && q.feedback !== evalLocal.feedback && (
                                                <div className="flex items-start gap-2.5 p-3.5 bg-blue-500/5 rounded-2xl border border-blue-500/10 animate-fade-in overflow-hidden">
                                                    <SparklesIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                                                    <p className="text-[11px] text-blue-100 leading-relaxed italic break-words">Aktuálny uložený komentár: <span className="text-slate-400">"{q.feedback}"</span></p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                <div className="p-4 sm:p-6 border-t border-white/5 flex flex-col sm:flex-row gap-3 sm:gap-4 shrink-0 bg-white/[0.02]">
                    <button onClick={onClose} className="order-2 sm:order-1 flex-1 bg-[#0f172a] hover:bg-[#15203d] text-white font-black py-4 rounded-2xl transition-all border border-white/5 hover:border-white/10 uppercase tracking-widest text-xs">
                        Zavrieť
                    </button>
                    {!resultData.cheated && (
                        <button onClick={handleUpdateAll} disabled={isUpdating} className={`order-1 sm:order-2 flex-[2] flex items-center justify-center gap-2 ${isUpdating ? 'bg-blue-600/50 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/40'} text-white font-black py-4 rounded-2xl transition-all uppercase tracking-widest text-xs`}>
                            {isUpdating && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                            {isUpdating ? 'Aktualizujem...' : 'Aktualizovať úpravy'}
                        </button>
                    )}
                </div>

                {/* Restart Confirmation Modal Overlaid inside the details modal view context */}
                {showRestartModal && (
                    <div className="absolute inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm rounded-3xl p-4">
                        <div className="bg-[#121826] border border-orange-500/20 rounded-2xl p-6 w-full max-w-sm shadow-[0_0_40px_rgba(249,115,22,0.1)] text-center animate-scale-up">
                            <div className="w-16 h-16 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Reštartovať test?</h3>
                            <p className="text-sm text-slate-400 mb-6">
                                Naozaj chcete vynulovať test <strong>{resultData.testTitle}</strong>? Body študenta budú znížené o skóre z tohto testu a študent bude môcť test urobiť znova.
                            </p>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowRestartModal(false)}
                                    className="flex-1 px-4 py-2.5 bg-[#0f172a] hover:bg-[#15203d] text-slate-300 text-sm font-bold rounded-2xl transition-all border border-white/5"
                                >
                                    Zrušiť
                                </button>
                                <button
                                    onClick={async () => {
                                        setShowRestartModal(false);
                                        try {
                                            await axios.delete(`${API_URL}/api/tests/results/${resultId}`, { headers: authHeader() });
                                            if (onUpdate) onUpdate();
                                            onClose();
                                        } catch (err) {
                                            alert("Chyba pri nulovaní testu: " + err.message);
                                        }
                                    }}
                                    className="flex-1 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-2xl transition-all shadow-lg hover:shadow-orange-500/25"
                                >
                                    Áno, reštartovať
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TestResultDetailsModal;