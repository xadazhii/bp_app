import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import UserService from '../services/user.service';
import Simulation from "./simulation.component";
import emailjs from "@emailjs/browser";

const PhoneIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
);

const EnvelopeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
);

const UserGroupIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM4.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63A13.5 13.5 0 0112 21.75a13.5 13.5 0 01-6.386-1.872.75.75 0 01-.363-.63l-.001-.12v-.003zM12.375 14.25a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0z" />
        <path fillRule="evenodd" d="M12 21.75c-2.42 0-4.685-.6-6.63-1.652a.75.75 0 01-.363-.63l-.001-.12v-.003a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63A13.5 13.5 0 0112 21.75z" clipRule="evenodd" />
    </svg>
);

const KeyIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M15.75 1.5a6.75 6.75 0 00-6.651 7.906c.067.39-.032.79-.233 1.125a.75.75 0 00.233 1.125 8.25 8.25 0 013.427 5.023.75.75 0 101.4-.428a6.75 6.75 0 00-2.661-4.13l.001-.002.002-.003a.75.75 0 00.208-1.082 6.75 6.75 0 006.322-7.444A6.75 6.75 0 0015.75 1.5zm-3 6a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        <path d="M8.25 1.5A5.25 5.25 0 003 6.75v14.25a.75.75 0 001.5 0V6.75a3.75 3.75 0 013.75-3.75h.75a.75.75 0 000-1.5h-.75z" />
    </svg>
);

const OfficeIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18M18.75 3v18M9 6.75h6.75M9 11.25h6.75M9 15.75h6.75M9 20.25h6.75" />
    </svg>
);

const UserCircleIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
    </svg>
);

const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2">
        </path><circle cx="12" cy="7" r="4"></circle>
    </svg>
);

const ShieldCheckIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        <path d="m9 12 2 2 4-4"></path>
    </svg>
);

const ChartBarIcon = (props) =>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18" />
        <path d="M7 16V8" />
        <path d="M12 16v-4" />
        <path d="M17 16v-8" />
    </svg>;

const StarIcon = (props) =>
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>;

const BookOpenIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
    </svg>
);
const CalendarIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2">
        </rect><line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
    </svg>
);
const AwardIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="7"></circle>
        <path d="M8.21 13.89 7 22l5-3 5 3-1.21-8.11"></path>
    </svg>
);

const CheckCircleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9 12l2 2 4-4"></path>
    </svg>
);

const ListBulletIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10zm0 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);

const ArrowLeftIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z" clipRule="evenodd" />
    </svg>
);

const ArrowRightIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08L14.388 10.75H3.75A.75.75 0 013 10z" clipRule="evenodd" />
    </svg>
);

const DocumentTextIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M5.625 1.5H9a3.75 3.75 0 013.75 3.75v1.875c0 1.036.84 1.875 1.875 1.875H18.75v10.125A3.75 3.75 0 0115 22.5H5.625A3.75 3.75 0 011.875 18.75V5.25A3.75 3.75 0 015.625 1.5zM12.75 12a.75.75 0 00-1.5 0v2.25a.75.75 0 001.5 0V12zM10.5 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75h-.008a.75.75 0 01-.75-.75v-.008zM10.5 12a.75.75 0 00-1.5 0v.008a.75.75 0 001.5 0V12z" clipRule="evenodd" />
    </svg>
);

const ExclamationTriangleIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
    </svg>
);

const ClipboardDocumentCheckIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3.75a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25h-3zm.75 11.25a.75.75 0 000-1.5h1.5a.75.75 0 000 1.5h-1.5zm.75-3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 3.75a3.75 3.75 0 013.75-3.75h.75a3.75 3.75 0 013.75 3.75v.75h-.75A2.25 2.25 0 0013.5 6v10.5a2.25 2.25 0 002.25 2.25h.75v.75a3.75 3.75 0 01-3.75 3.75h-.75a3.75 3.75 0 01-3.75-3.75V3.75z" clipRule="evenodd" />
        <path d="M18.75 9.75a.75.75 0 00-1.5 0v2.25h-2.25a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25h2.25a.75.75 0 000-1.5h-2.25V9.75z" />
    </svg>
);

const TerminalIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

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

const fetchCompletedMaterialIds = async () => {
    try {
        const res = await fetch(`${API_URL}/api/progress/completed-ids`, { headers: authHeader() });
        if (!res.ok) throw new Error("Nepodarilo sa načítať dokončené materiály.");
        return await res.json();
    } catch (error) {
        console.error("Chyba pri načítaní dokončených materiálov:", error);
        throw error;
    }
}

const MaterialItem = ({ material, isCompleted, onMarkAsCompleted }) => (
    <li className="bg-slate-700/50 border border-slate-600 rounded-xl shadow-md
                   transition-all duration-300 ease-in-out
                   hover:shadow-blue-500/20 hover:border-blue-500/50 hover:scale-[1.02]">
        <div className="p-5 flex justify-between items-center space-x-4">
            <a href={material.url} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-3 group">
                <DocumentTextIcon className="h-6 w-6 text-slate-400 group-hover:text-blue-400 transition-colors" />
                <span className="font-medium text-slate-100 group-hover:text-blue-400 transition-colors">
                    {material.title}
                </span>
            </a>

            {isCompleted ? (
                <button
                    className="bg-green-800/70 text-green-300 font-semibold py-2 px-4 rounded-lg
                               flex items-center cursor-not-allowed"
                    disabled
                >
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Prečítané
                </button>
            ) : (
                <button
                    onClick={() => onMarkAsCompleted(material.id)}
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg
                               transition-all duration-200 ease-in-out
                               hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30
                               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                >
                    Označiť ako prečítané
                </button>
            )}
        </div>
    </li>
);

const MaterialSection = ({ title, materials, completedMaterials, onMarkAsCompleted }) => (
    <div>
        <h3 className="text-2xl font-semibold mb-5 text-blue-400 border-b-2 border-slate-700 pb-2">
            {title}
        </h3>
        {materials.length > 0 ? (
            <ul className="space-y-4">
                {materials.map(material => (
                    <MaterialItem
                        key={material.id}
                        material={material}
                        isCompleted={completedMaterials.has(material.id)}
                        onMarkAsCompleted={onMarkAsCompleted}
                    />
                ))}
            </ul>
        ) : (
            <p className="text-slate-400 italic mt-4">Žiadne materiály v tejto sekcii.</p>
        )}
    </div>
);

const LearningContent = ({ beigeTextColor }) => {
    const [materials, setMaterials] = useState([]);
    const [completedMaterials, setCompletedMaterials] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [materialsData, completedIdsData] = await Promise.all([
                    fetchMaterials(),
                    fetchCompletedMaterialIds()
                ]);

                setMaterials(materialsData);
                setCompletedMaterials(new Set(completedIdsData));
            } catch (err) {
                setError("Nepodarilo sa načítať dáta. Skúste to prosím neskôr.");
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const handleMarkAsCompleted = async (materialId) => {
        const originalCompleted = new Set(completedMaterials);
        setCompletedMaterials(prev => new Set(prev).add(materialId));

        try {
            const response = await fetch(`${API_URL}/api/progress`, {
                method: 'POST',
                headers: { ...authHeader(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ materialId })
            });
            if (!response.ok) {
                alert("Nepodarilo sa označiť materiál ako dokončený.");
                setCompletedMaterials(originalCompleted);
            }
        } catch (err) {
            alert("Nepodarilo sa označiť materiál ako dokončený.");
            setCompletedMaterials(originalCompleted);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-slate-400">
                <svg className="animate-spin h-8 w-8 mb-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="text-lg">Načítavam materiály...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-6 rounded-lg flex items-center">
                <ExclamationTriangleIcon className="h-6 w-6 mr-4"/>
                <p>{error}</p>
            </div>
        );
    }

    const lectures = materials.filter(m => m.type === 'lecture');
    const seminars = materials.filter(m => m.type === 'seminar');

    return (
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-8 backdrop-blur-sm">
            <h2 className="text-3xl font-bold mb-8 tracking-tight" style={{ color: beigeTextColor }}>
                Učebné materiály
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <MaterialSection
                    title="Prednášky"
                    materials={lectures}
                    completedMaterials={completedMaterials}
                    onMarkAsCompleted={handleMarkAsCompleted}
                />
                <MaterialSection
                    title="Semináre"
                    materials={seminars}
                    completedMaterials={completedMaterials}
                    onMarkAsCompleted={handleMarkAsCompleted}
                />
            </div>
        </section>
    );
};

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
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: beigeTextColor }}>Moje úspechy</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
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
        </section>
    );
};

const fetchMaterials = async () => {
    try {
        const res = await fetch(`${API_URL}/api/materials`, {
            method: "GET",
            headers: authHeader(),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to load materials.");
        }
        return await res.json();
    } catch (error) {
        console.error("Error loading materials:", error);
        throw error;
    }
};

const TestsContentPage = ({ beigeTextColor }) => {
    const [tests, setTests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTest, setActiveTest] = useState(null);
    const [answers, setAnswers] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [result, setResult] = useState(null);
    const [completedTests, setCompletedTests] = useState(new Set());
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

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
                setTests(testsData);
                setCompletedTests(new Set(completedData));
            } catch (err) {
                setError("Nepodarilo sa načítať dáta. Skúste to prosím neskôr.");
            } finally {
                setLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const startTest = async (testId) => {
        setLoading(true);
        setError(null);
        setCurrentQuestionIndex(0);
        try {
            const res = await fetch(`${API_URL}/api/tests/${testId}`, { headers: authHeader() });
            if (!res.ok) throw new Error("Nepodarilo sa načítať test.");
            const data = await res.json();
            setActiveTest(data);
            setAnswers({});
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

    const submitTest = async () => {
        const allAnswered = activeTest.questions.every(q => answers[q.questionId] !== undefined);
        if (!allAnswered) {
            alert("Prosím, zodpovedajte všetky otázky pred odovzdaním testu.");
            return;
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
                    submissions: submissions
                })
            });
            if (!res.ok) throw new Error("Nepodarilo sa odovzdať výsledok testu.");
            const data = await res.json();

            const totalPoints = activeTest.questions.reduce((sum, q) => {
                const maxForQ = Math.max(...q.answers.map(a => a.pointsWeight || 0), 0);
                return sum + maxForQ;
            }, 0);

            setResult({ score: data.score, total: totalPoints });
            setActiveTest(null);
        } catch (err) {
            setError("Nepodarilo sa odovzdať výsledok testu.");
        } finally {
            setSubmitting(false);
        }
    };

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
            <ExclamationTriangleIcon className="h-6 w-6 mr-4"/>
            <p>{error}</p>
        </div>
    );

    if (activeTest) {
        const currentQuestion = activeTest.questions[currentQuestionIndex];
        const progressPercentage = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;

        return (
            <section className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-8 flex flex-col" style={{minHeight: '500px'}}>
                <div>
                    <h2 className="text-2xl font-bold" style={{ color: beigeTextColor }}>{activeTest.title}</h2>
                    <div className="flex justify-between items-center mt-2 mb-6">
                        <p className="text-sm text-blue-400 font-medium">
                            Otázka {currentQuestionIndex + 1} z {activeTest.questions.length}
                        </p>
                        <div className="w-1/2 bg-slate-700 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full transition-all duration-300" style={{ width: `${progressPercentage}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-grow">
                    <div key={currentQuestion.questionId} className="bg-slate-700/40 p-6 rounded-lg border border-slate-600">
                        <p className="font-semibold text-xl text-slate-100 mb-5">
                            {currentQuestion.question}
                            <span className="text-base text-slate-400 ml-2">({currentQuestion.points} {currentQuestion.points === 1 ? 'bod' : 'body'})</span>
                        </p>

                        <div className="space-y-3">
                            {currentQuestion.type === 'OPEN' ? (
                                <textarea
                                    value={answers[currentQuestion.questionId] || ""}
                                    onChange={(e) => handleAnswer(currentQuestion.questionId, e.target.value)}
                                    className="w-full p-4 rounded-lg bg-slate-900/50 border border-slate-600 text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                                    placeholder="Napíšte svoju odpoveď sem..."
                                    rows={5}
                                />
                            ) : (
                                currentQuestion.answers.map((ans) => (
                                    <label key={ans.answerId} className="flex items-center p-4 rounded-lg transition-all duration-200 bg-slate-900/50 hover:bg-slate-700/50 cursor-pointer border-2 border-transparent has-[:checked]:border-blue-500 has-[:checked]:bg-slate-700">
                                        <input
                                            type="radio"
                                            name={`q${currentQuestion.questionId}`}
                                            checked={answers[currentQuestion.questionId] === ans.answerId}
                                            onChange={() => handleAnswer(currentQuestion.questionId, ans.answerId)}
                                            className="h-5 w-5 mr-4 bg-slate-600 border-slate-500 text-blue-500 focus:ring-blue-500"
                                        />
                                        <span className="text-slate-200">{ans.text}</span>
                                    </label>
                                ))
                            )}
                        </div>

                    </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                    <button onClick={handlePrevQuestion} disabled={currentQuestionIndex === 0} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-slate-600 hover:bg-slate-500 text-white font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <ArrowLeftIcon className="h-5 w-5" />
                        Späť
                    </button>
                    {currentQuestionIndex < activeTest.questions.length - 1 ? (
                        <button onClick={handleNextQuestion} className="flex items-center gap-2 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors">
                            Ďalej
                            <ArrowRightIcon className="h-5 w-5" />
                        </button>
                    ) : (
                        <button onClick={submitTest} disabled={submitting} className="px-5 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white font-bold transition-colors disabled:bg-slate-500">
                            {submitting ? "Odosielam..." : "Odovzdať test"}
                        </button>
                    )}
                </div>
            </section>
        );
    }

    if (result) {
        return (
            <section className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-8 flex flex-col items-center text-center">
                <CheckCircleIcon className="w-20 h-20 text-green-400 mb-4" />
                <h2 className="text-3xl font-bold mb-2" style={{ color: beigeTextColor }}>Test dokončený!</h2>
                <p className="text-lg text-slate-400 mb-6">Váš výsledok je:</p>
                <p className="text-5xl font-bold text-yellow-300 mb-8">
                    {result.score} <span className="text-3xl text-slate-400">/ {result.total} bodov</span>
                </p>
                <button onClick={handleReturnToList} className="bg-blue-600 text-white font-semibold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors">
                    Späť na zoznam testov
                </button>
            </section>
        );
    }

    return (
        <section className="bg-slate-800/50 border border-slate-700 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: beigeTextColor }}>Dostupné testy</h2>
            {tests.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => (
                        <div key={test.id} className="bg-slate-800 border border-slate-700 rounded-xl shadow-lg transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-blue-500/20 flex flex-col">
                            <div className="p-6 flex-grow">
                                <ClipboardDocumentCheckIcon className="h-10 w-10 text-blue-400 mb-4"/>
                                <h3 className="font-bold text-xl text-slate-100 mb-2">{test.title}</h3>
                                <div className="flex items-center text-xs text-slate-300 space-x-4 border-t border-slate-700 pt-3 mt-auto">
                                    <span className="flex items-center gap-1.5"><ListBulletIcon className="h-4 w-4" /> {test.questionCount} otázok</span>
                                    <span className="flex items-center gap-1.5"><StarIcon className="h-4 w-4" /> {test.totalPoints} bodov</span>
                                </div>
                            </div>

                            <div className="bg-slate-700/50 p-4 rounded-b-xl">
                                {completedTests.has(test.id) ? (
                                    <button className="w-full bg-green-800/70 text-green-300 font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2 cursor-not-allowed" disabled>
                                        <CheckCircleIcon className="h-5 w-5" />
                                        Dokončený
                                    </button>
                                ) : (
                                    <button onClick={() => startTest(test.id)} className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                                        Spustiť test
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-slate-400 text-center py-8">Momentálne nie sú dostupné žiadne testy.</p>
            )}
        </section>
    );
};

const ContactsModal = ({ onClose }) => {
    const text_beige = '#F5F5DC';

    const [message, setMessage] = useState({ name: "", email: "", text: "" });
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
                setMessage({ name: "", email: "", text: "" });
            })
            .catch((err) => {
                console.error("EmailJS error:", err);
            });
    };

    return (
        <div className="fixed inset-0 bg-slate-900 bg-opacity-75 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl p-8 w-full max-w-3xl relative">

                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

                {showAlert && (
                    <div className="fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-4
                  bg-slate-700/80 backdrop-blur-md text-slate-100 rounded-xl shadow-xl
                  border border-slate-600 animate-slide-in">
                        <svg xmlns="http://www.w3.org/2000/svg"
                             className="h-6 w-6 text-blue-400"
                             fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                  d="M5 13l4 4L19 7" />
                        </svg>
                        <p className="font-medium text-base">Správa bola úspešne odoslaná</p>
                    </div>
                )}

                <header className="text-center mb-8">
                    <h3 className="text-3xl font-extrabold tracking-tight" style={{ color: text_beige }}>Kontakty</h3>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center justify-center text-center">
                        <div className="mb-6">
                            <h4 className="text-2xl font-bold mb-1" style={{ color: text_beige }}>Učiteľ</h4>
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

                    <div className="bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700">
                        <h4 className="text-2xl font-bold text-beige mb-4 text-center" style={{ color: text_beige }}>Odoslať správu</h4>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Vaše meno</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={message.name}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-lg border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Zadajte vaše meno"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-1">Váš e-mail</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={message.email}
                                    onChange={handleChange}
                                    required
                                    className="block w-full rounded-lg border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-500 focus:border-blue-500"
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
                                    className="block w-full rounded-lg border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-500 focus:border-blue-500"
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
        </div>
    );
};

const Profile = () => {
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

    const [showClassmatesModal, setShowClassmatesModal] = useState(false);
    const [classmates, setClassmates] = useState([]);
    const [classmatesLoading, setClassmatesLoading] = useState(false);
    const [classmatesError, setClassmatesError] = useState(null);
    const [showContactsModal, setShowContactsModal] = useState(false);

    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            setRedirect("/home");
        } else {
            setCurrentUser(user);
            setUserReady(true);

            UserService.getUserStats(user.id)
                .then(response => {
                    setUserStats(response.data);
                })
                .catch(error => {
                    console.error("Nepodarilo sa načítať štatistiky používateľa:", error);
                })
                .finally(() => {
                    setStatsLoading(false);
                });
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
                />;
            case 'learning':
                return <LearningContent beigeTextColor={beigeTextColor} />;
            case 'simulation':
                return <Simulation />;
            case 'tests':
                return <TestsContentPage beigeTextColor={beigeTextColor} />;
            case 'calendar':
                return <CalendarContent beigeTextColor={beigeTextColor} />;
            case 'achievements':
                return <AchievementsContent stats={userStats} statsLoading={statsLoading} beigeTextColor={beigeTextColor} />;
            case 'security':
                return <SecuritySettings currentUser={currentUser} beigeTextColor={beigeTextColor} />;
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
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-slate-800/80 flex flex-col p-4 border-r border-slate-700 shadow-xl
                       transform transition-transform duration-300 ease-in-out md:static md:translate-x-0 
                       ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="text-2xl font-bold mb-8 text-center" style={{ color: beigeTextColor }}>
                    Portál študenta
                </div>
                <nav className="flex-grow space-y-2">
                    <button onClick={() => { setCurrentPage('overview'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'overview' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><UserIcon className="mr-3 text-current" /> Prehľad profilu</button>
                    <button onClick={() => { setCurrentPage('learning'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'learning' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><BookOpenIcon className="mr-3 text-current" /> Učenie</button>
                    <button onClick={() => { setCurrentPage('simulation'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'simulation' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><TerminalIcon className="mr-3 text-current" /> Simulácia</button>
                    <button onClick={() => { setCurrentPage('tests'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'tests' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><ChartBarIcon className="mr-3 text-current" /> Testy</button>
                    <button onClick={() => { setCurrentPage('calendar'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'calendar' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><CalendarIcon className="mr-3 text-current" /> Kalendár</button>
                    <button onClick={() => { setCurrentPage('achievements'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'achievements' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><AwardIcon className="mr-3 text-current" /> Úspechy</button>
                    <button onClick={() => { setCurrentPage('security'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'security' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><ShieldCheckIcon className="mr-3 text-current" /> Bezpečnosť</button>
                    <button onClick={() => { setShowContactsModal(true); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium hover:bg-slate-700/70 text-slate-300`}><EnvelopeIcon /> <span className="ml-3">Kontakty</span></button>
                </nav>
            </aside>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-20 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

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
            {showContactsModal && <ContactsModal onClose={() => setShowContactsModal(false)} />}
        </div>
    );
};

const ProfileOverview = ({ currentUser, stats, statsLoading, beigeTextColor, onViewClassmates, classmatesLoading }) => {

    const calculateOverallProgress = () => {
        if (!stats || statsLoading) return 0;
        const totalMaterials = (stats?.lectureStats?.total ?? 0) + (stats?.seminarStats?.total ?? 0);
        const completedMaterials = (stats?.lectureStats?.completed ?? 0) + (stats?.seminarStats?.completed ?? 0);
        if (totalMaterials === 0) return 0;
        return Math.round((completedMaterials / totalMaterials) * 100);
    };

    return (
        <div>
            <header className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8 mb-8">
                <h2 className="text-3xl font-bold tracking-wide mb-6 pb-6 border-b border-slate-700" style={{ color: beigeTextColor }}>
                    Môj profil
                </h2>
                <div className="flex flex-col sm:flex-row items-center text-center sm:text-left">
                    <UserCircleIcon className="w-24 h-24 sm:w-32 sm:h-32 text-blue-600 flex-shrink-0 mb-6 sm:mb-0 sm:mr-8" />
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: beigeTextColor }}>
                            {currentUser.username}
                        </h1>
                        <p className="mt-1 text-base text-slate-400">{currentUser.email}</p>
                        <button
                            onClick={onViewClassmates}
                            className="mt-6 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
                            disabled={classmatesLoading}
                        >
                            {classmatesLoading ? 'Načítava sa...' : 'Moji spolužiaci'}
                        </button>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-lg transition hover:border-blue-500/50">
                    <h2 className="text-xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                        <ChartBarIcon className="mr-3 text-blue-400" />Môj progres
                    </h2>
                    <p className="text-6xl font-bold text-center" style={{ color: beigeTextColor }}>
                        {statsLoading ? '...' : calculateOverallProgress()}<span className="text-4xl text-slate-400">%</span>
                    </p>
                </div>
                <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-6 shadow-lg transition hover:border-blue-500/50">
                    <h2 className="text-xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                        <StarIcon className="mr-3 text-blue-400" />Počet bodov
                    </h2>
                    <p className="text-6xl font-bold text-center" style={{ color: beigeTextColor }}>
                        {statsLoading ? '...' : (stats?.testStats?.totalPoints ?? 0)}
                    </p>
                </div>
            </div>
        </div>
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

const SecuritySettings = ({ currentUser, beigeTextColor }) => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setLoading(true);

        if (!oldPassword || !newPassword || !confirmPassword) {
            setMessage("Chyba: Vyplňte všetky polia.");
            setIsError(true);
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage("Chyba: Nové heslá sa nezhodujú!");
            setIsError(true);
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setMessage("Chyba: Heslo musí mať aspoň 6 znakov.");
            setIsError(true);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users/${currentUser.id}/password`, {
                method: "PUT",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ oldPassword, newPassword }),
            });

            if (response.ok) {
                const data = await response.json();
                setMessage(data.message || "Heslo bolo úspešne aktualizované!");
                setOldPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                const contentType = response.headers.get("content-type");
                let errorText;
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    errorText = errorData.message || `Chyba stavu: ${response.status}. Nepodarilo sa aktualizovať heslo.`;
                } else {
                    errorText = await response.text() || `Chyba stavu: ${response.status}. Neznáma odpoveď servera.`;
                }
                throw new Error(errorText);
            }

        } catch (error) {
            setMessage(`Chyba: ${error.message}`);
            setIsError(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-8" style={{ color: beigeTextColor }}>Bezpečnosť a prístup</h2>

            <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 flex items-center text-blue-400">
                    <UserGroupIcon className="w-6 h-6 mr-3" />
                    Vaše roly
                </h3>
                <div className="flex flex-wrap gap-3">
                    {currentUser.roles && currentUser.roles.map((role, index) => (
                        <span key={index} className="bg-slate-700 text-slate-200 text-sm font-medium px-4 py-1.5 rounded-full shadow-sm">
                            {role}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-6 flex items-center text-blue-400">
                    <KeyIcon className="w-6 h-6 mr-3" />
                    Zmeniť heslo
                </h3>
                {message && (
                    <div className={`p-4 mb-4 rounded-lg text-sm font-medium ${isError ? 'bg-red-900/80 text-red-300' : 'bg-green-900/80 text-green-300'}`}>
                        {message}
                    </div>
                )}
                <form onSubmit={handlePasswordUpdate} className="space-y-4 max-w-md">
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Aktuálne heslo"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full pl-4 pr-10 py-2 rounded-lg border bg-slate-700 border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                            required
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM9.5 6.5a3.5 3.5 0 00-3.5 3.5a.5.5 0 01-1 0a4.5 4.5 0 014.5-4.5a.5.5 0 010 1zM10.928 9.072a.5.5 0 01.527.527l-4.288 4.288a.5.5 0 01-.527-.527l4.288-4.288z" clipRule="evenodd" /></svg>
                            )}
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Nové heslo"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                            required
                        />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Potvrdiť nové heslo"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border bg-slate-700 border-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className={`bg-blue-600 text-white font-bold py-2 px-5 rounded-lg transition-all duration-200 shadow-md ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
                        disabled={loading}
                    >
                        {loading ? "Aktualizuje sa..." : "Aktualizovať heslo"}
                    </button>
                </form>
            </div>
        </section>
    );
};

const CalendarContent = ({ beigeTextColor }) => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [readEvents, setReadEvents] = useState(() => {
        try {
            const storedReadEvents = window.localStorage.getItem("readEvents");
            return storedReadEvents ? JSON.parse(storedReadEvents) : {};
        } catch (error) {
            console.error("Nepodarilo sa načítať prečítané udalosti z localStorage", error);
            return {};
        }
    });

    const fetchEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_URL}/api/calendar-events`, {
                headers: authHeader(),
            });
            if (!res.ok) throw new Error("Nepodarilo sa načítať udalosti");
            const data = await res.json();
            setEvents(data);
        } catch (e) {
            setError("Nepodarilo sa načítať udalosti.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    useEffect(() => {
        window.localStorage.setItem("readEvents", JSON.stringify(readEvents));
    }, [readEvents]);

    const handleMarkAsRead = (id) => {
        setReadEvents(prev => ({
            ...prev,
            [id]: true
        }));
    };

    return (
        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6" style={{ color: beigeTextColor }}>Môj Kalendár</h2>

            {loading ? (
                <div className="text-slate-400">Načítavam udalosti...</div>
            ) : error ? (
                <div className="text-red-500">{error}</div>
            ) : (
                <div className="bg-slate-700/50 p-4 rounded-xl border border-slate-600">
                    <h3 className="font-bold text-blue-400 mb-2">Nadchádzajúce udalosti:</h3>
                    <ul className="space-y-2">
                        {events.length === 0 ? (
                            <li className="text-slate-400">Žiadne udalosti.</li>
                        ) : (
                            events
                                .filter(ev => ev.eventDate)
                                .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                                .map(ev => {
                                    const dateParts = ev.eventDate.split("-");
                                    const localDate =
                                        dateParts.length === 3
                                            ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                                            : new Date(NaN);

                                    const isRead = readEvents[ev.id];
                                    const messageColor = isRead ? "text-slate-400" : "text-blue-400";
                                    const itemBgColor = isRead ? "bg-white/5" : "bg-blue-900/20 border-l-4 border-blue-500";

                                    return (
                                        <li
                                            key={ev.id}
                                            onClick={() => handleMarkAsRead(ev.id)}
                                            className={`flex flex-col items-start p-3 rounded-lg cursor-pointer transition-all duration-200 ${itemBgColor}`}
                                        >
                                            <div className="w-full">
                                                <span className={`font-bold ${messageColor}`}>
                                                    {isNaN(localDate)
                                                        ? "Neplatný dátum"
                                                        : localDate.toLocaleDateString("sk-SK", {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        })}
                                                </span>
                                            </div>
                                            <div className="mt-1">
                                                <span className={`text-sm ${isRead ? "text-slate-400" : "text-slate-100"}`}>{ev.message}</span>
                                            </div>
                                        </li>
                                    );
                                })
                        )}
                    </ul>
                </div>
            )}
        </section>
    );
};

export default Profile;