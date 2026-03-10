import React, { useState, useEffect } from "react";
import axios from "axios";
import emailjs from "@emailjs/browser";
import authHeader from "../../services/auth-header";
import AuthService from "../../services/auth.service";
import { CheckCircleIcon, ExclamationTriangleIcon, ArrowLeftIcon, ArrowRightIcon, LockClosedIcon, SparklesIcon, PhoneIcon, EnvelopeIcon, OfficeIcon, TrashIcon, ListBulletIcon, NoteIcon, PencilIcon, ClockIcon } from "../common/ProfileIcons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";



const TestsContentPage = ({ beigeTextColor, onUpdate, setModal, onTestingStatusChange, userStats, onViewResult }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [completedTests, setCompletedTests] = useState(new Set());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [cheated, setCheated] = useState(false);
    const [showFullscreenWarning, setShowFullscreenWarning] = useState(false);
    const [confirmStartTest, setConfirmStartTest] = useState(null);
    const [timeLeft, setTimeLeft] = useState(null);

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

                // Sort tests: Vstupny test always at the bottom, others descending by ID
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

    // security effect

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

            // Attach listeners IMMEDIATELY but with a brief window. 
            // Visibility changing catches tab switching instantly.
            window.addEventListener('blur', handleSecurityEvent);
            window.addEventListener('visibilitychange', handleSecurityEvent);
            document.addEventListener('fullscreenchange', handleFullscreenChange);
            window.addEventListener('contextmenu', handleContextMenu);
            window.addEventListener('beforeunload', handleBeforeUnload);

            if (onTestingStatusChange) onTestingStatusChange(true);

            // Request fullscreen ONLY ONCE when test starts
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cheated, activeTest, submitting, result]);

    useEffect(() => {
        if (!activeTest || submitting || result) return;

        // If no time limit, just return
        if (timeLeft === null) return;

        if (timeLeft <= 0) {
            submitTest("timeout");
            return;
        }

        const timerId = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timerId);
                    return 0; // will trigger the effect again to submit
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTest, submitting, result, timeLeft]);

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

    const handleAnswer = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
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

    const submitTest = async (reason = "manual") => {
        const isAutoSubmit = reason === "timeout" || reason === "cheating";
        if (!isAutoSubmit) {
            const allAnswered = activeTest.questions.every(q => answers[q.questionId] !== undefined);
            if (!allAnswered) {
                setModal({
                    show: true,
                    title: 'Nedokončený test',
                    message: 'Prosím, zodpovedajte všetky otázky pred odovzdaním testu.',
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

            const totalPoints = activeTest.questions.reduce((sum, q) => {
                const maxForQ = Math.max(...q.answers.map(a => a.pointsWeight || 0), 0);
                return sum + maxForQ;
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
                    {/* Minimalist Header */}
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

                    {/* Simple Progress Bar */}
                    <div className="h-0.5 w-full bg-slate-800/50 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 transition-all duration-500 ease-out"
                            style={{ width: `${progressPercentage}%` }}
                        ></div>
                    </div>

                    {/* Compact Question Area */}
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
                                    {currentQuestion.answers.map((ans) => (
                                        <label
                                            key={ans.answerId}
                                            className={`group/opt flex items-center p-4 rounded-xl cursor-pointer transition-all border ${answers[currentQuestion.questionId] === ans.answerId
                                                ? 'bg-blue-600/5 border-blue-500/40'
                                                : 'bg-transparent border-white/5 hover:border-white/10'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`q${currentQuestion.questionId}`}
                                                checked={answers[currentQuestion.questionId] === ans.answerId}
                                                onChange={() => handleAnswer(currentQuestion.questionId, ans.answerId)}
                                                className="hidden"
                                            />
                                            <div className={`w-4 h-4 rounded-full border flex items-center justify-center mr-4 transition-all ${answers[currentQuestion.questionId] === ans.answerId
                                                ? 'bg-blue-500 border-blue-500'
                                                : 'border-slate-700'
                                                }`}>
                                                {answers[currentQuestion.questionId] === ans.answerId && (
                                                    <div className="w-1 h-1 bg-white rounded-full"></div>
                                                )}
                                            </div>
                                            <span className={`text-sm font-medium transition-colors ${answers[currentQuestion.questionId] === ans.answerId ? 'text-white' : 'text-slate-400'}`}>
                                                {ans.text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Minimal Navigation */}
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

                {/* Compact Warning Overlay */}
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
                    {/* Status Badge */}
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

                    {/* Simple Score */}
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
            {/* Header */}
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
                                {/* Top Icon */}
                                <div className="w-7 h-7 rounded-lg bg-blue-600/10 flex items-center justify-center mb-2">
                                    <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                {/* Title */}
                                <h3 className={`text-lg font-bold mb-3 tracking-wide line-clamp-2 min-h-[1.5rem] break-words ${result?.cheated ? 'text-red-400' : 'text-slate-100'}`}>
                                    {test.title}
                                </h3>

                                {/* Divider */}
                                <div className="w-full h-px bg-[#0f172a]/80 mb-3"></div>

                                {/* Metadata */}
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

                                {/* Bottom Action */}
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


const NotesContent = ({ beigeTextColor, setModal }) => {
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("Všeobecné");
    const [selectedNote, setSelectedNote] = useState(null);
    const [editingNoteId, setEditingNoteId] = useState(null);
    const [notesActiveTab, setNotesActiveTab] = useState('write');

    // Block-based state for new note
    const [blocks, setBlocks] = useState([{ id: Date.now(), type: 'text', value: '' }]);

    const categories = ["Všeobecné"];
    for (let i = 1; i <= 12; i++) categories.push(`Prednáška ${i}`);
    for (let i = 1; i <= 12; i++) categories.push(`Cvičenie ${i}`);


    const fetchNotes = () => {
        axios.get(`${API_URL}/api/notes`, { headers: authHeader() })
            .then(res => {
                setNotes(res.data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    const addBlock = (type) => {
        setBlocks([...blocks, { id: Date.now(), type, value: '', preview: null, file: null }]);
    };

    const removeBlock = (id) => {
        if (blocks.length === 1 && blocks[0].type === 'text') {
            setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
            return;
        }
        setBlocks(blocks.filter(b => b.id !== id));
    };

    const updateBlock = (id, field, value) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
    };

    const toggleSelectBlock = (id) => {
        setBlocks(prev => prev.map(b => b.id === id ? { ...b, selected: !b.selected } : b));
    };

    const removeSelectedBlocks = () => {
        const count = blocks.filter(b => b.selected).length;
        if (count === 0) return;
        const remaining = blocks.filter(b => !b.selected);
        setBlocks(remaining.length > 0 ? remaining : [{ id: Date.now(), type: 'text', value: '' }]);
    };

    const handleBlockFileChange = (id, e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setBlocks(prev => prev.map(b =>
                b.id === id ? { ...b, file: file, preview: URL.createObjectURL(file) } : b
            ));
        }
    };

    const handleSubmitNote = (e) => {
        if (e) e.preventDefault();

        // Filter empty text blocks
        const activeBlocks = blocks.filter(b => (b.type === 'text' && b.value.trim()) || (b.type === 'image' && (b.file || b.value)));

        if (activeBlocks.length === 0) {
            setModal({
                show: true,
                title: 'Prázdna poznámka',
                message: 'Poznámka nesmie byť prázdna. Prosím, napíšte niečo alebo pridajte obrázok.',
                type: 'info',
                onConfirm: () => setModal(prev => ({ ...prev, show: false }))
            });
            return;
        }

        setSubmitting(true);

        const formData = new FormData();
        const files = [];
        const structure = activeBlocks.map(b => {
            if (b.type === 'text') return { type: 'text', value: b.value };
            if (b.type === 'image') {
                if (b.file) {
                    const fileIndex = files.length;
                    files.push(b.file);
                    return { type: 'image', value: `[[FILE_${fileIndex}]]` };
                }
                return { type: 'image', value: b.value };
            }
            return null;
        }).filter(b => b);

        console.log("SENDING NOTE:", { structure, filesCount: files.length, isUpdate: !!editingNoteId });
        formData.append("content", JSON.stringify(structure));
        formData.append("category", selectedCategory);
        files.forEach(file => formData.append("files", file));

        const request = editingNoteId
            ? axios.put(`${API_URL}/api/notes/${editingNoteId}`, formData, { headers: authHeader() })
            : axios.post(`${API_URL}/api/notes`, formData, { headers: authHeader() });

        request
            .then(() => {
                setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
                setEditingNoteId(null);
                setSubmitting(false);
                fetchNotes();
                setNotesActiveTab('browse');
                setModal({
                    show: true,
                    title: 'Úspešne uložené',
                    message: 'Poznámka bola úspešne uložená!',
                    type: 'info',
                    onConfirm: () => setModal(prev => ({ ...prev, show: false }))
                });
            })
            .catch((error) => {
                console.error("Error saving note:", error);
                setSubmitting(false);
                setModal({
                    show: true,
                    title: 'Chyba',
                    message: 'Chyba pri ukladaní poznámky. Skontrolujte pripojenie k serveru.',
                    type: 'danger',
                    onConfirm: () => setModal(prev => ({ ...prev, show: false }))
                });
            });
    };

    const startEditNote = (e, note) => {
        e.stopPropagation();
        try {
            const parsed = JSON.parse(note.content);
            setBlocks(parsed.map(b => ({
                id: Date.now() + Math.random(),
                type: b.type,
                value: b.value,
                preview: b.type === 'image' ? (b.value.startsWith('http') ? b.value : `${API_URL}/uploads/${b.value}`) : null,
                file: null
            })));
            setSelectedCategory(note.category || "Všeobecné");
            setEditingNoteId(note.id);
            setNotesActiveTab('write'); // Switch to editor
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            console.error("Parse error:", err);
        }
    };

    const renderNotePreview = (content) => {
        try {
            const blocks = JSON.parse(content);
            if (Array.isArray(blocks)) {
                let text = "";
                let firstImage = null;
                blocks.forEach(b => {
                    if (b.type === 'text') text += b.value + " ";
                    if (b.type === 'image' && !firstImage) firstImage = b.value;
                });
                return { text: text.trim(), image: firstImage };
            }
        } catch (e) { }
        return { text: content, image: null };
    };

    const renderFullContent = (content) => {
        try {
            const blocks = JSON.parse(content);
            if (Array.isArray(blocks)) {
                return (
                    <div className="space-y-4">
                        {blocks.map((b, i) => (
                            <div key={i}>
                                {b.type === 'text' ? (
                                    <div className="whitespace-pre-wrap">{b.value}</div>
                                ) : (
                                    <div className="my-4 rounded-2xl overflow-hidden border border-white/5 bg-black/20 text-center relative group/img">
                                        <img
                                            src={b.value.startsWith('http') ? b.value : `${API_URL}/uploads/${b.value}`}
                                            alt=""
                                            className="max-w-full h-auto inline-block transition-transform group-hover/img:scale-[1.02]"
                                            onError={(e) => {
                                                console.error("Failed to load image:", b.value);
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                        {b.value.includes('[[FILE_') && (
                                            <div className="p-4 text-red-400 text-sm">
                                                Chyba: Obrázok sa nepodarilo uložiť na server.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                );
            }
        } catch (e) { }
        return <div className="whitespace-pre-wrap">{content}</div>;
    };

    const generatePDFContent = (note) => {
        let contentHtml = "";
        try {
            const blocks = JSON.parse(note.content);
            if (Array.isArray(blocks)) {
                blocks.forEach(b => {
                    if (b.type === 'text') {
                        contentHtml += `<div class="text-block">${b.value}</div>`;
                    } else {
                        const imgUrl = b.value.startsWith('http') ? b.value : `${API_URL}/uploads/${b.value}`;
                        contentHtml += `<div class="image-container"><img src="${imgUrl}" /></div>`;
                    }
                });
            } else {
                contentHtml = `<div class="text-block">${note.content}</div>`;
            }
        } catch (e) {
            contentHtml = `<div class="text-block">${note.content}</div>`;
        }
        return contentHtml;
    };

    const handleDownloadPDF = (note) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert("Please allow popups for PDF download");

        printWindow.document.write(`
            <html>
                <head>
                    <title>${note.category || 'Poznámka'}</title>
                    <style>
                        body { font-family: 'Arial', sans-serif; padding: 40px; color: #333; max-width: 800px; margin: 0 auto; }
                        h1 { color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 15px; margin-bottom: 10px; }
                        .meta { color: #7f8c8d; font-size: 0.9em; margin-bottom: 30px; border-bottom: 1px solid #eee; padding-bottom: 10px; }
                        .text-block { line-height: 1.6; white-space: pre-wrap; font-size: 1.1em; margin-bottom: 20px; }
                        .image-container { margin: 25px 0; max-width: 100%; text-align: center; }
                        img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                        @media print {
                            body { -webkit-print-color-adjust: exact; }
                            .image-container { break-inside: avoid; }
                        }
                    </style>
                </head>
                <body>
                    <h1>${note.category || 'Všeobecné'}</h1>
                    <div class="meta">Vytvorené: ${new Date(note.createdAt).toLocaleDateString('sk-SK')}</div>
                    ${generatePDFContent(note)}
                    <script>
                        window.onload = function() {
                           setTimeout(() => {
                                window.print();
                                window.close();
                           }, 1000);
                        }
                    </script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };


    const handleDeleteNote = (id) => {
        setModal({
            show: true,
            title: 'Odstrániť poznámku?',
            message: 'Naozaj chcete vymazať túto poznámku? Táto akcia je nevratná.',
            type: 'danger',
            onConfirm: () => {
                axios.delete(`${API_URL}/api/notes/${id}`, { headers: authHeader() })
                    .then(() => {
                        fetchNotes();
                        setSelectedNote(null);
                        setModal(prev => ({ ...prev, show: false }));
                    });
            }
        });
    };

    if (loading) return (
        <div className="flex justify-center p-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in relative">
            {selectedNote && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNote(null)}>
                    <div className="bg-[#0f172a] border border-white/5 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-[#15203d] p-2 rounded-full transition-all"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        <div className="p-8">
                            <div className="flex items-center gap-3 mb-6">
                                <span className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md ${selectedNote.category && selectedNote.category.startsWith("Prednáška") ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                                    selectedNote.category && selectedNote.category.startsWith("Cvičenie") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                        "bg-slate-700 text-slate-300 border border-slate-600"
                                    }`}>
                                    {selectedNote.category || "Všeobecné"}
                                </span>
                                <span className="text-slate-500 text-sm">
                                    {new Date(selectedNote.createdAt).toLocaleDateString('sk-SK')}
                                </span>
                            </div>

                            <div className="text-slate-200 text-lg mb-8">
                                {renderFullContent(selectedNote.content)}
                            </div>

                            <div className="flex justify-between items-center pt-6 border-t border-white/5">
                                <button
                                    onClick={() => handleDownloadPDF(selectedNote)}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium text-sm"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                                    </svg>
                                    Stiahnuť PDF
                                </button>

                                <button
                                    onClick={() => handleDeleteNote(selectedNote.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors font-medium text-sm"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                    Vymazať poznámku
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <header className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold flex items-center" style={{ color: beigeTextColor }}>
                        Moje poznámky
                    </h2>
                </div>

                {/* Tab Switcher - Segmented Control Style */}
                <div className="flex flex-wrap sm:flex-nowrap gap-1 bg-slate-900/50 p-1 rounded-xl border border-white/5 self-start sm:self-center w-full sm:w-auto mt-2 sm:mt-0">
                    <button
                        onClick={() => setNotesActiveTab('write')}
                        className={`flex-1 flex justify-center sm:justify-start items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${notesActiveTab === 'write'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Nová poznámka
                    </button>
                    <button
                        onClick={() => setNotesActiveTab('browse')}
                        className={`flex-1 flex justify-center sm:justify-start items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${notesActiveTab === 'browse'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        <ListBulletIcon className="w-4 h-4 shrink-0" />
                        Moje archívy
                    </button>
                </div>
            </header>

            {notesActiveTab === 'write' ? (

                <form onSubmit={handleSubmitNote} className="w-full space-y-4 animate-fade-in group/form">
                    {/* Word-style Toolbar */}
                    <div className={`sticky top-[72px] sm:top-4 z-30 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-2 justify-between p-2 sm:p-3 bg-[#0f172a]/95 backdrop-blur-md border ${editingNoteId ? 'border-blue-500 shadow-blue-500/20' : 'border-white/5'} rounded-2xl shadow-2xl transition-all`}>
                        <div className="flex items-center gap-1">
                            <h3 className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider border-r border-white/5 mr-2">
                                {editingNoteId ? 'Editor' : 'Nový dokument'}
                            </h3>
                            <button type="button" onClick={() => addBlock('text')} className="p-2 hover:bg-[#15203d] text-slate-300 hover:text-blue-400 rounded-lg transition-all" title="Vložiť text">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </button>
                            <button type="button" onClick={() => addBlock('image')} className="p-2 hover:bg-[#15203d] text-slate-300 hover:text-blue-400 rounded-lg transition-all" title="Vložiť obrázok">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 justify-between sm:justify-start mt-2 sm:mt-0">
                            <button
                                type="button"
                                onClick={removeSelectedBlocks}
                                disabled={!blocks.some(b => b.selected)}
                                className={`p-2 rounded-lg transition-all flex items-center gap-2 flex-shrink-0 ${blocks.some(b => b.selected)
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 shadow-lg shadow-red-500/20'
                                    : 'bg-slate-700/30 text-slate-600 border border-white/5 cursor-not-allowed opacity-50'
                                    }`}
                                title={blocks.some(b => b.selected) ? "Vymazať vybraté" : "Najprv vyberte položky kliknutím na ne"}
                            >
                                <TrashIcon className="w-4 h-4" />
                                {blocks.some(b => b.selected) && <span className="text-xs font-bold animate-pulse">{blocks.filter(b => b.selected).length}</span>}
                            </button>

                            <div className="hidden sm:block h-6 w-[1px] bg-slate-700 mx-1"></div>
                            <div className="relative flex-grow sm:flex-grow-0">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-slate-900/50 border border-white/5 rounded-lg py-1.5 px-3 pr-8 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-[#0f172a]">{cat}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                    <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>

                            <div className="hidden sm:block h-6 w-[1px] bg-slate-700 mx-1"></div>

                            {editingNoteId && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingNoteId(null);
                                        setBlocks([{ id: Date.now(), type: 'text', value: '' }]);
                                    }}
                                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                                >
                                    Zrušiť
                                </button>
                            )}
                            <button
                                type="submit"
                                onClick={handleSubmitNote}
                                disabled={submitting}
                                className={`px-4 py-1.5 ${editingNoteId ? 'bg-blue-600' : 'bg-emerald-600'} hover:opacity-90 disabled:opacity-50 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 transition-all flex items-center gap-2`}
                            >
                                {submitting ? (
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    editingNoteId ? <NoteIcon className="w-3 h-3" /> : <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                )}
                                {editingNoteId ? 'Aktualizovať' : 'Uložiť súbor'}
                            </button>
                        </div>
                    </div>

                    {/* The "Paper" Container */}
                    <div className="bg-[#0f172a]/40 backdrop-blur-sm rounded-2xl shadow-2xl min-h-[700px] border border-white/5 flex flex-col transition-all">
                        {/* Paper Header */}
                        <div className="h-12 border-b border-white/5 bg-slate-900/60 flex items-center px-8">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>

                        <div className="p-6 md:p-12 lg:p-20 space-y-2 flex-grow">
                            {blocks.map((block, idx) => (
                                <div key={block.id} className="relative group/block animate-slide-in">
                                    {block.type === 'text' ? (
                                        <textarea
                                            className="w-full bg-transparent border-none p-0 text-slate-200 text-lg leading-relaxed focus:outline-none placeholder:text-slate-600 resize-none overflow-hidden"
                                            placeholder={idx === 0 ? "Začnite písať vašu poznámku..." : "Pokračujte v texte..."}
                                            rows={Math.max(1, block.value.split('\n').length)}
                                            value={block.value}
                                            onChange={(e) => updateBlock(block.id, 'value', e.target.value)}
                                            onInput={(e) => {
                                                e.target.style.height = 'auto';
                                                e.target.style.height = e.target.scrollHeight + 'px';
                                            }}
                                            style={{ height: 'auto' }}
                                        />
                                    ) : (
                                        <div className="my-6">
                                            {block.preview ? (
                                                <div
                                                    className={`relative inline-block group/imgbox max-w-full cursor-pointer transition-all ${block.selected ? 'scale-[0.98]' : ''}`}
                                                    onClick={() => toggleSelectBlock(block.id)}
                                                >
                                                    <div className={`rounded-2xl overflow-hidden shadow-lg border-2 transition-all ${block.selected ? 'border-blue-500 shadow-blue-500/20' : 'border-white/5'}`}>
                                                        <img src={block.preview} alt="Upload" className={`max-w-full max-h-[500px] object-contain transition-all ${block.selected ? 'opacity-80' : 'group-hover/imgbox:scale-[1.01]'}`} />

                                                        {/* Subtle Selection Indicator */}
                                                        <div className={`absolute top-4 left-4 w-6 h-6 rounded-full border-2 transition-all flex items-center justify-center ${block.selected ? 'bg-blue-600 border-blue-600 scale-110' : 'bg-slate-900/40 border-white/20 opacity-0 group-hover/imgbox:opacity-100'}`}>
                                                            {block.selected && (
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Single delete button - also subtle */}
                                                    <button
                                                        type="button"
                                                        onClick={(e) => { e.stopPropagation(); removeBlock(block.id); }}
                                                        className="absolute -top-2 -right-2 bg-red-600/90 hover:bg-red-600 shadow-lg text-white p-1.5 rounded-full opacity-0 group-hover/imgbox:opacity-100 transition-all z-30 hover:scale-110"
                                                        title="Vymazať"
                                                    >
                                                        <TrashIcon className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ) : (
                                                <div className="relative">
                                                    <label className="w-full py-16 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/30 hover:border-blue-500/50 transition-all group/up">
                                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handleBlockFileChange(block.id, e)} />
                                                        <div className="w-16 h-16 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4 group-hover/up:scale-110 transition-transform">
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                                            </svg>
                                                        </div>
                                                        <span className="text-slate-300 font-bold text-lg">Kliknite sem pre výber obrázka</span>
                                                        <span className="text-slate-500 text-sm mt-2">Maximálna veľkosť súboru: 1GB</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Remove block handle - placed INSIDE to avoid clipping */}
                                    {blocks.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeBlock(block.id)}
                                            className="absolute right-0 top-0 opacity-0 group-hover/block:opacity-100 transition-all p-2 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 rounded-lg z-20"
                                            title="Odstrániť túto časť"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="h-10 bg-slate-900/50 mt-auto border-t border-white/5 flex items-center px-8 justify-end text-[10px] text-slate-500 font-medium uppercase tracking-widest">
                            <span>Strana 1 z 1</span>
                        </div>
                    </div>
                </form>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {notes.length > 0 ? notes.map(note => {
                        const preview = renderNotePreview(note.content);
                        return (
                            <div
                                key={note.id}
                                onClick={() => setSelectedNote(note)}
                                className="group bg-[#0f172a]/40 backdrop-blur-sm border border-white/5 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full active:scale-[0.98]"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${note.category && note.category.startsWith("Prednáška") ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                                        note.category && note.category.startsWith("Cvičenie") ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30" :
                                            "bg-slate-700 text-slate-300 border border-slate-600"
                                        }`}>
                                        {note.category || "Všeobecné"}
                                    </span>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                                        </svg>
                                    </div>
                                </div>
                                <div className="min-h-[100px] text-slate-200 leading-relaxed flex-grow relative overflow-hidden max-h-[200px]">
                                    {preview.image && (
                                        <div className="mb-4 rounded-2xl overflow-hidden shadow-md h-32 w-full relative group/cardimg">
                                            <img
                                                src={preview.image.startsWith('http') ? preview.image : `${API_URL}/uploads/${preview.image}`}
                                                alt=""
                                                className="w-full h-full object-cover opacity-80 transition-transform group-hover/cardimg:scale-110"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent"></div>
                                        </div>
                                    )}
                                    <div className="line-clamp-4 relative text-sm">
                                        {preview.text.substring(0, 120)}{preview.text.length > 120 ? '...' : ''}
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-slate-800/50 to-transparent"></div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
                                    <span className="text-slate-500 text-[10px] italic">
                                        {new Date(note.createdAt).toLocaleDateString('sk-SK')}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={(e) => startEditNote(e, note)}
                                            className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-all"
                                            title="Upraviť"
                                        >
                                            <PencilIcon className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDeleteNote(note.id); }}
                                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                                            title="Vymazať"
                                        >
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                        <span className="text-blue-400 text-[10px] font-bold ml-1 uppercase tracking-wider">Detail</span>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="col-span-full py-20 text-center bg-[#0f172a]/20 rounded-2xl border border-dashed border-white/5">
                            <NoteIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-500 font-medium">Zatiaľ nemáte žiadne poznámky.</p>
                            <button
                                onClick={() => setNotesActiveTab('write')}
                                className="mt-4 text-blue-400 hover:text-blue-300 font-bold transition-colors"
                            >
                                Vytvoriť prvú poznámku
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div >
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
                {/* Modal Header */}
                <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0 bg-white/[0.02]">
                    <div>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{resultData.testTitle}</h2>
                        <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium text-slate-400">
                                Skóre: <span className="text-blue-400 font-bold">{resultData.score} b.</span>
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

                {/* Modal Body */}
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
                                <span className={`shrink-0 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${q.isCorrect ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {q.isCorrect ? `Správne (${q.earnedPoints ?? q.points ?? 0} b.)` : `Nesprávne (0 b.)`}
                                </span>
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
                                            <div key={ans.id} className={`p-3.5 rounded-2xl border ${borderClass} ${bgClass} flex items-center justify-between gap-3 transition-all`}>
                                                <span className={`text-sm ${isSelected ? 'text-white' : 'text-slate-400'}`}>{ans.text}</span>
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

                            {/* Teacher's Feedback */}
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

                {/* Modal Footer */}
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



export { TestsContentPage, ContactsContent, NotesContent, TestResultDetailsModal };