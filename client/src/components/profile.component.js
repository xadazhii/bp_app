import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import UserService from '../services/user.service';
import Simulation from "./simulation.component";
import EventBus from "../common/EventBus";
import ProfileOverview from "./profile/ProfileOverview";
import LearningContent from "./profile/LearningContent";
import AchievementsContent from "./profile/AchievementsContent";
import SettingsContent from "./profile/SettingsContent";
import CalendarContent from "./profile/CalendarContent";
import { TestsContentPage, TestResultDetailsModal, ContactsContent, NotesContent } from "./profile/TestsContent";

import {
    UserIcon, ChartBarIcon, BookOpenIcon, CalendarIcon, AwardIcon,
    NoteIcon, TrashIcon, ExclamationTriangleIcon,
    CogIcon, EnvelopeIcon, LogoutIcon, TerminalIcon
} from "./common/ProfileIcons";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const fetchClassmates = async () => {
    try {
        const res = await fetch(`${API_URL}/api/allowed-students`, {
            method: "GET",
            headers: authHeader(),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Nepodarilo sa načítať zoznam spolužiakov.");
        }
        const data = await res.json();
        return data.map(student => ({
            id: student.id,
            name: student.email.split('@')[0],
            email: student.email
        }));
    } catch (error) {
        console.error("Chyba pri načítaní spolužiakov:", error);
        throw error;
    }
};

const Profile = () => {
    const [modal, setModal] = useState({ show: false, title: '', message: '', onConfirm: null, type: 'danger' });
    const [redirect, setRedirect] = useState(null);
    const [userReady, setUserReady] = useState(false);
    const [currentPage, setCurrentPage] = useState('overview');
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState({
        username: "",
        email: "",
        roles: [],
        id: null,
        points: 0,
    });

    const [userStats, setUserStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);
    const [profileImage, setProfileImage] = useState(() => {
        return localStorage.getItem(`profileImage_${AuthService.getCurrentUser()?.id}`) || null;
    });

    const [showClassmatesModal, setShowClassmatesModal] = useState(false);
    const [classmates, setClassmates] = useState([]);
    const [classmatesLoading, setClassmatesLoading] = useState(false);
    const [classmatesError, setClassmatesError] = useState(null);
    const [testResultViewId, setTestResultViewId] = useState(null);
    const [isTesting, setIsTesting] = useState(false);

    const loadStats = (userId) => {
        setStatsLoading(true);
        UserService.getUserStats(userId)
            .then(response => {
                setUserStats(response.data);
            })
            .catch(error => {
                console.error("Nepodarilo sa načítať štatistiky používateľa:", error);
            })
            .finally(() => {
                setStatsLoading(false);
            });
    };

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            setRedirect("/home");
        } else {
            setCurrentUser(user);
            setUserReady(true);
            loadStats(user.id);
        }
    }, []);

    const handleViewClassmates = async () => {
        setClassmatesLoading(true);
        setClassmatesError(null);
        try {
            const data = await fetchClassmates();
            setClassmates(data);
            setShowClassmatesModal(true);
        } catch (error) {
            console.error("Nepodarilo sa načítať spolužiakov:", error);
            setClassmatesError("Nepodarilo sa načítať zoznam spolužiakov.");
        } finally {
            setClassmatesLoading(false);
        }
    };

    const beigeTextColor = '#F5F5DC';

    if (redirect) {
        return <Navigate to={redirect} />;
    }

    if (!userReady) {
        return <div className="bg-slate-900 min-h-screen flex items-center justify-center text-white">Načítava sa profil...</div>;
    }

    const handleImageChange = (newImage) => {
        setProfileImage(newImage);
        if (currentUser?.id) {
            localStorage.setItem(`profileImage_${currentUser.id}`, newImage);
        }
    };

    const renderContent = () => {
        switch (currentPage) {
            case 'overview':
                return <ProfileOverview
                    currentUser={currentUser}
                    stats={userStats}
                    statsLoading={statsLoading}
                    beigeTextColor={beigeTextColor}
                    onViewClassmates={handleViewClassmates}
                    classmatesLoading={classmatesLoading}
                    profileImage={profileImage}
                    onImageChange={handleImageChange}
                />;
            case 'learning':
                return <LearningContent beigeTextColor={beigeTextColor} onUpdate={() => loadStats(currentUser.id)} setModal={setModal} />;
            case 'simulation':
                return <Simulation beigeTextColor={beigeTextColor} />;
            case 'tests':
                return <TestsContentPage
                    beigeTextColor={beigeTextColor}
                    onUpdate={() => loadStats(currentUser.id)}
                    setModal={setModal}
                    onTestingStatusChange={setIsTesting}
                    userStats={userStats}
                    onViewResult={(id) => setTestResultViewId(id)}
                />;
            case 'calendar':
                return <CalendarContent beigeTextColor={beigeTextColor} />;
            case 'achievements':
                return <AchievementsContent stats={userStats} statsLoading={statsLoading} beigeTextColor={beigeTextColor} />;
            case 'notes':
                return <NotesContent beigeTextColor={beigeTextColor} setModal={setModal} />;
            case 'settings':
                return <SettingsContent
                    currentUser={currentUser}
                    beigeTextColor={beigeTextColor}
                    profileImage={profileImage}
                    onImageChange={handleImageChange}
                />;
            case 'contacts':
                return <ContactsContent beigeTextColor={beigeTextColor} currentUser={currentUser} />;
            default:
                return <ProfileOverview
                    currentUser={currentUser}
                    stats={userStats}
                    statsLoading={statsLoading}
                    beigeTextColor={beigeTextColor}
                    onViewClassmates={handleViewClassmates}
                    classmatesLoading={classmatesLoading}
                />;
        }
    };

    return (
        <div className="relative flex min-h-screen bg-slate-900 font-sans text-slate-200">
            <aside
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-[#0f172a]/80 flex flex-col p-4 border-r border-white/5 shadow-xl
                       transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 
                       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} ${isTesting ? 'hidden md:hidden' : ''}`}
            >
                <div className="text-2xl font-bold mb-8 text-center" style={{ color: beigeTextColor }}>
                    Portál študenta
                </div>
                <nav className="flex-grow space-y-0.5 mt-2 overflow-y-auto pr-2">
                    <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Môj profil</div>
                    <button
                        onClick={() => { setCurrentPage('overview'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'overview' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <UserIcon className="mr-3 text-current w-5 h-5" /> Prehľad profilu
                    </button>

                    <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Vzdelávanie</div>
                    <button
                        onClick={() => { setCurrentPage('learning'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'learning' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <BookOpenIcon className="mr-3 text-current w-5 h-5" /> Učenie
                    </button>
                    <button
                        onClick={() => { setCurrentPage('simulation'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'simulation' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <TerminalIcon className="mr-3 text-current w-5 h-5" /> Simulácia
                    </button>
                    <button
                        onClick={() => { setCurrentPage('tests'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'tests' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <ChartBarIcon className="mr-3 text-current w-5 h-5" /> Testy
                    </button>

                    <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Zoznam</div>
                    <button
                        onClick={() => { setCurrentPage('calendar'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'calendar' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <CalendarIcon className="mr-3 text-current w-5 h-5" /> Kalendár
                    </button>
                    <button
                        onClick={() => { setCurrentPage('achievements'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'achievements' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <AwardIcon className="mr-3 text-current w-5 h-5" /> Úspechy
                    </button>
                    <button
                        onClick={() => { setCurrentPage('notes'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'notes' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <NoteIcon className="mr-3 text-current w-5 h-5" /> Poznámky
                    </button>

                    <div className="pt-3 pb-1 px-3 text-[12px] font-bold uppercase tracking-widest text-slate-500/70">Účet</div>
                    <button
                        onClick={() => { setCurrentPage('settings'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'settings' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <CogIcon className="mr-3 text-current w-5 h-5" /> Nastavenia
                    </button>
                    <button
                        onClick={() => { setCurrentPage('contacts'); setSidebarOpen(false); }}
                        className={`w-full text-left flex items-center py-2 px-3 rounded-lg transition-all duration-200 font-medium text-[16.5px] ${currentPage === 'contacts' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-[#15203d]/70 text-slate-300'}`}
                    >
                        <EnvelopeIcon className="mr-3 text-current w-5 h-5" /> Kontakty
                    </button>

                    <div className="my-2 border-t border-white/5 mx-2"></div>
                    <button
                        onClick={() => {
                            EventBus.dispatch("logout");
                            setRedirect("/home");
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
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Test Result Modal */}
            {
                testResultViewId && (
                    <TestResultDetailsModal
                        resultId={testResultViewId}
                        onClose={() => setTestResultViewId(null)}
                        beigeTextColor={beigeTextColor}
                    />
                )
            }

            <div className="flex flex-col flex-1">
                <header className="sticky top-0 bg-slate-800/50 backdrop-blur-sm p-4 border-b border-slate-700 md:hidden z-10 flex items-center">
                    <button onClick={() => setSidebarOpen(true)} className="text-slate-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <h1 className="text-xl font-bold ml-4" style={{ color: beigeTextColor }}>
                        Portál študenta
                    </h1>
                </header>

                <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
                    {renderContent()}
                </main>
            </div>

            {showClassmatesModal && <ClassmatesModal classmates={classmates} onClose={() => setShowClassmatesModal(false)} error={classmatesError} beigeTextColor={beigeTextColor} />}

            {/* Confirmation Modal */}
            {
                modal.show && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
                        <div className="bg-slate-900 border border-slate-700 rounded-[2rem] shadow-2xl w-full max-w-sm overflow-hidden animate-slide-in">
                            <div className={`h-2 w-full ${modal.type === 'danger' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                            <div className="p-8 text-center">
                                <div className={`w-16 h-16 rounded-2xl mx-auto mb-6 flex items-center justify-center ${modal.type === 'danger' ? 'bg-red-500/10 text-red-500' : 'bg-blue-500/10 text-blue-500'}`}>
                                    {modal.type === 'danger' ? <TrashIcon className="w-8 h-8" /> : <ExclamationTriangleIcon className="w-8 h-8" />}
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">{modal.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-8">
                                    {modal.message}
                                </p>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setModal({ ...modal, show: false })}
                                        className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl transition-all active:scale-95"
                                    >
                                        Zrušiť
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (modal.onConfirm) modal.onConfirm();
                                        }}
                                        className={`flex-1 px-4 py-3 ${modal.type === 'danger' ? 'bg-red-600 hover:bg-red-500' : 'bg-blue-600 hover:bg-blue-500'} text-white font-bold rounded-xl transition-all shadow-lg active:scale-95`}
                                    >
                                        {modal.type === 'danger' ? 'Odstrániť' : 'Potvrdiť'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    );
};


const ClassmatesModal = ({ classmates, onClose, error, beigeTextColor }) => {
    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
                <h2 className="text-3xl font-bold mb-6" style={{ color: beigeTextColor }}>Moji spolužiaci</h2>
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <ul className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {classmates.length > 0 ? (
                            classmates.map((classmate, index) => (
                                <li key={index} className="bg-slate-700 p-3 rounded-lg flex items-center">
                                    <UserIcon className="mr-3 text-blue-400 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold text-white">{classmate.name}</p>
                                        <p className="text-sm text-slate-400">{classmate.email}</p>
                                    </div>
                                </li>
                            ))
                        ) : (
                            <p className="text-slate-400 text-center">Zoznam spolužiakov je prázdny.</p>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
};



export default Profile;