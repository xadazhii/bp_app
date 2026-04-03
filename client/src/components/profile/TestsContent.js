import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import authHeader from "../../services/auth-header";
import AuthService from "../../services/auth.service";
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowLeftIcon, ArrowRightIcon, LockClosedIcon, SparklesIcon, PhoneIcon, EnvelopeIcon, OfficeIcon, TrashIcon, NoteIcon, PencilIcon, ClockIcon } from "../common/ProfileIcons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const TestsContentPage = ({ beigeTextColor, onUpdate, setModal, onTestingStatusChange, userStats, onViewResult }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [completedTests, setCompletedTests] = useState(new Set());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [cheated, setCheated] = useState(false);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [confirmStartTest, setConfirmStartTest] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);

    const submitTest = React.useCallback(async (reason = "manual") => {
        const isAutoSubmit = reason === "timeout" || reason === "cheating";
        if (!isAutoSubmit) {
            const allAnswered = activeTest.questions.every(q => {
                const val = answers[q.questionId];
                if (q.type === 'OPEN') {
                    return val && typeof val === 'string' && val.trim().length > 0;
                }
                if (q.type === 'MULTIPLE' || q.type === 'CLOSED') {
                    return Array.isArray(val) && val.length > 0;
                }
                return val !== undefined && val !== null;
            });

            if (!allAnswered) {
                setModal({
                    show: true,
                    title: 'Nedokončený test',
                    message: 'Prosím, zodpovedajte všetky otázky v teste pred jeho odovzdaním.',
                    type: 'info',
                    onConfirm: () => setModal(prev => ({ ...prev, show: false }))
                });
                return;
            }
        }

        setSubmitting(true);
        setError(null);
        try {
            const currentUser = AuthService.getCurrentUser();

            const submissions = activeTest.questions.map(q => {
                const val = answers[q.questionId];
                if (q.type === 'OPEN') {
                    return { questionId: q.questionId, textResponse: val || "" };
                } else if (q.type === 'MULTIPLE' || q.type === 'CLOSED') {
                    return { questionId: q.questionId, answerIds: val || [] };
                } else {
                    return { questionId: q.questionId, answerId: val };
                }
            });

            const res = await fetch(`${API_URL}/api/tests/results`, {
                method: "POST",
                headers: { ...authHeader(), "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentId: currentUser.id,
                    testId: activeTest.id,
                    cheated: cheated || reason === "cheating",
                    submissions: submissions
                })
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.error(`Submission failed with status ${res.status}:`, errorText);
                throw new Error(errorText || `Chyba pri odovzdávaní (Status: ${res.status}). Skontrolujte pripojenie.`);
            }

            const data = await res.json();
            
            const totalPoints = activeTest.totalPossiblePoints || activeTest.questions.reduce((sum, q) => {
                if (q.type === 'MULTIPLE') {
                    const qPossible = q.answers.reduce((acc, a) => acc + Math.max(0, a.pointsWeight || 0), 0);
                    return sum + Math.max(q.points || 0, qPossible);
                } else {
                    const maxForQ = Math.max(q.points || 0, ...q.answers.map(a => a.pointsWeight || 0), 0);
                    return sum + maxForQ;
                }
            }, 0);

            setResult({ score: data.score, total: totalPoints, cheated: cheated || reason === "cheating" });
            setActiveTest(null);
            if (onUpdate) onUpdate();
        } catch (err) {
            console.error("Submit test error details:", err);
            setError(err.message || "Nepodarilo sa odovzdať výsledok testu.");
        } finally {
            setSubmitting(false);
        }
    }, [activeTest, answers, cheated, onUpdate, setModal]);

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [testsRes, completedRes] = await Promise.all([
                    fetch(`${API_URL}/api/tests`, { headers: authHeader() }),
                    fetch(`${API_URL}/api/tests/completed`, { headers: authHeader() })
                ]);
                if (!testsRes.ok) throw new Error("Nepodarilo sa načítať testy.");
                if (!completedRes.ok) throw new Error("Nepodarilo sa načítať dokončené testy.");
                const testsData = await testsRes.json();
                const completedData = await completedRes.json();

                const sortedTests = testsData.sort((a, b) => {
                    const titleA = a.title.toLowerCase();
                    const titleB = b.title.toLowerCase();
                    if (titleA.includes("vstupny")) return 1;
                    if (titleB.includes("vstupny")) return -1;
                    return b.id - a.id;
                });
                setTests(sortedTests);
                setCompletedTests(new Set(completedData));
            } catch (err) {
                setError("Nepodarilo sa načítať dáta. Skúste to prosím neskôr.");
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    useEffect(() => {
        if (activeTest) {
            const handleSecurityEvent = () => {
                if (document.hidden || !document.hasFocus()) {
                    setCheated(true);
                }
            };

            const handleFullscreenChange = () => {
                if (!document.fullscreenElement && activeTest) {
                    setCheated(true);
                }
            };

            const handleBeforeUnload = (e) => {
                e.preventDefault();
                e.returnValue = '';
            };

            const handleContextMenu = (e) => {
                e.preventDefault();
            };

            window.addEventListener('blur', handleSecurityEvent);
            window.addEventListener('visibilitychange', handleSecurityEvent);
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            window.addEventListener('contextmenu', handleContextMenu);
            window.addEventListener('beforeunload', handleBeforeUnload);

            if (onTestingStatusChange) onTestingStatusChange(true);

            if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(() => { });
            }

            return () => {
                window.removeEventListener('blur', handleSecurityEvent);
                window.removeEventListener('visibilitychange', handleSecurityEvent);
                window.removeEventListener('beforeunload', handleBeforeUnload);
                document.removeEventListener('fullscreenchange', handleFullscreenChange);
                window.removeEventListener('contextmenu', handleContextMenu);

                if (document.fullscreenElement) {
                    document.exitFullscreen().catch(() => { });
                }
                if (onTestingStatusChange) onTestingStatusChange(false);
            };
        }
    }, [activeTest, onTestingStatusChange]);

    useEffect(() => {
        if (cheated && activeTest && !submitting && !result) {
            submitTest("cheating");
        }
    }, [cheated, activeTest, submitting, result, submitTest]);

    useEffect(() => {
        if (!activeTest || submitting || result) return;
        if (timeLeft === null) return;
        if (timeLeft <= 0) {
            submitTest("timeout");
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
    }, [activeTest, submitting, result, timeLeft, submitTest]);

    const enterFullscreen = () => {
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().then(() => {
                setShowFullscreenWarning(false);
            });
        }
    };

    const startTest = async (testId) => {
        setLoading(true);
        setError(null);
        setCurrentQuestionIndex(0);
        try {
            const res = await fetch(`${API_URL}/api/tests/${testId}`, { headers: authHeader() });
            if (!res.ok) throw new Error("Nepodarilo sa načítať test.");
            const data = await res.json();
            setActiveTest(data);
            if (data.timeLimit) {
                setTimeLeft(data.timeLimit * 60);
            } else {
                setTimeLeft(null);
            }
            setAnswers({});
            setCheated(false);
        } catch (err) {
            setError("Nepodarilo sa načítať test. Skúste to prosím neskôr.");
        } finally {
            setLoading(false);
        }
    };

    const handleAnswer = (questionId, value, isMultiple = false) => {
        if (isMultiple) {
            setAnswers(prev => {
                const current = prev[questionId] || [];
                if (current.includes(value)) {
                    return { ...prev, [questionId]: current.filter(id => id !== value) };
                } else {
                    return { ...prev, [questionId]: [...current, value] };
                }
            });
        } else {
            setAnswers(prev => ({ ...prev, [questionId]: value }));
        }
    };

    const handleReturnToList = () => {
        setResult(null);
        fetch(`${API_URL}/api/tests/completed`, { headers: authHeader() })
            .then(res => res.json())
            .then(data => setCompletedTests(new Set(data)))
            .catch(() => console.error("Failed to refresh completed tests."));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < activeTest.questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    if (confirmStartTest) {
        return (
            <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-[#0a0f18]/90 backdrop-blur-xl animate-fade-in">
                <div className="bg-[#121826] border border-white/10 rounded-[1.5rem] p-6 max-w-sm w-full shadow-2xl relative text-center">

                    <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-amber-500/20">
                        <ExclamationTriangleIcon className="w-6 h-6 text-amber-500" />
                    </div>

                    <h2 className="text-xl font-bold text-white mb-3 tracking-tight">Pripravený na test?</h2>

                    <p className="text-slate-400 text-[13px] leading-relaxed mb-8 px-4">
                        Počas testu <span className="text-amber-400 font-bold">neopúšťajte okno</span>. Akékoľvek opustenie bude vyhodnotené ako podvádzanie a test sa <span className="text-red-400 font-bold">automaticky ukončí</span>.
                    </p>

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                startTest(confirmStartTest.id);
                                setConfirmStartTest(null);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98] flex items-center justify-center gap-2 group"
                        >
                            Spustiť test
                            <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                        <button
                            onClick={() => setConfirmStartTest(null)}
                            className="w-full text-slate-500 hover:text-slate-300 font-semibold py-2 transition-all text-xs"
                        >
                            Zrušiť
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (loading && !activeTest) return (
        <div className="flex flex-col items-center justify-center p-10 text-slate-400">
            <svg className="animate-spin h-8 w-8 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-lg">Načítavam testy...</p>
        </div>
    );

    if (error) return (
        <div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-lg flex items-center">
            <ExclamationTriangleIcon className="h-6 w-6 mr-4" />
            <p>{error}</p>
        </div>
    );

    if (activeTest) {
        const currentQuestion = activeTest.questions[currentQuestionIndex];
        const progressPercentage = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;

        return (
            <div className="fixed inset-0 z-[9999] bg-slate-950 flex items-center justify-center p-4 sm:p-8 overflow-y-auto">
                <div className="w-full max-w-[1300px] flex flex-col space-y-6">
                    {}
                    <div className="flex items-center justify-between border-b border-white/5 pb-4">
                        <div className="flex items-center gap-4">
                            <div className="space-y-0.5">
                                <h2 className="text-xl font-bold text-white tracking-tight">
                                    {activeTest.title}
                                </h2>
                                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                    Otázka {currentQuestionIndex + 1} z {activeTest.questions.length}
                                </p>
                            </div>
                        </div>
                        {timeLeft !== null && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono font-bold ${timeLeft < 60 ? 'bg-red-500/10 text-red-500' : 'bg-slate-800 text-slate-400'}`}>
                                <ClockIcon className="w-3 h-3" />
                                {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        )}
                    </div>

                    {}
                    <div className="h-0.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    {}
                    <div key={currentQuestionIndex} className="bg-[#0f172a]/40 border border-white/5 rounded-2xl p-8 shadow-sm animate-fade-in">
                        <div className="mb-8">
                            <span className="text-[10px] font-bold text-blue-500/60 uppercase tracking-widest mb-2 block">
                                {currentQuestion.points} {currentQuestion.points === 1 ? 'bod' : (currentQuestion.points >= 2 && currentQuestion.points <= 4 ? 'body' : 'bodov')}
                            </span>
                            <h3 className="text-xl md:text-2xl font-semibold text-slate-100 leading-snug">
                                {currentQuestion.question}
                            </h3>
                        </div>

                        <div className="space-y-3">
                            {currentQuestion.type === 'OPEN' ? (
                                <textarea
                                    value={answers[currentQuestion.questionId] || ""}
                                    onChange={(e) => handleAnswer(currentQuestion.questionId, e.target.value)}
                                    className="w-full p-6 rounded-xl bg-slate-950/30 border border-white/5 text-slate-300 focus:border-blue-500/30 transition-all outline-none text-base resize-none placeholder:text-slate-800 block min-h-[180px]"
                                    placeholder="Vaša odpoveď..."
                                />
                            ) : (
                                <div className="grid grid-cols-1 gap-2.5">
                                    {currentQuestion.answers.map((ans) => {
                                        const isSelected = (currentQuestion.type === 'MULTIPLE' || currentQuestion.type === 'CLOSED')
                                            ? (answers[currentQuestion.questionId] || []).includes(ans.answerId)
                                            : answers[currentQuestion.questionId] === ans.answerId;

                                        return (
                                            <label
                                                key={ans.answerId}
                                                className={`group/opt flex items-center p-4 rounded-xl cursor-pointer transition-all border ${isSelected
                                                    ? 'bg-blue-600/5 border-blue-500/40'
                                                    : 'bg-transparent border-white/5 hover:border-white/10'
                                                    }`}
                                            >
                                                <input
                                                    type={(currentQuestion.type === 'MULTIPLE' || currentQuestion.type === 'CLOSED') ? "checkbox" : "radio"}
                                                    name={`q${currentQuestion.questionId}`}
                                                    checked={isSelected}
                                                    onChange={() => handleAnswer(currentQuestion.questionId, ans.answerId, (currentQuestion.type === 'MULTIPLE' || currentQuestion.type === 'CLOSED'))}
                                                    className="hidden"
                                                />
                                                <div className={`w-4 h-4 ${(currentQuestion.type === 'MULTIPLE' || currentQuestion.type === 'CLOSED') ? 'rounded-md' : 'rounded-full'} border flex items-center justify-center mr-4 transition-all ${isSelected
                                                    ? 'bg-blue-500 border-blue-500'
                                                    : 'border-slate-700'
                                                    }`}>
                                                    {isSelected && (
                                                        <div className={(currentQuestion.type === 'MULTIPLE' || currentQuestion.type === 'CLOSED') ? "w-2 h-2 bg-white rounded-sm" : "w-1 h-1 bg-white rounded-full"}></div>
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium transition-colors ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                                    {ans.text}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {}
                    <div className="flex justify-between items-center pt-2">
                        <button
                            onClick={handlePrevQuestion}
                            disabled={currentQuestionIndex === 0}
                            className={`flex items-center gap-2 text-slate-500 font-bold uppercase text-[10px] tracking-widest hover:text-slate-300 transition-all ${currentQuestionIndex === 0 ? 'opacity-0' : 'opacity-100'}`}
                        >
                            <ArrowLeftIcon className="h-3 w-3" />
                            Späť
                        </button>

                        <div className="flex gap-3">
                            {currentQuestionIndex < activeTest.questions.length - 1 ? (
                                <button
                                    onClick={handleNextQuestion}
                                    className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                                >
                                    Ďalej
                                </button>
                            ) : (
                                <button
                                    onClick={() => submitTest()}
                                    disabled={submitting}
                                    className="px-8 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-sm"
                                >
                                    {submitting ? 'Odosielam...' : 'Dokončiť'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {}
                {showFullscreenWarning && !submitting && (
                    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
                        <div className="max-w-sm w-full bg-slate-900 border border-white/5 rounded-2xl p-8 text-center space-y-6">
                            <ExclamationTriangleIcon className="w-8 h-8 text-red-500 mx-auto" />
                            <div className="space-y-2">
                                <h3 className="text-lg font-bold text-white uppercase tracking-tight">Detegované porušenie</h3>
                                <p className="text-slate-500 text-sm">Opustili ste režim testovania. Prosím, vráťte sa.</p>
                            </div>
                            <button
                                onClick={enterFullscreen}
                                className="w-full py-3 bg-blue-600 rounded-xl text-white font-bold text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
                            >
                                Pokračovať
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (result) {
        return (
            <div className="animate-fade-in w-full py-12">
                <div className="w-full bg-slate-900 border border-white/5 rounded-3xl p-10 flex flex-col items-center text-center shadow-lg">
                    {}
                    <div className="mb-8">
                        {result.cheated ? (
                            <div className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-md">
                                <span className="text-red-500 text-[10px] font-bold uppercase tracking-widest">Neplatný test</span>
                            </div>
                        ) : (
                            <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-md">
                                <span className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">Test vyhodnotený</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {result.cheated ? 'Test bol zrušený' : 'Test úspešne dokončený'}
                    </h2>
                    <p className="text-slate-500 text-sm mb-10 leading-relaxed">
                        {result.cheated ? 'Bolo detegované neoprávnené správanie (pokus o spísanie). Váš test bol zrušený.' : 'Vaše odpovede boli úspešne spracované.'}
                    </p>

                    {}
                    <div className="flex flex-col items-center gap-1 mb-12">
                        <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Váš výsledok</span>
                        <div className="flex items-baseline gap-2">
                            <span className={`text-6xl font-bold ${result.cheated ? 'text-red-500' : 'text-blue-500'}`}>
                                {result.score}
                            </span>
                            <span className="text-2xl font-bold text-slate-800">/ {result.total}</span>
                        </div>
                    </div>

                    <button
                        onClick={handleReturnToList}
                        className="max-w-xs w-full py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all text-xs uppercase tracking-widest"
                    >
                        Vrátiť sa na zoznam
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="animate-fade-in w-full">
            {}
            <div className="mb-6">
                <h2 className="text-3xl font-extrabold tracking-tight text-white">Dostupné testy</h2>
                {tests.length === 0 && (
                    <p className="text-slate-400 italic mt-3">Zatiaľ nemáte priradené žiadne testy.</p>
                )}
            </div>

            {tests.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                    {tests.map((test) => {
                        const result = userStats?.testStats?.detailedResults?.find(r => r.testId === test.id);
                        const isCompleted = !!result || completedTests.has(test.id);
                        return (
                            <div
                                key={test.id}
                                onClick={() => {
                                    if (isCompleted && result?.testResultId) {
                                        onViewResult(result.testResultId);
                                    }
                                }}
                                className={`bg-[#0f172a] border border-white/5 rounded-2xl px-5 py-4 flex flex-col transition-all duration-300 hover:border-slate-600 hover:bg-[#15203d] shadow-md ${isCompleted && result?.testResultId ? 'cursor-pointer' : ''}`}
                            >
                                {}
                                <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center mb-2">
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                {}
                                <h3 className={`text-lg font-bold mb-3 tracking-wide line-clamp-2 min-h-[1.5rem] break-words ${result?.cheated ? 'text-red-400' : 'text-slate-100'}`}>
                                    {test.title}
                                </h3>

                                {}
                                <div className="w-full h-px bg-[#0f172a]/80 mb-3"></div>

                                {}
                                <div className="flex items-center gap-4 mb-4 text-slate-500 text-[12px] font-semibold flex-grow">
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
                                        </svg>
                                        <span>{test.questionCount} {test.questionCount === 1 ? 'otázka' : test.questionCount >= 2 && test.questionCount <= 4 ? 'otázky' : 'otázok'}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                        <span>{test.totalPoints} {test.totalPoints === 1 ? 'bod' : 'bodov'}</span>
                                    </div>
                                </div>

                                {}
                                <div className="w-full mt-auto">
                                    {isCompleted ? (
                                        <button disabled className={`w-full py-2 rounded-2xl border border-white/5 font-semibold flex items-center justify-center gap-1.5 text-sm transition-colors ${result?.cheated ? 'text-red-500 border-red-500/30' : 'text-emerald-500 border-white/5 bg-[#0f172a] hover:bg-[#0f172a]'}`}>
                                            <CheckCircleIcon className="w-[16px] h-[16px]" />
                                            {result?.cheated ? 'Podvádzanie' : 'Dokončený'}
                                        </button>
                                    ) : !test.available ? (
                                        <button disabled className="w-full py-2 rounded-2xl border border-slate-800 text-slate-500 font-semibold flex items-center justify-center gap-1.5 text-sm bg-transparent">
                                            <LockClosedIcon className="w-[16px] h-[16px]" />
                                            Neprístupný
                                        </button>
                                    ) : (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setConfirmStartTest(test); }}
                                            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white font-bold py-2 rounded-2xl text-sm transition-all focus:ring-2 focus:ring-blue-500/50 outline-none"
                                        >
                                            Spustiť test
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

const ContactsContent = ({ beigeTextColor, currentUser }) => {
    const [message, setMessage] = useState({
        name: currentUser?.username || "",
        email: currentUser?.email || "",
        text: ""
    });
    const [showAlert, setShowAlert] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMessage((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        emailjs.send(
            "service_mks4h7q",
            "template_kq6h9vk",
            {
                from_name: message.name,
                reply_to: message.email,
                message: message.text,
            },
            "66HOGV_BzxfI4lLwh"
        )
            .then(() => {
                setShowAlert(true);
                setTimeout(() => setShowAlert(false), 5000);
                setMessage((prev) => ({ ...prev, text: "" }));
            })
            .catch((err) => {
                console.error("EmailJS error:", err);
            });
    };

    return (
        <div className="space-y-10">
            {showAlert && (
                <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4
              bg-[#0f172a]/90 backdrop-blur-md text-slate-100 rounded-2xl shadow-xl
              border border-white/5 animate-slide-in">
                    <svg xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-400"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                            d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="font-medium text-base">Správa bola úspešne odoslaná</p>
                </div>
            )}

            <h2 className="text-3xl font-bold mb-6" style={{ color: beigeTextColor }}>Kontakty</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-[#0f172a]/50 p-6 rounded-2xl shadow-xl border border-white/5 flex flex-col items-center justify-center text-center">
                    <div className="mb-6">
                        <h4 className="text-2xl font-bold mb-1" style={{ color: beigeTextColor }}>Učiteľ</h4>
                        <p className="text-lg text-slate-300">doc. Ing. Miloš Orgoň, PhD.</p>
                    </div>

                    <div className="space-y-5 text-left w-full">
                        <div className="flex items-center">
                            <PhoneIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mr-4" />
                            <div>
                                <h5 className="text-md font-medium text-slate-200">Telefón</h5>
                                <p className="text-md text-slate-400">+421 2 60291 414</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <EnvelopeIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mr-4" />
                            <div>
                                <h5 className="text-md font-medium text-slate-200">E-mail</h5>
                                <p className="text-md text-slate-400">kristina.adazhii58@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center">
                            <OfficeIcon className="w-6 h-6 text-blue-400 flex-shrink-0 mr-4" />
                            <div>
                                <h5 className="text-md font-medium text-slate-200">Kabinet</h5>
                                <p className="text-md text-slate-400">D113</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-[#0f172a]/50 p-6 rounded-2xl shadow-xl border border-white/5">
                    <h4 className="text-2xl font-bold text-beige mb-4 text-center" style={{ color: beigeTextColor }}>Odoslať správu</h4>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Vaše meno</label>
                            <input
                                type="text"
                                name="name"
                                value={message.name}
                                onChange={handleChange}
                                required
                                className="block w-full rounded-lg border-white/10 bg-[#15203d] text-slate-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Zadajte vaše meno"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Váš e-mail</label>
                            <input
                                type="email"
                                name="email"
                                value={message.email}
                                readOnly
                                className="block w-full rounded-lg border-white/5 bg-[#15203d]/50 text-slate-400 cursor-not-allowed"
                                placeholder="Zadajte váš e-mail"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Správa</label>
                            <textarea
                                name="text"
                                value={message.text}
                                onChange={handleChange}
                                rows="4"
                                required
                                className="block w-full rounded-lg border-white/10 bg-[#15203d] text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Napíšte vašu správu"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-3 px-4 rounded-lg text-base font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                        >
                            Odoslať
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

const TestResultDetailsModal = ({ resultId, onClose, beigeTextColor }) => {
    const [resultData, setResultData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const res = await fetch(`${API_URL}/api/tests/results/${resultId}`, {
                    headers: authHeader()
                });
                if (!res.ok) throw new Error("Nepodarilo sa načítať detaily testu.");
                const data = await res.json();
                setResultData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [resultId]);

    if (loading) return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#121826] p-10 rounded-3xl border border-white/5 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Načítavam výsledky...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="bg-[#121826] p-8 rounded-3xl border border-red-500/20 text-center max-w-sm w-full">
                <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">Chyba</h3>
                <p className="text-slate-400 mb-6">{error}</p>
                <button onClick={onClose} className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-2xl transition-all">
                    Zavrieť
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
            <div className="bg-[#121826] border border-white/10 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
                {}
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{resultData.testTitle}</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-slate-400">
                                Skóre: <span className="text-blue-400 font-bold">
                                    {resultData.score} / {resultData.details.reduce((sum, q) => {
                                        if (q.type === 'MULTIPLE') {
                                            const qPossible = q.allAnswers.reduce((acc, a) => acc + Math.max(0, a.pointsWeight || 0), 0);
                                            return sum + Math.max(q.points || 0, qPossible);
                                        } else {
                                            const maxForQ = Math.max(q.points || 0, ...q.allAnswers.map(a => a.pointsWeight || 0), 0);
                                            return sum + maxForQ;
                                        }
                                    }, 0)} b.
                                </span>
                            </span>
                            {resultData.cheated && <span className="px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded border border-red-500/20">Podvádzanie</span>}
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-2xl transition-colors text-slate-400 hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    {resultData.details.map((q, idx) => (
                        <div key={q.questionId} className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4">
                                    <span className="shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-sm">
                                        {idx + 1}.
                                    </span>
                                    <h3 className="text-slate-100 font-semibold leading-relaxed">
                                        {q.questionText}
                                    </h3>
                                </div>
                                {(() => {
                                    const points = q.earnedPoints ?? 0;
                                    const isNeviem = q.allAnswers?.some(ans => {
                                        const isSelected = (q.selectedAnswerIds || []).includes(ans.id) || (q.selectedAnswerId === ans.id);
                                        return isSelected && ans.text?.toLowerCase().includes("neviem");
                                    }) && (q.selectedAnswerIds?.length === 1 || (q.selectedAnswerId && !q.selectedAnswerIds));

                                    let colorClass = points > 0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : (points < 0 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : (isNeviem ? 'bg-slate-500/10 text-slate-400 border border-white/10' : 'bg-red-500/10 text-red-400 border border-red-500/20'));
                                    let label = points > 0 ? `Správne (${points} b.)` : (points < 0 ? `Nesprávne (${points} b.)` : (isNeviem ? `Neviem (0 b.)` : `Nesprávne (0 b.)`));

                                    return <span className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${colorClass}`}>{label}</span>;
                                })()}
                            </div>

                            { (q.type === 'CLOSED' || q.type === 'MULTIPLE' || (q.allAnswers && q.allAnswers.length > 0 && q.type !== 'OPEN')) ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-12">
                                    {q.allAnswers.map(ans => {
                                        const isSelected = (q.selectedAnswerIds || []).includes(ans.id) || (q.selectedAnswerId === ans.id);
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
                                            bgClass = "bg-emerald-500/[0.02]";
                                            icon = <CheckCircleIcon className="w-4 h-4 text-emerald-500/20" />;
                                        }

                                        return (
                                            <div key={ans.id} className={`p-3.5 rounded-2xl border ${borderClass} ${bgClass} flex items-center justify-between gap-3 transition-all relative overflow-hidden group`}>
                                                <span className={`text-sm ${isSelected ? 'text-white' : (isCorrectAns ? 'text-emerald-400/70' : 'text-slate-400')}`}>{ans.text}</span>
                                                {icon}
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="pl-12 space-y-3">
                                    <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                        <p className="text-xs text-slate-500 uppercase font-bold tracking-widest mb-2">Vaša odpoveď:</p>
                                        <p className={`text-sm ${q.isCorrect ? 'text-emerald-400' : 'text-red-400'} font-medium`}>
                                            {q.studentTextResponse || "Žiadna odpoveď"}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                                        <p className="text-xs text-emerald-500/60 uppercase font-bold tracking-widest mb-2">Správne varianty:</p>
                                        <div className="flex flex-wrap gap-2">
                                            {q.allAnswers.filter(a => a.pointsWeight > 0).map(a => (
                                                <span key={a.id} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-mono">
                                                    {a.text}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {}
                            {q.feedback && (
                                <div className="pl-12 pt-4">
                                    <div className="p-4 bg-blue-500/5 rounded-2xl border border-blue-500/10 flex items-start gap-3 animate-fade-in text-blue-100">
                                        <SparklesIcon className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mb-1">Komentár učiteľa:</p>
                                            <p className="text-sm italic leading-relaxed">"{q.feedback}"</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {}
                <div className="p-6 border-t border-white/5 shrink-0 bg-white/[0.02]">
                    <button
                        onClick={onClose}
                        className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-900/40 active:scale-[0.98]"
                    >
                        Rozumiem
                    </button>
                </div>
            </div>
        </div>
    );
};

export { TestsContentPage, ContactsContent, TestResultDetailsModal };
