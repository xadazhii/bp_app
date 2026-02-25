import React, { Component } from "react";
import authHeader from "../services/auth-header";
import axios from "axios";
const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
    </svg>
);
const BookOpenIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);
const DownloadIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="7 10 12 15 17 10"></polyline>
        <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
);
const UploadIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
        <polyline points="17 8 12 3 7 8"></polyline>
        <line x1="12" y1="3" x2="12" y2="15"></line>
    </svg>
);
const PlusCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
    </svg>
);
const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 5 21 5"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m5 0V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);
const CalendarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);
const TestIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
);
const GraduationCap = (props) =>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c3 3 12 3 12 0v-5" />
    </svg>;
const UserCircleIcon = (props) =>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>;

const LogoutIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);
const ExclamationTriangleIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);
const CheckCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9 12l2 2 4-4"></path>
    </svg>
);
const EyeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);
const CheatedIcon = (props) => (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 10s4-1 5-1 4 1 5 1 4-1 5-1 5 1 5 1" />
        <path d="M7 9c0 4 3 7 3 7s3-3 3-7" />
        <path d="M11 9c0 4 3 7 3 7s3-3 3-7" />
        <circle cx="8.5" cy="11.5" r="0.5" fill="currentColor" />
        <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor" />
    </svg>
);
const SearchIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"></circle>
        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
);
const SparklesIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.456-2.455l.259-1.036.259 1.036a3.375 3.375 0 002.455 2.455l1.036.259-1.036.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
);
const QuestionMarkCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
    </svg>
);

const RotateCcw = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 4v6h6"></path>
        <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
    </svg>
);
const TrendingUpIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
        <polyline points="17 6 23 6 23 12"></polyline>
    </svg>
);

const CustomSelect = ({ options, value, onChange, placeholder, className = "" }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const selectRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectRef.current && !selectRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find(o => o.value === value);

    return (
        <div ref={selectRef} className={`relative ${className}`}>
            <div
                className="w-full px-4 py-2 min-h-[42px] rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold cursor-pointer flex justify-between items-center transition-colors hover:border-blue-500 hover:bg-slate-600 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="truncate flex-grow min-w-0 text-left">{selectedOption ? selectedOption.label : placeholder}</span>
                <svg className={`shrink-0 ml-2 w-5 h-5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-blue-400' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            {isOpen && (
                <div className="absolute z-[1001] w-full mt-1 bg-[#0f172a] border border-white/5 rounded-lg shadow-2xl overflow-hidden ring-1 ring-blue-500/20">
                    <div className="max-h-[170px] overflow-y-auto overflow-x-hidden dropdown-scrollbar" style={{ scrollbarWidth: 'thin', scrollbarColor: '#3b82f6 rgba(15, 23, 42, 0.5)' }}>
                        {options.map((option) => (
                            <div
                                key={option.value}
                                className={`px-4 py-3 cursor-pointer transition-colors flex items-center justify-between group ${value === option.value
                                    ? 'bg-blue-600/20 text-blue-400 border-l-2 border-blue-500'
                                    : 'text-slate-200 hover:bg-[#15203d] hover:text-white border-l-2 border-transparent hover:border-white/10'
                                    }`}
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                            >
                                <span className="font-medium truncate">{option.label}</span>
                                {value === option.value && (
                                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                                )}
                            </div>
                        ))}
                    </div>
                    {options.length > 3 && (
                        <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/80 to-transparent pointer-events-none rounded-b-lg border-b-2 border-blue-500/30 flex items-end justify-center pb-1">
                            <span className="text-[9px] uppercase tracking-widest text-blue-400/70 font-bold mb-1">↑ Rolujte nadol ↓</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

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
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const ProgressAnalysis = ({ summaryData }) => {
    if (!summaryData) return (
        <div className="flex flex-col items-center justify-center p-12 text-slate-400">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Pripravujem analýzu...</p>
        </div>
    );

    const entryTest = summaryData.tests.find(t => t.weekNumber === 0);
    const exitTest = summaryData.tests.find(t => t.weekNumber === 13);

    const studentsProgress = summaryData.studentGrades.map(student => {
        const entryScore = entryTest ? (student.scores[entryTest.id] ?? null) : null;
        const exitScore = exitTest ? (student.scores[exitTest.id] ?? null) : null;

        let progress = null;
        if (entryScore !== null && exitScore !== null && entryTest.maxScore > 0 && exitTest.maxScore > 0) {
            const entryPercent = (entryScore / entryTest.maxScore) * 100;
            const exitPercent = (exitScore / exitTest.maxScore) * 100;
            progress = exitPercent - entryPercent;
        }

        return {
            ...student,
            entryScore,
            exitScore,
            progress
        };
    });

    const activeProgress = studentsProgress.filter(p => p.progress !== null);
    const avgProgress = activeProgress.length > 0
        ? (activeProgress.reduce((acc, p) => acc + p.progress, 0) / activeProgress.length).toFixed(1)
        : '0';

    if (!entryTest || !exitTest) {
        return (
            <div className="p-12 bg-[#0f172a]/50 rounded-[2rem] border border-white/5 text-center animate-fade-in">
                <div className="w-20 h-20 bg-yellow-500/10 text-yellow-500 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <ExclamationTriangleIcon className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Chýbajúce testy pre analýzu</h3>
                <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">
                    Pre porovnanie vedomostí systém vyžaduje prítomnosť dvoch kľúčových testov:
                    <br />
                    1. <span className="text-blue-400 font-bold">Vstupný test</span> (Týždeň 0)
                    <br />
                    2. <span className="text-emerald-400 font-bold">Záverečný test</span> (Týždeň 13)
                    <br /><br />
                    Uistite sa, že tieto testy sú vytvorené v sekcii "Testy" so správnym priradením týždňa.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6 sm:space-y-8 animate-fade-in pb-12">
            <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
                <div className="max-w-xl">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-400 tracking-tight">Analýza progresu</h2>
                    <p className="text-slate-400 mt-2 text-sm sm:text-base leading-relaxed">Sledovanie rastu vedomostí medzi začiatkom a koncom semestra na základe kľúčových testov.</p>
                </div>
                {studentsProgress.length > 0 && (
                    <div className="bg-[#0f172a]/60 backdrop-blur-md border border-white/5 rounded-2xl p-4 sm:p-5 flex items-center gap-5 shadow-xl transition-all hover:border-blue-500/30 group self-start lg:self-auto w-full sm:w-auto">
                        <div className="p-3 bg-blue-500/10 rounded-2xl group-hover:scale-110 transition-transform">
                            <TrendingUpIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-400" />
                        </div>
                        <div>
                            <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1">Globálny rast</p>
                            <p className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1">
                                {avgProgress >= 0 ? '+' : ''}{avgProgress}
                                <span className="text-base sm:text-lg text-blue-400 font-bold">%</span>
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Mobile Cards View (Hidden on LG) */}
            <div className="lg:hidden space-y-4">
                {studentsProgress.map(student => (
                    <div key={student.id} className="bg-[#0f172a]/50 border border-white/5 rounded-2xl p-5 shadow-lg group">
                        <div className="flex items-center gap-4 mb-5 pb-4 border-b border-white/5">
                            <div className="w-10 h-10 rounded-2xl bg-[#15203d] flex items-center justify-center text-slate-300 font-black text-xs uppercase shadow-inner">
                                {student.username.substring(0, 2)}
                            </div>
                            <div className="min-w-0">
                                <div className="font-bold text-white text-base truncate">{student.username}</div>
                                <div className="text-xs text-slate-500 truncate">{student.email}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Vstupný test</p>
                                <p className="text-lg font-black text-white">
                                    {student.entryScore !== null ? student.entryScore : <span className="text-slate-600 italic text-sm font-normal">N/A</span>}
                                    {student.entryScore !== null && <span className="text-[10px] text-slate-500 font-bold ml-1">/ {entryTest.maxScore}b</span>}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Záverečný test</p>
                                <p className="text-lg font-black text-white">
                                    {student.exitScore !== null ? student.exitScore : <span className="text-slate-600 italic text-sm font-normal">N/A</span>}
                                    {student.exitScore !== null && <span className="text-[10px] text-slate-500 font-bold ml-1">/ {exitTest.maxScore}b</span>}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 pt-4 border-t border-white/5 flex justify-between items-center">
                            <p className="text-xs font-bold text-slate-400">Progresívny posun:</p>
                            {student.progress !== null ? (
                                <span className={`flex items-center gap-1.5 font-black text-lg ${student.progress >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {student.progress >= 0 ? '+' : ''}{student.progress.toFixed(1)}%
                                    <TrendingUpIcon className={`w-5 h-5 ${student.progress < 0 ? 'rotate-180 text-rose-400' : 'text-emerald-400'}`} />
                                </span>
                            ) : (
                                <span className="text-slate-600 text-[10px] uppercase font-bold italic">Nedostupné</span>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Desktop Table View (Hidden on smaller than LG) */}
            <div className="hidden lg:block overflow-x-auto rounded-[2rem] border border-white/5 shadow-2xl">
                <table className="min-w-full bg-[#0f172a]/40 backdrop-blur-sm overflow-hidden">
                    <thead>
                        <tr className="bg-[#0f172a]/60 border-b border-white/5">
                            <th className="px-8 py-5 text-left text-slate-400 font-bold uppercase tracking-widest text-[10px]">Študent</th>
                            <th className="px-8 py-5 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Vstupný test ({entryTest.maxScore}b)</th>
                            <th className="px-8 py-5 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Záverečný test ({exitTest.maxScore}b)</th>
                            <th className="px-8 py-5 text-right text-slate-400 font-bold uppercase tracking-widest text-[10px]">Progresívny posun</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {studentsProgress.map(student => (
                            <tr key={student.id} className="hover:bg-[#15203d]/30 transition-all group">
                                <td className="px-8 py-5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-2xl bg-[#15203d]/50 flex items-center justify-center text-slate-300 font-black text-xs shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            {student.username.substring(0, 2).toUpperCase()}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors">{student.username}</div>
                                            <div className="text-[11px] text-slate-500 font-medium truncate">{student.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {student.entryScore !== null ? (
                                        <span className="text-lg font-black text-white">{student.entryScore}</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-[#0f172a]/50 text-slate-500/50 text-[10px] uppercase font-black tracking-widest rounded-lg border border-white/5">Chýba</span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-center">
                                    {student.exitScore !== null ? (
                                        <span className="text-lg font-black text-white">{student.exitScore}</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-[#0f172a]/50 text-slate-500/50 text-[10px] uppercase font-black tracking-widest rounded-lg border border-white/5">Chýba</span>
                                    )}
                                </td>
                                <td className="px-8 py-5 text-right">
                                    {student.progress !== null ? (
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border font-black text-base shadow-sm ${student.progress >= 0 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                                            {student.progress >= 0 ? '+' : ''}{student.progress.toFixed(1)}%
                                            <TrendingUpIcon className={`w-5 h-5 ${student.progress < 0 ? 'rotate-180' : ''}`} />
                                        </div>
                                    ) : (
                                        <span className="text-slate-600 text-xs font-bold italic opacity-40">—</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {studentsProgress.length === 0 && (
                <div className="p-12 text-center bg-[#0f172a]/40 backdrop-blur-sm rounded-[2rem] border border-dashed border-white/5 shadow-inner">
                    <div className="w-16 h-16 bg-[#15203d]/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <UserIcon className="w-8 h-8 text-slate-600" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Zatiaľ žiadni študenti na analýzu</p>
                </div>
            )}
        </div>

    );
};

export default class BoardAdmin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentPage: "user-management",
            content: "",
            messages: [],
            message: { text: "", type: "" },
            users: [],
            materials: [],
            semesterStartDate: "",
            adminEmail: "",
            newMaterial: { title: "", type: "lecture", weekNumber: 1, file: null },
            selectedStudentFile: null,
            uploadingStudentList: false,
            allowedStudents: [],
            newAllowedStudentEmail: "",
            addingAllowedStudent: false,
            deletingAllowedStudentEmail: null,
            calendarEvents: [],
            newEvent: { date: "", message: "" },
            addingEvent: false,
            deletingEventId: null,
            tests: [],
            newTest: { title: "", weekNumber: 0, examDateTime: "", timeLimit: "" },
            creatingTest: false,
            newTestQuestions: [
                { question: "", type: "CLOSED", points: 1, answers: [{ text: "", pointsWeight: 1 }, { text: "", pointsWeight: 0 }] }
            ],
            editingTestId: null,
            editingTest: { title: "" },
            editingTestQuestions: [],
            studentGrades: { tests: [], studentGrades: [] },
            gradesLoading: true,
            gradesViewMode: 'cards',
            viewedResultId: null,
            isSidebarOpen: false,
            studentSearchQuery: "",
            userSearchQuery: "",
        };
        this.handleStudentFileChange = this.handleStudentFileChange.bind(this);
    }
    componentDidMount() {
        this.fetchUsers();
        this.fetchMaterials();
        this.fetchAllowedStudents();
        this.fetchCalendarEvents();
        this.fetchTests();
        this.fetchSettings();
    }
    showMessage(text, type) {
        const id = Date.now() + Math.random();
        const newMessage = { id, text, type };
        this.setState(prevState => ({
            messages: [...(prevState.messages || []), newMessage]
        }));
        setTimeout(() => {
            this.setState(prevState => ({
                messages: prevState.messages.filter(m => m.id !== id)
            }));
        }, 5000);
    }
    removeMessage = (id) => {
        this.setState(prevState => ({
            messages: prevState.messages.filter(m => m.id !== id)
        }));
    }
    setCurrentPage(page) {
        this.setState({ currentPage: page });
        if (page === "student-list-upload") this.fetchAllowedStudents();
        if (page === "calendar-management") this.fetchCalendarEvents();
        if (page === "test-management") this.fetchTests();
        if (page === "student-grades") this.fetchStudentGrades();
        if (page === "material-management") this.fetchSettings();
    }
    fetchSettings = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/settings/semester-start`, { headers: authHeader() });
            this.setState({
                semesterStartDate: res.data.semesterStartDate || "",
                adminEmail: res.data.adminEmail || ""
            });
        } catch (e) {
            console.error("Failed to load settings");
        }
    };

    handleDateSave = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/settings/semester-start`, { semesterStartDate: this.state.semesterStartDate }, { headers: authHeader() });
            this.showMessage("Dátum začiatku semestra bol aktualizovaný!", "success");
        } catch {
            this.showMessage("Nepodarilo sa aktualizovať dátum.", "error");
        }
    };
    async fetchUsers() {
        try {
            const res = await fetch(`${API_URL}/api/users`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const users = await res.json();
            this.setState({ users });
        } catch {
            this.showMessage("Nepodarilo sa načítať používateľov.", "error");
        }
    }
    async handleRoleChange(userId, newRole) {
        try {
            await fetch(`${API_URL}/api/users/${userId}/role`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ role: newRole }),
            });
            this.fetchUsers();
            this.showMessage(`Rola používateľa aktualizovaná na ${newRole}.`, "success");
        } catch {
            this.showMessage("Nepodarilo sa aktualizovať rolu používateľa.", "error");
        }
    }
    async handleDeleteUser(userId) {
        try {
            await fetch(`${API_URL}/api/users/${userId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchUsers();
            this.showMessage("Používateľ odstránený.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť používateľa.", "error");
        }
    }
    async fetchMaterials() {
        try {
            const res = await fetch(`${API_URL}/api/materials?all=true`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const materials = await res.json();
            this.setState({ materials });
        } catch {
            this.showMessage("Nepodarilo sa načítať materiály.", "error");
        }
    }
    handleAddMaterial = async (e) => {
        e.preventDefault();
        const { newMaterial } = this.state;
        if (!newMaterial.title || !newMaterial.file) {
            this.showMessage("Prosím, vyplňte všetky polia a vyberte súbor.", "error");
            return;
        }
        const formData = new FormData();
        formData.append("title", newMaterial.title);
        formData.append("type", newMaterial.type);
        formData.append("weekNumber", newMaterial.weekNumber);
        formData.append("file", newMaterial.file);
        try {
            await fetch(`${API_URL}/api/materials`, {
                method: "POST",
                headers: { ...authHeader() },
                body: formData,
            });
            this.fetchMaterials();
            this.setState({ newMaterial: { title: "", type: "lecture", weekNumber: 1, file: null } });
            this.showMessage("Materiál úspešne pridaný!", "success");
            if (e.target.elements.file) e.target.elements.file.value = "";
        } catch {
            this.showMessage("Nepodarilo sa pridať materiál.", "error");
        }
    };
    async handleDeleteMaterial(materialId) {
        try {
            await fetch(`${API_URL}/api/materials/${materialId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchMaterials();
            this.showMessage("Materiál odstránený.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť materiál.", "error");
        }
    }
    handleStudentFileChange(e) {
        this.setState({ selectedStudentFile: e.target.files[0] });
    }
    handleStudentListUpload = async (e) => {
        e.preventDefault();
        const { selectedStudentFile } = this.state;
        if (!selectedStudentFile) {
            this.showMessage("Prosím, vyberte PDF súbor na nahrávanie.", "error");
            return;
        }
        this.setState({ uploadingStudentList: true });
        this.showMessage("Nahrávanie a spracovanie zoznamu študentov...", "info");
        const formData = new FormData();
        formData.append("file", selectedStudentFile);
        try {
            const res = await fetch(`${API_URL}/api/students/upload`, {
                method: "POST",
                headers: { ...authHeader() },
                body: formData,
            });
            const result = await res.json();
            if (!res.ok) throw new Error(result.message || "Nepodarilo sa nahrať");
            this.setState({ uploadingStudentList: false, selectedStudentFile: null });
            this.showMessage(result.message, "success");
            e.target.reset();
            this.fetchAllowedStudents();
        } catch (error) {
            this.setState({ uploadingStudentList: false });
            this.showMessage(error.toString(), "error");
        }
    };
    async fetchAllowedStudents() {
        try {
            const res = await fetch(`${API_URL}/api/allowed-students`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const allowedStudents = await res.json();
            this.setState({ allowedStudents });
        } catch {
            this.showMessage("Nepodarilo sa načítať povolených študentov.", "error");
        }
    }
    handleAllowedStudentEmailChange = (e) => {
        this.setState({ newAllowedStudentEmail: e.target.value });
    };
    handleAddAllowedStudent = async (e) => {
        e.preventDefault();
        const { newAllowedStudentEmail, allowedStudents } = this.state;
        if (!newAllowedStudentEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newAllowedStudentEmail)) {
            this.showMessage("Zadajte platný e-mail.", "error");
            return;
        }
        if (allowedStudents.some((s) => s.email.toLowerCase() === newAllowedStudentEmail.toLowerCase())) {
            this.showMessage("Tento e-mail je už v zozname.", "error");
            return;
        }
        this.setState({ addingAllowedStudent: true });
        try {
            const res = await fetch(`${API_URL}/api/allowed-students`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({ email: newAllowedStudentEmail }),
            });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Nepodarilo sa pridať povoleného študenta");
            }
            this.setState({ newAllowedStudentEmail: "" });
            this.showMessage("Študent pridaný do zoznamu povolených.", "success");
            this.fetchAllowedStudents();
        } catch (error) {
            this.showMessage(error.message, "error");
        } finally {
            this.setState({ addingAllowedStudent: false });
        }
    };
    async handleDeleteAllowedStudent(email) {
        this.setState({ deletingAllowedStudentEmail: email });
        try {
            const res = await fetch(`${API_URL}/api/allowed-students?email=${encodeURIComponent(email)}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            let message = "Študent odstránený zo zoznamu povolených.";
            if (res.status !== 204) {
                const data = await res.json();
                message = data.message || message;
            }
            if (!res.ok) throw new Error(message);
            this.showMessage(message, "success");
            await this.fetchAllowedStudents();
        } catch (error) {
            this.showMessage(error.message, "error");
        } finally {
            this.setState({ deletingAllowedStudentEmail: null });
        }
    }
    async fetchStudentGrades() {
        this.setState({ gradesLoading: true });
        try {
            const res = await fetch(`${API_URL}/api/grades/summary`, {
                headers: authHeader(),
            });
            if (!res.ok) throw new Error("Nepodarilo sa načítať hodnotenia.");
            const data = await res.json();
            this.setState({ studentGrades: data, gradesLoading: false });
        } catch (error) {
            this.showMessage("Chyba pri načítaní hodnotení študentov.", "error");
            this.setState({ gradesLoading: false });
        }
    }

    handleExportGrades = async () => {
        try {
            this.showMessage("Pripravujem dáta na export...", "info");

            const response = await axios({
                url: `${API_URL}/api/export/students`,
                method: 'GET',
                headers: authHeader(),
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv;charset=utf-8' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'results.csv');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            this.showMessage("Export bol úспеšne dokončený.", "success");
        } catch (error) {
            console.error("Export error:", error);
            this.showMessage("Nepodarilo sa exportovať dáта. Skontrolujte oprávnenia.", "error");
        }
    };
    async fetchCalendarEvents() {
        try {
            const res = await fetch(`${API_URL}/api/calendar-events`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const calendarEvents = await res.json();
            this.setState({ calendarEvents });
        } catch {
            this.showMessage("Nepodarilo sa načítať udalosti v kalendári.", "error");
        }
    }
    handleAddEvent = async (e) => {
        e.preventDefault();
        const { newEvent } = this.state;
        if (!newEvent.date || !newEvent.message) {
            this.showMessage("Prosím, vyberte dátum a zadajte správu.", "error");
            return;
        }
        this.setState({ addingEvent: true });
        try {
            await fetch(`${API_URL}/api/calendar-events`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify({
                    eventDate: newEvent.date,
                    message: newEvent.message,
                }),
            });
            this.fetchCalendarEvents();
            this.setState({ newEvent: { date: "", message: "" } });
            this.showMessage("Udalosť v kalendári úspešne pridaná!", "success");
        } catch {
            this.showMessage("Nepodarilo sa pridať udalosť v kalendári.", "error");
        } finally {
            this.setState({ addingEvent: false });
        }
    };
    async handleDeleteEvent(eventId) {
        this.setState({ deletingEventId: eventId });
        try {
            await fetch(`${API_URL}/api/calendar-events/${eventId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            this.fetchCalendarEvents();
            this.showMessage("Udalosť odstránená.", "success");
        } catch {
            this.showMessage("Nepodarilo sa odstrániť udalosť.", "error");
        } finally {
            this.setState({ deletingEventId: null });
        }
    }

    async fetchTests() {
        try {
            const res = await fetch(`${API_URL}/api/tests?all=true`, { headers: authHeader() });
            if (!res.ok) throw new Error();
            const tests = await res.json();
            this.setState({ tests });
        } catch {
            this.showMessage("Nepodarilo sa načítať testy.", "error");
        }
    }
    openTestCreation = () => {
        this.setState({
            creatingTest: true,
            newTest: { title: "", weekNumber: 0, examDateTime: "", timeLimit: "" },
            newTestQuestions: [
                { question: "", type: "OPEN", points: 1, answers: [{ text: "", pointsWeight: 1 }] }
            ]
        });
    };
    addQuestion = () => {
        this.setState((prev) => ({
            newTestQuestions: [
                ...prev.newTestQuestions,
                { question: "", type: "CLOSED", points: 1, answers: [{ text: "", pointsWeight: 1 }, { text: "", pointsWeight: 0 }] }
            ]
        }));
    };
    removeQuestion = (idx) => {
        const questions = [...this.state.newTestQuestions];
        if (questions.length > 1) {
            questions.splice(idx, 1);
            this.setState({ newTestQuestions: questions });
        } else {
            this.showMessage("Test musí obsahovať aspoň jednu otázku.", "error");
        }
    };
    updateQuestion = (idx, field, value) => {
        const questions = [...this.state.newTestQuestions];
        questions[idx][field] = value;
        this.setState({ newTestQuestions: questions });
    };
    updateAnswer = (qIdx, aIdx, field, value) => {
        const questions = [...this.state.newTestQuestions];
        questions[qIdx].answers[aIdx][field] = value;
        this.setState({ newTestQuestions: questions });
    };
    addAnswer = (qIdx) => {
        const questions = [...this.state.newTestQuestions];
        const qType = questions[qIdx].type;
        questions[qIdx].answers.push({ text: "", pointsWeight: qType === 'OPEN' ? 1 : 0 });
        this.setState({ newTestQuestions: questions });
    };
    removeAnswer = (qIdx, aIdx) => {
        const questions = [...this.state.newTestQuestions];
        questions[qIdx].answers.splice(aIdx, 1);
        this.setState({ newTestQuestions: questions });
    };
    saveTest = async (e) => {
        e.preventDefault();
        const { newTest, newTestQuestions } = this.state;
        const payload = {
            title: newTest.title,
            weekNumber: newTest.weekNumber,
            examDateTime: newTest.examDateTime || null,
            timeLimit: newTest.timeLimit ? parseInt(newTest.timeLimit, 10) : null,
            questions: newTestQuestions.map(q => ({
                question: q.question,
                type: q.type,
                points: q.points,
                answers: q.answers.map(a => ({
                    text: a.text,
                    pointsWeight: parseInt(a.pointsWeight, 10) || 0
                }))
            }))
        };
        try {
            await fetch(`${API_URL}/api/tests`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...authHeader() },
                body: JSON.stringify(payload),
            });
            this.setState({ creatingTest: false });
            this.fetchTests();
            this.showMessage("Test bol úspešne vytvorený!", "success");
        } catch {
            this.showMessage("Nepodarilo sa vytvoriť test.", "error");
        }
    };
    async handleDeleteTest(testId) {
        try {
            const res = await fetch(`${API_URL}/api/tests/${testId}`, {
                method: "DELETE",
                headers: authHeader(),
            });
            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData || "Nepodarilo sa odstrániť test.");
            }
            this.fetchTests();
            this.showMessage("Test odstránený.", "success");
        } catch (error) {
            this.showMessage(error.message, "error");
        }
    }
    async openEditTest(test) {
        try {
            const response = await fetch(`${API_URL}/api/tests/${test.id}`, {
                headers: authHeader()
            });
            if (!response.ok) {
                throw new Error("Nepodarilo sa načítať detaily testu.");
            }
            const testDetails = await response.json();
            const mappedQuestions = testDetails.questions.map(q => ({
                questionId: q.questionId,
                question: q.question,
                type: q.type || "CLOSED",
                points: q.points || 1,
                answers: q.answers.map(a => ({
                    answerId: a.answerId,
                    text: a.text,
                    pointsWeight: a.pointsWeight || 0
                }))
            }));
            this.setState({
                editingTestId: testDetails.id,
                editingTest: {
                    title: testDetails.title,
                    weekNumber: testDetails.weekNumber || 0,
                    examDateTime: testDetails.examDateTime || "",
                    timeLimit: testDetails.timeLimit || ""
                },
                editingTestQuestions: mappedQuestions,
                creatingTest: false,
            });
        } catch (error) {
            this.showMessage("Chyba pri načítaní testu: " + error.message, "error");
        }
    }
    updateEditQuestion = (idx, field, value) => {
        const questions = [...this.state.editingTestQuestions];
        questions[idx][field] = value;
        this.setState({ editingTestQuestions: questions });
    };
    removeEditQuestion = (idx) => {
        const questions = [...this.state.editingTestQuestions];
        if (questions.length > 1) {
            questions.splice(idx, 1);
            this.setState({ editingTestQuestions: questions });
        } else {
            this.showMessage("Test musí obsahovať aspoň jednu otázku.", "error");
        }
    };
    updateEditAnswer = (qIdx, aIdx, field, value) => {
        this.setState(prevState => {
            const newQuestions = [...prevState.editingTestQuestions];
            newQuestions[qIdx].answers[aIdx] = {
                ...newQuestions[qIdx].answers[aIdx],
                [field]: value
            };
            return { editingTestQuestions: newQuestions };
        });
    };
    addEditAnswer = (qIdx) => {
        const questions = [...this.state.editingTestQuestions];
        const qType = questions[qIdx].type;
        questions[qIdx].answers.push({ text: '', pointsWeight: qType === 'OPEN' ? 1 : 0 });
        this.setState({ editingTestQuestions: questions });
    };
    removeEditAnswer = (qIdx, aIdx) => {
        const questions = [...this.state.editingTestQuestions];
        questions[qIdx].answers.splice(aIdx, 1);
        this.setState({ editingTestQuestions: questions });
    };
    saveEditTest = async (e) => {
        e.preventDefault();
        const { editingTestId, editingTest, editingTestQuestions } = this.state;
        const payload = {
            title: editingTest.title,
            weekNumber: editingTest.weekNumber || 0,
            examDateTime: editingTest.examDateTime || null,
            timeLimit: editingTest.timeLimit ? parseInt(editingTest.timeLimit, 10) : null,
            questions: editingTestQuestions.map(q => ({
                question: q.question,
                type: q.type,
                points: q.points,
                answers: q.answers.map(a => ({ text: a.text, pointsWeight: parseInt(a.pointsWeight, 10) || 0 }))
            }))
        };
        try {
            const response = await fetch(`${API_URL}/api/tests/${editingTestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...authHeader()
                },
                body: JSON.stringify(payload)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Nepodarilo sa uložiť zmeny.");
            }
            this.showMessage("Test bol úspešne upravený.", "success");
            this.cancelEditTest();
            this.fetchTests();
        } catch (error) {
            this.showMessage("Chyba pri ukladaní zmien: " + error.message, "error");
        }
    };
    cancelEditTest = () => {
        this.setState({
            editingTestId: null,
            editingTest: { title: '', weekNumber: 0, examDateTime: "", timeLimit: "" },
            editingTestQuestions: []
        });
    };
    render() {
        const {
            currentPage,
            messages,
            users,
            materials,
            newMaterial,
            uploadingStudentList,
            allowedStudents,
            newAllowedStudentEmail,
            addingAllowedStudent,
            deletingAllowedStudentEmail,
            calendarEvents,
            newEvent,
            addingEvent,
            deletingEventId,
            tests,
            newTest,
            creatingTest,
            newTestQuestions,
            editingTestId,
            editingTest,
            editingTestQuestions,
            studentGrades,
            gradesLoading,
            gradesViewMode,
            viewedResultId,
            isSidebarOpen,
        } = this.state;
        const roles = ["admin", "user"];
        const filteredLectures = materials.filter((m) => m.type === "lecture");
        const filteredSeminars = materials.filter((m) => m.type === "seminar");
        const beigeTextColor = "#F5F5DC";
        return (
            <div className="relative flex min-h-screen bg-[#0f172a] font-sans text-slate-200 overflow-x-hidden w-full max-w-[100vw]">
                {/* Toasts Container */}
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-3 w-[90%] max-w-md pointer-events-none">
                    {(messages || []).map((msg) => (
                        <div
                            key={msg.id}
                            className={`p-4 rounded-2xl shadow-2xl border flex items-center justify-between backdrop-blur-md pointer-events-auto animate-fade-in-down transition-all transform hover:scale-[1.02] ${msg.type === "success"
                                ? "bg-emerald-500/90 border-emerald-400/30 text-white shadow-emerald-900/40"
                                : msg.type === "error"
                                    ? "bg-rose-500/90 border-rose-400/30 text-white shadow-rose-900/40"
                                    : "bg-blue-500/90 border-blue-400/30 text-white shadow-blue-900/40"
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    {msg.type === "success" && <CheckCircleIcon className="w-5 h-5 text-white" />}
                                    {msg.type === "error" && <ExclamationTriangleIcon className="w-5 h-5 text-white" />}
                                    {msg.type !== "success" && msg.type !== "error" && <SearchIcon className="w-5 h-5 text-white" />}
                                </div>
                                <span className="font-bold text-sm tracking-tight">{msg.text}</span>
                            </div>
                            <button
                                onClick={() => this.removeMessage(msg.id)}
                                className="ml-4 p-1.5 hover:bg-white/20 rounded-2xl transition-colors shrink-0"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
                <aside
                    className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0f172a]/80 flex flex-col p-4 border-r border-white/5 shadow-xl
                       transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 
                       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
                >
                    <div className="text-2xl font-bold mb-8 text-center" style={{ color: beigeTextColor }}>
                        Administrácia
                    </div>
                    <nav className="flex-grow space-y-0.5 mt-2 overflow-y-auto pr-2">
                        <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Správa systému</div>
                        <button
                            onClick={() => { this.setCurrentPage("user-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "user-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <UserIcon className="mr-3 text-current w-5 h-5" /> Používatelia
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("calendar-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "calendar-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <CalendarIcon className="mr-3 text-current w-5 h-5" /> Udalosti
                        </button>

                        <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Vzdelávanie</div>
                        <button
                            onClick={() => { this.setCurrentPage("material-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "material-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <BookOpenIcon className="mr-3 text-current w-5 h-5" /> Materiály
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("test-management"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "test-management" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <TestIcon className="mr-3 text-current w-5 h-5" /> Testy
                        </button>

                        <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Študenti</div>
                        <button
                            onClick={() => { this.setCurrentPage("student-list-upload"); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "student-list-upload" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <UploadIcon className="mr-3 text-current w-5 h-5" /> Registrácia
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("student-grades"); this.fetchStudentGrades(); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "student-grades" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <GraduationCap className="mr-3 text-current w-5 h-5" /> Hodnotenie
                        </button>
                        <button
                            onClick={() => { this.setCurrentPage("progress-analysis"); this.fetchStudentGrades(); this.setState({ isSidebarOpen: false }); }}
                            className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === "progress-analysis" ? "bg-blue-600 shadow-lg text-white" : "hover:bg-[#15203d]/70 text-slate-300"}`}
                        >
                            <TrendingUpIcon className="mr-3 text-current w-5 h-5" /> Analýza progresu
                        </button>


                        <div className="my-2 border-t border-white/5 mx-2"></div>
                        <button
                            onClick={() => {
                                localStorage.removeItem("user");
                                window.location.href = "/login";
                            }}
                            className="w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 text-[16.5px]"
                        >
                            <LogoutIcon className="mr-3 text-current w-5 h-5" /> Odhlásiť sa
                        </button>
                    </nav>
                </aside>
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 z-20 md:hidden"
                        onClick={() => this.setState({ isSidebarOpen: false })}
                    ></div>
                )}
                <div className="flex flex-col flex-1 w-full min-w-0">
                    <header className="sticky top-0 bg-[#0f172a]/50 backdrop-blur-sm p-4 border-b border-white/5 md:hidden z-10 flex items-center">
                        <button onClick={() => this.setState({ isSidebarOpen: true })} className="text-slate-200">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <h1 className="text-xl font-bold ml-4" style={{ color: beigeTextColor }}>
                            Administrácia
                        </h1>
                    </header>
                    <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                        { }
                        {currentPage === "user-management" && (() => {
                            const filteredUsers = users.filter(user =>
                                user.username.toLowerCase().includes(this.state.userSearchQuery.toLowerCase()) ||
                                user.email.toLowerCase().includes(this.state.userSearchQuery.toLowerCase())
                            );


                            return (
                                <div className="space-y-8 animate-fade-in pb-12">
                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <h2 className="text-2xl md:text-3xl font-black text-blue-400 truncate">Správa používateľov</h2>
                                        </div>
                                    </div>

                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <SearchIcon className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Hľadať používateľa podľa mena alebo emailu..."
                                            value={this.state.userSearchQuery}
                                            onChange={(e) => this.setState({ userSearchQuery: e.target.value })}
                                            className="block w-full pl-12 pr-4 py-3 bg-[#0f172a]/50 border border-white/5 rounded-2xl text-[11px] md:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-inner"
                                        />
                                        {this.state.userSearchQuery && (
                                            <button
                                                onClick={() => this.setState({ userSearchQuery: "" })}
                                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300"
                                            >
                                                <TrashIcon className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Responsive Table Wrapper */}
                                    <div className="overflow-x-auto rounded-[1.25rem] border border-white/5 shadow-xl bg-[#0f172a]/20 backdrop-blur-md">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="bg-[#0f172a]/60 border-b border-white/5">
                                                    <th className="px-3 md:px-6 py-3.5 md:py-4 text-left text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[11px]">Používateľ</th>
                                                    <th className="px-2 md:px-6 py-3.5 md:py-4 text-center text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[11px]">Rola</th>
                                                    <th className="pl-2 pr-3 md:px-6 py-3.5 md:py-4 text-right text-slate-500 font-bold uppercase tracking-widest text-[8px] md:text-[11px]">Akcie</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/30">
                                                {filteredUsers.map((user) => (
                                                    <tr key={user.id} className="hover:bg-[#15203d]/20 transition-all group">
                                                        <td className="px-3 md:px-6 py-2 md:py-3">
                                                            <div className="flex items-center gap-2 md:gap-3">
                                                                <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-[#15203d]/60 flex items-center justify-center text-slate-300 font-black text-[10px] md:text-xs relative flex-shrink-0">
                                                                    {user.username.substring(0, 2).toUpperCase()}
                                                                    <div className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-800 ${user.role === 'admin' ? 'bg-blue-500' : 'bg-emerald-500'}`}></div>
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <div className="font-bold text-white text-[11px] md:text-sm group-hover:text-blue-400 transition-colors uppercase tracking-tight leading-none truncate">{user.username}</div>
                                                                    <div className="text-[9px] md:text-xs text-slate-500 truncate italic mt-0.5 md:mt-1 leading-tight">{user.email}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-2 md:px-6 py-2 md:py-3 text-center">
                                                            <select
                                                                value={user.role}
                                                                onChange={(e) => this.handleRoleChange(user.id, e.target.value)}
                                                                disabled={user.email === this.state.adminEmail && this.state.adminEmail !== ""}
                                                                className={`inline-block bg-[#0f172a]/40 border border-white/5 rounded-lg px-1.5 md:px-3 py-1 md:py-1.5 focus:ring-1 focus:ring-blue-500/40 transition-all text-[9px] md:text-xs font-black uppercase tracking-wider outline-none ${(user.email === this.state.adminEmail && this.state.adminEmail !== "") ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#0f172a]'} ${user.role === 'admin' ? 'text-blue-400' : 'text-emerald-400'}`}
                                                            >
                                                                {roles.map((role) => (
                                                                    <option key={role} value={role}>{role}</option>
                                                                ))}
                                                            </select>
                                                        </td>
                                                        <td className="pl-2 pr-3 md:px-6 py-2 md:py-3 text-right">
                                                            <button
                                                                onClick={() => this.handleDeleteUser(user.id)}
                                                                disabled={user.email === this.state.adminEmail && this.state.adminEmail !== ""}
                                                                className={`inline-flex items-center justify-center gap-1.5 p-1.5 md:px-3.5 md:py-2 rounded-lg transition-all duration-300 text-[10px] font-black uppercase tracking-widest border ${(user.email === this.state.adminEmail && this.state.adminEmail !== "") ? 'bg-slate-800/20 text-slate-500 border-white/5 cursor-not-allowed opacity-50' : 'bg-rose-500/5 hover:bg-rose-600 text-rose-500 hover:text-white border-rose-500/10 hover:border-rose-500 active:scale-95'}`}
                                                                title={(user.email === this.state.adminEmail && this.state.adminEmail !== "") ? "Hlavného administrátora nie je možné odstrániť" : "Odstrániť"}
                                                            >
                                                                <TrashIcon className="w-3.5 h-3.5" />
                                                                <span className="hidden md:inline">Odstrániť</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {filteredUsers.length === 0 && (
                                        <div className="py-12 text-center bg-[#0f172a]/20 backdrop-blur-sm border-t border-white/5">
                                            <div className="w-12 h-12 bg-[#0f172a]/50 rounded-full flex items-center justify-center mx-auto mb-3">
                                                <SearchIcon className="w-6 h-6 text-slate-600" />
                                            </div>
                                            <h3 className="text-sm font-bold text-slate-300">Žiadne výsledky</h3>
                                            <p className="text-slate-500 text-[11px]">Skúste zmeniť vyhľadávanie.</p>
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                        {currentPage === "student-grades" && (
                            <div className="space-y-8">
                                <div className="flex flex-col gap-6 mb-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div>
                                            <h2 className="text-2xl md:text-3xl font-black text-blue-400">Výsledky</h2>
                                        </div>
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
                                            <button
                                                onClick={this.handleExportGrades}
                                                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black py-2.5 px-5 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95 text-[11px] uppercase tracking-widest border border-emerald-500/20"
                                            >
                                                <DownloadIcon className="w-4 h-4 mr-2" /> Exportovať
                                            </button>
                                            <div className="bg-[#0f172a]/60 p-1.5 rounded-2xl flex border border-white/5 shadow-inner">
                                                <button
                                                    onClick={() => this.setState({ gradesViewMode: 'cards' })}
                                                    className={`flex-1 sm:flex-none px-5 py-1.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${gradesViewMode === 'cards' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                                                >
                                                    Karty
                                                </button>
                                                <button
                                                    onClick={() => this.setState({ gradesViewMode: 'table' })}
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
                                            value={this.state.studentSearchQuery}
                                            onChange={(e) => this.setState({ studentSearchQuery: e.target.value })}
                                            className="block w-full pl-12 pr-4 py-3 bg-[#0f172a]/40 border border-white/5 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all shadow-inner text-sm"
                                        />
                                        {this.state.studentSearchQuery && (
                                            <button
                                                onClick={() => this.setState({ studentSearchQuery: "" })}
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
                                                        s.username.toLowerCase().includes(this.state.studentSearchQuery.toLowerCase()) ||
                                                        s.email.toLowerCase().includes(this.state.studentSearchQuery.toLowerCase())
                                                    )
                                                    .map(student => {
                                                        // Filter tests for week 1-12 and 14 (skuska)
                                                        const filteredTests = studentGrades.tests.filter(t => (t.weekNumber >= 1 && t.weekNumber <= 12) || t.weekNumber === 14);

                                                        const scoresArray = filteredTests.map(t => student.scores[t.id] || 0);
                                                        const totalPoints = scoresArray.reduce((sum, score) => sum + score, 0);
                                                        const averageScore = scoresArray.length > 0 ? (totalPoints / scoresArray.length).toFixed(1) : 'N/A';
                                                        return (
                                                            <div key={student.id} className="bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-[2rem] shadow-xl p-5 sm:p-7 transition-all hover:border-blue-500/40 hover:bg-[#0f172a]/60 group">
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
                                                                            <p className="text-2xl font-black text-blue-400 leading-none">{averageScore}</p>
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
                                                                                            <CheatedIcon className="w-2.5 h-2.5 text-white" title="Študent списав" />
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
                                                                                            onClick={() => this.setState({ viewedResultId: student.resultIds[test.id] })}
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
                                            <div className="bg-[#0f172a]/30 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
                                                <div className="overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
                                                    <table className="min-w-full border-separate border-spacing-0">
                                                        <thead>
                                                            <tr className="bg-[#0f172a]/60">
                                                                <th className="px-4 py-4 text-left text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-[11px] sticky left-0 bg-[#0f172a] z-20 border-b border-white/5">Študent</th>
                                                                {studentGrades.tests.filter(t => (t.weekNumber >= 1 && t.weekNumber <= 12) || t.weekNumber === 14).map(test => (
                                                                    <th key={test.id} className="px-4 py-4 text-center text-slate-500 font-black uppercase tracking-widest text-[10px] md:text-[11px] border-b border-white/5 min-w-[80px]" title={test.title}>
                                                                        {test.title}
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody className="divide-y divide-slate-700/30">
                                                            {studentGrades.studentGrades
                                                                .filter(s =>
                                                                    s.username.toLowerCase().includes(this.state.studentSearchQuery.toLowerCase()) ||
                                                                    s.email.toLowerCase().includes(this.state.studentSearchQuery.toLowerCase())
                                                                )
                                                                .map(student => {
                                                                    const filteredTestsInTable = studentGrades.tests.filter(t => (t.weekNumber >= 1 && t.weekNumber <= 12) || t.weekNumber === 14);
                                                                    return (
                                                                        <tr key={student.id} className="hover:bg-[#15203d]/10 transition-colors group">
                                                                            <td className="px-4 py-3 sticky left-0 bg-[#0f172a]/90 backdrop-blur-md z-10 border-r border-white/5 shadow-[4px_0_10px_-4px_rgba(0,0,0,0.5)]">
                                                                                <div className="flex items-center gap-3 max-w-[120px] md:max-w-none">
                                                                                    <div className="w-8 h-8 rounded-lg bg-[#15203d]/50 flex items-center justify-center text-slate-300 font-black text-[10px] flex-shrink-0">
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
                                                                                                        onClick={() => this.setState({ viewedResultId: resultId })}
                                                                                                        className="flex items-center gap-1.5 px-2 py-1 bg-blue-500/10 hover:bg-blue-500 text-blue-400 hover:text-white rounded-lg transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 border border-blue-500/20"
                                                                                                        title="Zobraziť detail"
                                                                                                    >
                                                                                                        <EyeIcon className="w-4 h-4" />
                                                                                                        <span className="text-[10px] font-black uppercase tracking-tighter md:hidden">Detail</span>
                                                                                                    </button>
                                                                                                ) : (
                                                                                                    <div className="h-6" /> // Empty placeholder
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
                            </div>
                        )}
                        {currentPage === "progress-analysis" && (
                            <ProgressAnalysis summaryData={studentGrades} />
                        )}
                        {currentPage === "material-management" && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa materiálov</h2>
                                <div className="mb-10 p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h3 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
                                        <CalendarIcon className="mr-2 text-current" /> Nastavenia semestra
                                    </h3>
                                    <form onSubmit={this.handleDateSave} className="flex flex-col sm:flex-row gap-4 items-center">
                                        <label className="text-slate-300 font-medium">Začiatok semestra:</label>
                                        <input
                                            type="date"
                                            value={this.state.semesterStartDate}
                                            onChange={e => this.setState({ semesterStartDate: e.target.value })}
                                            className="px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                                        />
                                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-colors">Uložiť</button>
                                    </form>
                                </div>
                                <div className="mb-10 p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: beigeTextColor }}>
                                        <UploadIcon className="mr-2 text-blue-400" /> Pridať nový materiál
                                    </h3>
                                    <form onSubmit={this.handleAddMaterial} className="space-y-4" encType="multipart/form-data">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Názov"
                                                value={newMaterial.title}
                                                onChange={(e) =>
                                                    this.setState({ newMaterial: { ...newMaterial, title: e.target.value } })
                                                }
                                                className="w-full px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                                                required
                                            />
                                            <label className="flex items-center w-full">
                                                <select
                                                    value={newMaterial.weekNumber}
                                                    onChange={(e) =>
                                                        this.setState({ newMaterial: { ...newMaterial, weekNumber: parseInt(e.target.value) } })
                                                    }
                                                    className="w-full px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                                                    required
                                                >
                                                    {[...Array(12)].map((_, i) => (
                                                        <option key={i + 1} value={i + 1}>Týždeň {i + 1}</option>
                                                    ))}
                                                </select>
                                            </label>
                                        </div>
                                        <div>
                                            <select
                                                value={newMaterial.type}
                                                onChange={(e) =>
                                                    this.setState({ newMaterial: { ...newMaterial, type: e.target.value } })
                                                }
                                                className="w-full px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100"
                                            >
                                                <option value="lecture">Prednáška</option>
                                                <option value="seminar">Seminár</option>
                                            </select>
                                        </div>
                                        <div>
                                            <input
                                                type="file"
                                                name="file"
                                                accept=".pdf,.doc,.docx"
                                                onChange={(e) =>
                                                    this.setState({ newMaterial: { ...newMaterial, file: e.target.files[0] } })
                                                }
                                                className="w-full text-slate-100 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                required
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg"
                                        >
                                            <PlusCircleIcon className="w-5 h-5 mr-2" /> Pridať materiál
                                        </button>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                        <h4 className="text-lg font-semibold mb-4 text-blue-400">Prednášky</h4>
                                        <ul className="space-y-2">
                                            {filteredLectures.length === 0 ? (
                                                <li className="text-slate-400">Zatiaľ žiadne prednášky.</li>
                                            ) : (
                                                filteredLectures.map((material) => (
                                                    <li key={material.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg shadow-sm border border-white/5">
                                                        <span className="text-slate-100">
                                                            {material.title}
                                                            {![0, 13, 14].includes(material.weekNumber || 0) && (
                                                                <span className="text-sm text-slate-400 ml-2">(Týždeň: {material.weekNumber || 0})</span>
                                                            )}
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <a
                                                                href={material.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                            >
                                                                Stiahnuť
                                                            </a>
                                                            <button
                                                                onClick={() => this.handleDeleteMaterial(material.id)}
                                                                className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-1 px-2.5 rounded-lg flex items-center text-[10px] uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <TrashIcon className="w-3 h-3 mr-1" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                    <div className="p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                        <h4 className="text-lg font-semibold mb-4 text-blue-400">Cvičenia</h4>
                                        <ul className="space-y-2">
                                            {filteredSeminars.length === 0 ? (
                                                <li className="text-slate-400">Zatiaľ žiadne cvičenia.</li>
                                            ) : (
                                                filteredSeminars.map((material) => (
                                                    <li key={material.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg shadow-sm border border-white/5">
                                                        <span className="text-slate-100">
                                                            {material.title}
                                                            {![0, 13, 14].includes(material.weekNumber || 0) && (
                                                                <span className="text-sm text-slate-400 ml-2">(Týždeň: {material.weekNumber || 0})</span>
                                                            )}
                                                        </span>
                                                        <div className="flex items-center space-x-2">
                                                            <a
                                                                href={material.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                                            >
                                                                Stiahnuť
                                                            </a>
                                                            <button
                                                                onClick={() => this.handleDeleteMaterial(material.id)}
                                                                className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-1 px-2.5 rounded-lg flex items-center text-[10px] uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md"
                                                            >
                                                                <TrashIcon className="w-3 h-3 mr-1" />
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentPage === "calendar-management" && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa udalostí</h2>
                                <form onSubmit={this.handleAddEvent} className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) =>
                                            this.setState({ newEvent: { ...newEvent, date: e.target.value } })
                                        }
                                        className="px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Správa udalosti"
                                        value={newEvent.message}
                                        onChange={(e) =>
                                            this.setState({ newEvent: { ...newEvent, message: e.target.value } })
                                        }
                                        className="px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 flex-1"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={addingEvent}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                                        {addingEvent ? "Pridávanie..." : "Pridať udalosť"}
                                    </button>
                                </form>
                                <div className="bg-[#15203d]/50 p-4 rounded-2xl border border-white/5">
                                    <h3 className="font-bold text-blue-400 mb-2">Nadchádzajúce udalosti:</h3>
                                    <ul className="space-y-2">
                                        {calendarEvents.length === 0 ? (
                                            <li className="text-slate-400">Žiadne udalosti.</li>
                                        ) : (
                                            calendarEvents
                                                .filter(ev => ev.eventDate)
                                                .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                                                .map(ev => {
                                                    const dateParts = ev.eventDate.split("-");
                                                    const localDate =
                                                        dateParts.length === 3
                                                            ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                                                            : new Date(NaN);
                                                    return (
                                                        <li
                                                            key={ev.id}
                                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all duration-200 bg-blue-900/20 border-l-4 border-blue-500"
                                                        >
                                                            <div>
                                                                <span className="font-bold text-blue-400">
                                                                    {isNaN(localDate)
                                                                        ? "Neplatný dátum"
                                                                        : localDate.toLocaleDateString("sk-SK", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        })}
                                                                </span>
                                                                <span className="ml-2 text-sm text-gray-100">{ev.message}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => this.handleDeleteEvent(ev.id)}
                                                                disabled={deletingEventId === ev.id}
                                                                className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-1 px-2.5 rounded-lg flex items-center text-[10px] uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 mt-2 sm:mt-0"
                                                            >
                                                                <TrashIcon className="w-3 h-3 mr-1" />
                                                                {deletingEventId === ev.id ? "Odstraňovanie..." : "Odstrániť"}
                                                            </button>
                                                        </li>
                                                    );
                                                })
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                        {currentPage === "student-list-upload" && (
                            <div className="space-y-8 animate-fade-in pb-12">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-2xl md:text-3xl font-black text-blue-400 truncate">Registrácia študentov</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {/* PDF Upload Card */}
                                    <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/50 group-hover:bg-blue-500 transition-all duration-500"></div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2.5 bg-blue-500/10 rounded-2xl">
                                                <UploadIcon className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Nahrať zoznam (PDF)</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Automatické pridanie študentov zo súboru</p>
                                            </div>
                                        </div>

                                        <form onSubmit={this.handleStudentListUpload} className="space-y-6" encType="multipart/form-data">
                                            <div className="relative group/file">
                                                <input
                                                    type="file"
                                                    name="studentFile"
                                                    accept=".pdf"
                                                    onChange={this.handleStudentFileChange}
                                                    className="w-full text-slate-100 file:mr-4 file:py-2.5 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer bg-[#0f172a]/40 border border-white/5 p-2 rounded-2xl"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!this.state.selectedStudentFile || uploadingStudentList}
                                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                            >
                                                {uploadingStudentList ? (
                                                    <><RotateCcw className="w-4 h-4 mr-2 animate-spin" /> Nahráva sa...</>
                                                ) : (
                                                    <><UploadIcon className="w-4 h-4 mr-2" /> Nahrať a spracovať</>
                                                )}
                                            </button>
                                        </form>
                                    </div>

                                    {/* Manual Add Card */}
                                    <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden group">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-all duration-500"></div>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="p-2.5 bg-emerald-500/10 rounded-2xl">
                                                <PlusCircleIcon className="w-6 h-6 text-emerald-400" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-black text-white uppercase tracking-tight">Manuálne pridanie</h3>
                                                <p className="text-xs text-slate-500 mt-0.5">Pridať jedného študenta podľa e-mailu</p>
                                            </div>
                                        </div>

                                        <form onSubmit={this.handleAddAllowedStudent} className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="Zadajte e-mail študenta..."
                                                    value={newAllowedStudentEmail}
                                                    onChange={this.handleAllowedStudentEmailChange}
                                                    className="w-full pl-4 pr-4 py-3 bg-[#0f172a]/40 border border-white/5 rounded-2xl text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all text-sm"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={addingAllowedStudent}
                                                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-6 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
                                            >
                                                {addingAllowedStudent ? (
                                                    <><RotateCcw className="w-4 h-4 mr-2 animate-spin" /> Pridávanie...</>
                                                ) : (
                                                    <><PlusCircleIcon className="w-4 h-4 mr-2" /> Pridať do zoznamu</>
                                                )}
                                            </button>
                                        </form>
                                    </div>
                                </div>

                                <div className="bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-3xl shadow-2xl overflow-hidden">
                                    <div className="px-6 py-5 border-b border-white/5 bg-[#0f172a]/20 flex justify-between items-center">
                                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                                            Zoznam povolených študentov
                                        </h3>
                                        <div className="text-[10px] font-bold text-slate-500 bg-[#0f172a]/40 px-3 py-1 rounded-full border border-white/5">
                                            {allowedStudents.length} {allowedStudents.length === 1 ? 'záznam' : (allowedStudents.length >= 2 && allowedStudents.length <= 4 ? 'záznamy' : 'záznamov')}
                                        </div>
                                    </div>

                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="bg-[#0f172a]/60 border-b border-white/5">
                                                    <th className="px-6 py-4 text-left text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-[11px]">E-mail študenta</th>
                                                    <th className="px-6 py-4 text-right text-slate-500 font-bold uppercase tracking-widest text-[10px] md:text-[11px]">Akcie</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-slate-700/30">
                                                {allowedStudents.length === 0 ? (
                                                    <tr>
                                                        <td colSpan="2" className="px-6 py-12 text-center text-slate-500 uppercase tracking-widest font-bold text-xs">
                                                            Zatiaľ žiadni povolení študenti
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    allowedStudents.map((student) => (
                                                        <tr key={student.id} className="hover:bg-[#15203d]/20 transition-all group">
                                                            <td className="px-6 py-4">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-[#15203d]/60 flex items-center justify-center text-slate-300 font-black text-xs relative flex-shrink-0">
                                                                        {student.email.substring(0, 1).toUpperCase()}
                                                                        <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-800 bg-blue-500"></div>
                                                                    </div>
                                                                    <div className="font-bold text-white text-[13px] md:text-sm group-hover:text-blue-400 transition-colors tracking-tight leading-none truncate">{student.email}</div>
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    onClick={() => this.handleDeleteAllowedStudent(student.email)}
                                                                    disabled={deletingAllowedStudentEmail === student.email}
                                                                    className="inline-flex items-center justify-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-rose-500/5 hover:bg-rose-500 text-rose-500 hover:text-white rounded-2xl transition-all duration-300 text-[10px] font-black uppercase tracking-widest border border-rose-500/10 hover:border-rose-500 active:scale-95 disabled:opacity-50"
                                                                    title="Odstrániť"
                                                                >
                                                                    <TrashIcon className="w-3.5 h-3.5" />
                                                                    <span className="hidden md:inline">Odstrániť</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                        {currentPage === "test-management" && (
                            <div className="space-y-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa testov</h2>
                                { }
                                <div className="mb-10 p-3 sm:p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#F5F5DC" }}>
                                        <PlusCircleIcon className="mr-2 text-blue-400" /> Pridať nový test
                                    </h3>
                                    <div className="flex flex-wrap gap-3 mb-6">
                                        {!creatingTest && (
                                            <button
                                                onClick={this.openTestCreation}
                                                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center shadow-lg active:scale-95 transition-all"
                                            >
                                                <PlusCircleIcon className="w-5 h-5 mr-2" /> Pridať nový test
                                            </button>
                                        )}
                                    </div>
                                    {creatingTest && (
                                        <form onSubmit={this.saveTest} className="space-y-6 bg-[#0f172a] p-4 sm:p-6 rounded-2xl border border-white/5">
                                            <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
                                                <input
                                                    type="text"
                                                    placeholder="Názov testu"
                                                    value={newTest.title}
                                                    onChange={(e) => this.setState({ newTest: { ...newTest, title: e.target.value } })}
                                                    className="flex-grow w-full min-w-0 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold text-lg break-words"
                                                    required
                                                />
                                                <div className="flex items-center w-full md:w-auto">
                                                    <CustomSelect
                                                        value={newTest.weekNumber}
                                                        onChange={(val) => this.setState({ newTest: { ...newTest, weekNumber: parseInt(val) } })}
                                                        className="w-full md:w-48"
                                                        options={[
                                                            { value: 0, label: "Vstupný test" },
                                                            ...[...Array(12)].map((_, i) => ({ value: i + 1, label: `Týždeň ${i + 1}` })),
                                                            { value: 13, label: "Záverečný test" },
                                                            { value: 14, label: "Skúška" }
                                                        ]}
                                                    />
                                                </div>
                                                <label className="flex items-center w-full md:w-auto">
                                                    <input
                                                        type="number"
                                                        placeholder="Čas. limit (min)"
                                                        min="1"
                                                        value={newTest.timeLimit === null || newTest.timeLimit === undefined ? "" : newTest.timeLimit}
                                                        onChange={(e) => this.setState({ newTest: { ...newTest, timeLimit: e.target.value } })}
                                                        title="Limit v minútach (nechajte prázdne pre bez obmedzenia)"
                                                        className="w-full md:w-32 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                    />
                                                </label>
                                                {newTest.weekNumber === 14 && (
                                                    <label className="flex items-center space-x-2 w-full md:w-auto animate-fade-in">
                                                        <span className="text-slate-300 whitespace-nowrap">Dátum/čas skúšky:</span>
                                                        <input
                                                            type="datetime-local"
                                                            value={newTest.examDateTime || ""}
                                                            onChange={(e) => this.setState({ newTest: { ...newTest, examDateTime: e.target.value } })}
                                                            className="w-full md:w-64 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            {newTestQuestions.map((q, qIdx) => (
                                                <div key={qIdx} className="mb-6 bg-[#0f172a]/80 rounded-2xl border border-white/5 shadow-md flex flex-col overflow-hidden">
                                                    <div className="bg-[#15203d]/30 px-4 sm:px-5 py-3 border-b border-white/5 flex justify-between items-center text-sm font-semibold text-slate-300">
                                                        <span>Otázka {qIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => this.removeQuestion(qIdx)}
                                                            className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                                                            title="Odstrániť celú otázku"
                                                        >
                                                            <TrashIcon className="w-4 h-4" /> <span className="hidden sm:inline">Zmazať otázku</span>
                                                        </button>
                                                    </div>

                                                    <div className="p-3 sm:p-5 flex flex-col gap-4 sm:gap-5">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Otázka</label>
                                                            <input
                                                                type="text"
                                                                placeholder={`Otázka ${qIdx + 1}`}
                                                                value={q.question}
                                                                onChange={(e) => this.updateQuestion(qIdx, "question", e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border bg-[#0f172a]/50 border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 break-words"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Typ odpovede</label>
                                                            <div className="flex items-center gap-2 w-full">
                                                                <CustomSelect
                                                                    value={q.type}
                                                                    onChange={(val) => this.updateQuestion(qIdx, "type", val)}
                                                                    className="flex-1 w-full"
                                                                    options={[
                                                                        { value: "CLOSED", label: "Zatvorená (Výber z možností)" },
                                                                        { value: "OPEN", label: "Otvorená (Textová odpoveď)" }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pl-2 sm:pl-4 border-l-2 border-blue-500/50 pt-2">
                                                            <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                                                                {q.type === 'OPEN' ? 'Kľúčové slová a bodovanie' : 'Možnosti a bodovanie'}
                                                            </p>
                                                            {q.answers.map((ans, aIdx) => (
                                                                <div key={aIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={q.type === 'OPEN' ? `Kľúčové slovo ${aIdx + 1}` : `Možnosť ${aIdx + 1}`}
                                                                        value={ans.text}
                                                                        onChange={(e) => this.updateAnswer(qIdx, aIdx, "text", e.target.value)}
                                                                        className="px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 mr-2 flex-grow w-full min-w-0 break-words"
                                                                        required
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Body"
                                                                            value={ans.pointsWeight}
                                                                            onChange={(e) => this.updateAnswer(qIdx, aIdx, "pointsWeight", e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                                            className="w-20 min-w-0 px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 text-center break-words"
                                                                            required
                                                                        />
                                                                        <span className="text-slate-300 text-sm whitespace-nowrap whitespace-nowrap w-auto sm:w-12">bodov</span>
                                                                        {q.answers.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => this.removeAnswer(qIdx, aIdx)}
                                                                                className="ml-auto text-red-400 hover:text-red-300 font-bold text-sm"
                                                                            >
                                                                                Odstrániť
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button type="button" onClick={() => this.addAnswer(qIdx)} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-bold">
                                                                + Pridať {q.type === 'OPEN' ? 'kľúčové slovo' : 'odpoveď'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button type="button" onClick={this.addQuestion} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg font-bold">
                                                + Pridať ďalšiu otázku
                                            </button>
                                            <div className="flex flex-wrap gap-2 mt-6 border-t border-white/5 pt-6">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
                                                    Uložiť test
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => this.setState({ creatingTest: false })}
                                                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Zrušiť
                                                </button>
                                            </div>
                                        </form>
                                    )}
                                </div>
                                { }
                                {editingTestId && (
                                    <div className="mb-10 p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                        <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: "#F5F5DC" }}>
                                            Upraviť test
                                        </h3>
                                        <form onSubmit={this.saveEditTest} className="space-y-6 bg-[#0f172a] p-4 sm:p-6 rounded-2xl border border-white/5">
                                            <div className="flex flex-col md:flex-row gap-4 mb-4 flex-wrap">
                                                <input
                                                    type="text"
                                                    placeholder="Názov testu"
                                                    value={editingTest.title}
                                                    onChange={(e) => this.setState({ editingTest: { ...editingTest, title: e.target.value } })}
                                                    className="flex-grow w-full min-w-0 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold text-lg break-words"
                                                    required
                                                />
                                                <div className="flex items-center w-full md:w-auto">
                                                    <CustomSelect
                                                        value={editingTest.weekNumber}
                                                        onChange={(val) => this.setState({ editingTest: { ...editingTest, weekNumber: parseInt(val) } })}
                                                        className="w-full md:w-48"
                                                        options={[
                                                            { value: 0, label: "Vstupný test" },
                                                            ...[...Array(12)].map((_, i) => ({ value: i + 1, label: `Týždeň ${i + 1}` })),
                                                            { value: 13, label: "Záverečný test" },
                                                            { value: 14, label: "Skúška" }
                                                        ]}
                                                    />
                                                </div>
                                                <label className="flex items-center w-full md:w-auto">
                                                    <input
                                                        type="number"
                                                        placeholder="Čas. limit (min)"
                                                        min="1"
                                                        value={editingTest.timeLimit === null || editingTest.timeLimit === undefined ? "" : editingTest.timeLimit}
                                                        onChange={(e) => this.setState({ editingTest: { ...editingTest, timeLimit: e.target.value } })}
                                                        title="Limit v minútach (nechajte prázdne pre bez obmedzenia)"
                                                        className="w-full md:w-32 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                    />
                                                </label>
                                                {editingTest.weekNumber === 14 && (
                                                    <label className="flex items-center space-x-2 w-full md:w-auto animate-fade-in">
                                                        <span className="text-slate-300 whitespace-nowrap">Dátum/čas skúšky:</span>
                                                        <input
                                                            type="datetime-local"
                                                            value={editingTest.examDateTime || ""}
                                                            onChange={(e) => this.setState({ editingTest: { ...editingTest, examDateTime: e.target.value } })}
                                                            className="w-full md:w-64 px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 font-bold break-words"
                                                        />
                                                    </label>
                                                )}
                                            </div>
                                            {editingTestQuestions.map((q, qIdx) => (
                                                <div key={q.questionId || qIdx} className="mb-6 bg-[#0f172a]/80 rounded-2xl border border-white/5 shadow-md flex flex-col overflow-hidden">
                                                    <div className="bg-[#15203d]/30 px-5 py-3 border-b border-white/5 flex justify-between items-center text-sm font-semibold text-slate-300">
                                                        <span>Otázka {qIdx + 1}</span>
                                                        <button
                                                            type="button"
                                                            onClick={() => this.removeEditQuestion(qIdx)}
                                                            className="text-red-400 hover:text-red-300 transition-colors bg-red-400/10 p-1.5 rounded-md flex items-center gap-1.5 shadow-sm"
                                                            title="Odstrániť celú otázku"
                                                        >
                                                            <TrashIcon className="w-4 h-4" /> <span className="hidden sm:inline">Zmazať otázku</span>
                                                        </button>
                                                    </div>

                                                    <div className="p-3 sm:p-5 flex flex-col gap-4 sm:gap-5">
                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Otázka</label>
                                                            <input
                                                                type="text"
                                                                placeholder={`Otázka ${qIdx + 1}`}
                                                                value={q.question}
                                                                onChange={(e) => this.updateEditQuestion(qIdx, "question", e.target.value)}
                                                                className="w-full px-4 py-3 rounded-lg border bg-[#0f172a]/50 border-white/5 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-100 break-words"
                                                                required
                                                            />
                                                        </div>

                                                        <div className="flex flex-col gap-2">
                                                            <label className="text-xs uppercase font-bold text-slate-400 tracking-wider">Typ odpovede</label>
                                                            <div className="flex items-center gap-2 w-full">
                                                                <CustomSelect
                                                                    value={q.type}
                                                                    onChange={(val) => this.updateEditQuestion(qIdx, "type", val)}
                                                                    className="flex-1 w-full"
                                                                    options={[
                                                                        { value: "CLOSED", label: "Zatvorená (Výber z možností)" },
                                                                        { value: "OPEN", label: "Otvorená (Textová odpoveď)" }
                                                                    ]}
                                                                />
                                                            </div>
                                                        </div>

                                                        <div className="pl-2 sm:pl-4 border-l-2 border-blue-500/50 pt-2">
                                                            <p className="text-xs text-slate-400 uppercase font-bold mb-2">
                                                                {q.type === 'OPEN' ? 'Kľúčové slová a bodovanie' : 'Možnosti a bodovanie'}
                                                            </p>
                                                            {q.answers.map((ans, aIdx) => (
                                                                <div key={ans.answerId || aIdx} className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3">
                                                                    <input
                                                                        type="text"
                                                                        placeholder={q.type === 'OPEN' ? `Kľúčové slovo ${aIdx + 1}` : `Možnosť ${aIdx + 1}`}
                                                                        value={ans.text}
                                                                        onChange={(e) => this.updateEditAnswer(qIdx, aIdx, "text", e.target.value)}
                                                                        className="px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 mr-2 flex-grow w-full min-w-0 break-words"
                                                                        required
                                                                    />
                                                                    <div className="flex items-center gap-2">
                                                                        <input
                                                                            type="number"
                                                                            placeholder="Body"
                                                                            value={ans.pointsWeight}
                                                                            onChange={(e) => this.updateEditAnswer(qIdx, aIdx, "pointsWeight", e.target.value === '' ? '' : parseInt(e.target.value, 10))}
                                                                            className="w-20 min-w-0 px-2 py-1 rounded border bg-[#15203d] border-white/5 text-slate-100 text-center break-words"
                                                                            required
                                                                        />
                                                                        <span className="text-slate-300 text-sm whitespace-nowrap w-auto sm:w-12">bodov</span>
                                                                        {q.answers.length > 1 && (
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => this.removeEditAnswer(qIdx, aIdx)}
                                                                                className="ml-auto text-red-400 hover:text-red-300 font-bold text-sm"
                                                                            >
                                                                                Odstrániť
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                            <button type="button" onClick={() => this.addEditAnswer(qIdx)} className="text-blue-400 hover:text-blue-300 mt-2 text-sm font-bold">
                                                                + Pridať {q.type === 'OPEN' ? 'kľúčové slovo' : 'odpoveď'}
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="flex flex-wrap gap-2 mt-6 border-t border-white/5 pt-6">
                                                <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">
                                                    Uložiť zmeny
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={this.cancelEditTest}
                                                    className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2 rounded-lg font-bold"
                                                >
                                                    Zrušiť
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                )}
                                { }
                                <div className="p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h4 className="text-lg font-semibold mb-4 text-blue-400">Existujúce testy</h4>
                                    <ul className="space-y-2">
                                        {tests.length === 0 ? (
                                            <li className="text-slate-400">Zatiaľ žiadne testy.</li>
                                        ) : (
                                            tests.map((test) => (
                                                <li key={test.id} className="flex items-center justify-between p-3 bg-[#0f172a] rounded-lg shadow-sm border border-white/5">
                                                    <span className="text-slate-100">
                                                        {test.title}
                                                        {![0, 13, 14].includes(test.weekNumber || 0) && (
                                                            <span className="text-sm text-slate-400 ml-2">(Týždeň: {test.weekNumber || 0})</span>
                                                        )}
                                                    </span>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => this.openEditTest(test)}
                                                            className="bg-green-600 text-white font-semibold py-1 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200"
                                                        >
                                                            Upraviť
                                                        </button>
                                                        <button
                                                            onClick={() => this.handleDeleteTest(test.id)}
                                                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-lg flex items-center transition-all duration-200 shadow-sm hover:shadow-md"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </li>
                                            ))
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </main>
                </div >
                {viewedResultId && (
                    <TestResultDetailsModal
                        resultId={viewedResultId}
                        onClose={() => this.setState({ viewedResultId: null })}
                        onUpdate={() => this.fetchStudentGrades()}
                        beigeTextColor={beigeTextColor}
                    />
                )
                }
            </div>
        );
    }
}