import React, { useState, useEffect, useRef } from "react";
import { Navigate } from "react-router-dom";
import AuthService from "../services/auth.service";
import authHeader from "../services/auth-header";
import UserService from '../services/user.service';
import Simulation from "./simulation.component";
import emailjs from "@emailjs/browser";
import EventBus from "../common/EventBus";
import axios from "axios";

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

const FriendsIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
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
const TrophyIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
        <path d="M4 22h16"></path>
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path>
    </svg>
);
const NoteIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
);

const TrashIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        <line x1="10" y1="11" x2="10" y2="17"></line>
        <line x1="14" y1="11" x2="14" y2="17"></line>
    </svg>
);

const PencilIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17.3 3z"></path>
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

const CogIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
        <circle cx="12" cy="12" r="3"></circle>
    </svg>
);

const ClipboardDocumentCheckIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path fillRule="evenodd" d="M10.5 3.75a2.25 2.25 0 00-2.25 2.25v10.5a2.25 2.25 0 002.25 2.25h3a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25h-3zm.75 11.25a.75.75 0 000-1.5h1.5a.75.75 0 000 1.5h-1.5zm.75-3.75a.75.75 0 01.75-.75h1.5a.75.75 0 010 1.5h-1.5a.75.75 0 01-.75-.75zM8.25 3.75a3.75 3.75 0 013.75-3.75h.75a3.75 3.75 0 013.75 3.75v.75h-.75A2.25 2.25 0 0013.5 6v10.5a2.25 2.25 0 002.25 2.25h.75v.75a3.75 3.75 0 01-3.75 3.75h-.75a3.75 3.75 0 01-3.75-3.75V3.75z" clipRule="evenodd" />
        <path d="M18.75 9.75a.75.75 0 00-1.5 0v2.25h-2.25a.75.75 0 000 1.5h2.25v2.25a.75.75 0 001.5 0v-2.25h2.25a.75.75 0 000-1.5h-2.25V9.75z" />
    </svg>
);

const LogoutIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const TerminalIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
);

const CameraIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 9a3.75 3.75 0 100 7.5A3.75 3.75 0 0012 9z" />
        <path fillRule="evenodd" d="M9.344 3.071a2.25 2.25 0 012.112-.571 6.974 6.974 0 011.088.37l.061.025c.233.097.482.2.732.302.249.101.511.199.788.293l.053.018a2.25 2.25 0 011.482 1.5l.017.054a2.255 2.255 0 00.242.47c.145.2.323.374.532.517a2.25 2.25 0 00.414.218l.062.022a2.3 2.3 0 011.533 2.158v7.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V9.752c0-1.01.667-1.896 1.633-2.176l.061-.02a2.25 2.25 0 00.444-.233 2.23 2.23 0 00.52-.513 2.254 2.254 0 00.242-.47l.017-.054a2.25 2.25 0 011.482-1.5l.053-.018c.277-.094.539-.192.788-.293.25-.102.5-.205.732-.302l.061-.025a6.974 6.974 0 011.088-.37 2.25 2.25 0 012.112.57zM12 7.5a5.25 5.25 0 100 10.5 5.25 5.25 0 000-10.5z" clipRule="evenodd" />
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

const LearningContent = ({ beigeTextColor, onUpdate, setModal }) => {
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
            if (response.ok) {
                if (onUpdate) onUpdate();
            } else {
                setModal({
                    show: true,
                    title: 'Chyba',
                    message: 'Nepodarilo sa označiť materiál ako dokončený.',
                    type: 'danger',
                    onConfirm: () => setModal(prev => ({ ...prev, show: false }))
                });
                setCompletedMaterials(originalCompleted);
            }
        } catch (err) {
            setModal({
                show: true,
                title: 'Chyba pripojenia',
                message: 'Nepodarilo sa označiť materiál ako dokončený. Skontrolujte pripojenie.',
                type: 'danger',
                onConfirm: () => setModal(prev => ({ ...prev, show: false }))
            });
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
                <ExclamationTriangleIcon className="h-6 w-6 mr-4" />
                <p>{error}</p>
            </div>
        );
    }

    const lectures = materials.filter(m => m.type === 'lecture');
    const seminars = materials.filter(m => m.type === 'seminar');

    return (
        <div className="space-y-10">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: beigeTextColor }}>
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
        </div>
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

const TestsContentPage = ({ beigeTextColor, onUpdate, setModal }) => {
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
            setModal({
                show: true,
                title: 'Nedokončený test',
                message: 'Prosím, zodpovedajte všetky otázky pred odovzdaním testu.',
                type: 'info',
                onConfirm: () => setModal(prev => ({ ...prev, show: false }))
            });
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
            if (onUpdate) onUpdate();
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
            <ExclamationTriangleIcon className="h-6 w-6 mr-4" />
            <p>{error}</p>
        </div>
    );

    if (activeTest) {
        const currentQuestion = activeTest.questions[currentQuestionIndex];
        const progressPercentage = ((currentQuestionIndex + 1) / activeTest.questions.length) * 100;

        return (
            <div className="flex flex-col space-y-12 animate-fade-in py-4 max-w-4xl mx-auto" style={{ minHeight: '600px' }}>
                {/* Header Section */}
                <div className="flex items-center justify-between border-b border-white/5 pb-8">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Aktuálny test</span>
                        <h2 className="text-2xl font-bold text-white tracking-tight">{activeTest.title}</h2>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Progres</span>
                            <span className="text-sm font-bold text-blue-400">{currentQuestionIndex + 1} / {activeTest.questions.length}</span>
                        </div>
                        <div className="w-32 bg-slate-800 rounded-full h-1 overflow-hidden">
                            <div
                                className="bg-blue-500 h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                {/* Question Area */}
                <div className="flex-grow">
                    <div key={currentQuestion.questionId} className="animate-slide-in space-y-10">
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-md border border-blue-500/20">
                                    Otázka {currentQuestionIndex + 1}
                                </span>
                                <span className="text-slate-500 font-bold text-[10px] uppercase tracking-widest">
                                    • {currentQuestion.points} {currentQuestion.points === 1 ? 'bod' : 'body'}
                                </span>
                            </div>
                            <p className="text-3xl md:text-4xl font-bold text-white leading-tight tracking-tight">
                                {currentQuestion.question}
                            </p>
                        </div>

                        <div className="space-y-4">
                            {currentQuestion.type === 'OPEN' ? (
                                <textarea
                                    value={answers[currentQuestion.questionId] || ""}
                                    onChange={(e) => handleAnswer(currentQuestion.questionId, e.target.value)}
                                    className="w-full p-8 rounded-3xl bg-slate-800/20 border border-white/5 text-slate-100 focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 transition-all outline-none text-xl resize-none placeholder:text-slate-700"
                                    placeholder="Sem napíšte svoju odpoveď..."
                                    rows={8}
                                />
                            ) : (
                                <div className="grid grid-cols-1 gap-3">
                                    {currentQuestion.answers.map((ans, idx) => (
                                        <label
                                            key={ans.answerId}
                                            className={`group/opt flex items-center p-6 rounded-2xl transition-all duration-200 cursor-pointer border ${answers[currentQuestion.questionId] === ans.answerId
                                                ? 'bg-blue-600/10 border-blue-500/50'
                                                : 'bg-slate-800/10 border-white/5 hover:border-white/20 hover:bg-slate-800/30'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`q${currentQuestion.questionId}`}
                                                checked={answers[currentQuestion.questionId] === ans.answerId}
                                                onChange={() => handleAnswer(currentQuestion.questionId, ans.answerId)}
                                                className="hidden"
                                            />
                                            <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center mr-6 transition-all duration-200 ${answers[currentQuestion.questionId] === ans.answerId
                                                ? 'bg-blue-600 border-blue-600'
                                                : 'border-slate-700 group-hover/opt:border-slate-500'
                                                }`}>
                                                {answers[currentQuestion.questionId] === ans.answerId && (
                                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" /></svg>
                                                )}
                                            </div>
                                            <span className={`text-lg font-medium transition-colors ${answers[currentQuestion.questionId] === ans.answerId ? 'text-white' : 'text-slate-400 group-hover/opt:text-slate-200'
                                                }`}>
                                                {ans.text}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Navigation Bar */}
                <div className="pt-12 flex justify-between items-center border-t border-white/5 mt-12">
                    <button
                        onClick={handlePrevQuestion}
                        disabled={currentQuestionIndex === 0}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-slate-500 hover:text-white hover:bg-slate-800/50 font-bold transition-all disabled:opacity-0 disabled:pointer-events-none"
                    >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Späť
                    </button>

                    <div className="flex items-center gap-1.5 grayscale opacity-30">
                        {activeTest.questions.map((_, i) => (
                            <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all duration-300 ${i === currentQuestionIndex ? 'w-6 bg-blue-500 opacity-100 grayscale-0' :
                                    answers[activeTest.questions[i].questionId] !== undefined ? 'w-1.5 bg-blue-400 opacity-50 grayscale-0' : 'w-1.5 bg-slate-600'
                                    }`}
                            />
                        ))}
                    </div>

                    {currentQuestionIndex < activeTest.questions.length - 1 ? (
                        <button
                            onClick={handleNextQuestion}
                            className="flex items-center gap-2 px-8 py-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all active:scale-[0.98] group/next"
                        >
                            Nasledujúca
                            <ArrowRightIcon className="h-4 w-4 group-hover/next:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            onClick={submitTest}
                            disabled={submitting}
                            className="flex items-center gap-2 px-10 py-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all active:scale-[0.98]"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <CheckCircleIcon className="h-4 w-4" />
                                    Odovzdať test
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="flex flex-col items-center text-center py-20 animate-fade-in">
                <div className="relative mb-10">
                    <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full"></div>
                    <CheckCircleIcon className="w-32 h-32 text-emerald-400 relative z-10 animate-pulse" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter" style={{ color: beigeTextColor }}>
                    Test dokončený!
                </h2>
                <p className="text-xl text-slate-400 mb-12 font-medium">Gratulujeme k úspešnému absolvovaniu.</p>

                <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-10 rounded-[2.5rem] shadow-2xl mb-12 w-full max-w-md relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-indigo-500"></div>
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mb-4">Váš finálny výsledok</p>
                    <div className="flex items-baseline justify-center gap-2">
                        <span className="text-7xl font-black text-white hover:scale-110 transition-transform cursor-default">
                            {result.score}
                        </span>
                        <span className="text-2xl font-bold text-slate-500">/ {result.total} bodov</span>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-700/50">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-slate-400 text-sm font-medium">Úspešnosť</span>
                            <span className="text-emerald-400 font-bold">{Math.round((result.score / result.total) * 100)}%</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
                            <div
                                className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000"
                                style={{ width: `${(result.score / result.total) * 100}%` }}
                            ></div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleReturnToList}
                    className="group bg-blue-600 hover:bg-blue-500 text-white font-black py-4 px-12 rounded-2xl transition-all shadow-2xl shadow-blue-900/40 active:scale-95 flex items-center gap-3"
                >
                    <ArrowLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Späť na zoznam testov
                </button>
            </div>
        );
    }

    return (
        // Головний контейнер без рамки
        <div className="animate-fade-in max-w-6xl w-full">
            {/* Header */}
            <div className="mb-8">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">Dostupné testy</h2>
            </div>

            {tests.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tests.map((test) => {
                        const isCompleted = completedTests.has(test.id);
                        return (
                            <div
                                key={test.id}
                                className={`group/tcard bg-slate-700/40 border border-white/10 rounded-2xl overflow-hidden flex flex-col transition-all duration-300 hover:border-blue-500/40 hover:-translate-y-1 shadow-2xl ${isCompleted ? 'opacity-60' : ''}`}
                            >
                                {/* Upper Section */}
                                <div className="p-4 flex-grow bg-slate-900/40">
                                    {/* Icon */}
                                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-3 relative group-hover/tcard:bg-blue-500/20 transition-colors">
                                        <ClipboardDocumentCheckIcon className="h-5 w-5 text-blue-400" />
                                    </div>

                                    {/* Title */}
                                    <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{test.title}</h3>

                                    {/* Separator */}
                                    <div className="border-b border-white/5 mb-3"></div>

                                    {/* Metadata */}
                                    <div className="flex items-center gap-5 text-xs font-medium text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <ListBulletIcon className="h-3.5 w-3.5" />
                                            <span>{test.questionCount} {test.questionCount === 1 ? 'otázok' : test.questionCount < 5 ? 'otázky' : 'otázok'}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StarIcon className="h-3.5 w-3.5" />
                                            <span>{test.totalPoints} {test.totalPoints === 1 ? 'bodov' : 'bodov'}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Darker Footer Section (Action) */}
                                <div className="px-4 py-3 bg-slate-900/60 border-t border-white/5">
                                    {isCompleted ? (
                                        <div className="w-full py-2 text-emerald-400 font-bold flex items-center justify-center gap-2 border border-emerald-500/20 rounded-xl bg-emerald-500/5 text-xs">
                                            <CheckCircleIcon className="h-4 w-4" />
                                            Dokončený
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => startTest(test.id)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold py-2 rounded-lg transition-all active:scale-[0.98] shadow-lg shadow-blue-900/20"
                                        >
                                            Spustiť test
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 rounded-2xl border border-dashed border-white/10 mx-auto max-w-md">
                    <ClipboardDocumentCheckIcon className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium text-sm">Zatiaľ nie sú dostupné žiadne testy.</p>
                </div>
            )}
        </div>
    );
}; // <-- ЗДЕСЬ ДОБАВЛЕНА НЕДОСТАЮЩАЯ СКОБКА

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

            <h2 className="text-3xl font-bold mb-6" style={{ color: beigeTextColor }}>Kontakty</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700 flex flex-col items-center justify-center text-center">
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

                <div className="bg-slate-800/50 p-6 rounded-2xl shadow-xl border border-slate-700">
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
                                className="block w-full rounded-lg border-slate-600 bg-slate-700 text-slate-100 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
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
                                className="block w-full rounded-lg border-slate-600 bg-slate-700/50 text-slate-400 cursor-not-allowed"
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

    const truncateContent = (content, maxLength = 150) => {
        if (!content) return "";
        // Clean JSON tags for summary
        const displayData = renderNotePreview(content);
        const text = displayData.text.substring(0, maxLength);
        return text + (displayData.text.length > maxLength ? "..." : "");
    };

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
                                    <div className="my-4 rounded-xl overflow-hidden border border-slate-700/50 bg-black/20 text-center relative group/img">
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
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedNote(null)}>
                    <div className="bg-slate-800 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col relative" onClick={e => e.stopPropagation()}>
                        <button
                            onClick={() => setSelectedNote(null)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-700/50 hover:bg-slate-700 p-2 rounded-full transition-all"
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

                            <div className="flex justify-between items-center pt-6 border-t border-slate-700/50">
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

            <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold flex items-center" style={{ color: beigeTextColor }}>
                        <NoteIcon className="mr-4 text-blue-400 w-8 h-8" /> Moje poznámky
                    </h2>
                </div>

                {/* Tab Switcher - Segmented Control Style */}
                <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700 flex w-fit">
                    <button
                        onClick={() => setNotesActiveTab('write')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${notesActiveTab === 'write'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        Nová poznámka
                    </button>
                    <button
                        onClick={() => setNotesActiveTab('browse')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${notesActiveTab === 'browse'
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                    >
                        <ListBulletIcon className="w-4 h-4" />
                        Moje archívy
                    </button>
                </div>
            </header>

            {notesActiveTab === 'write' ? (

                <form onSubmit={handleSubmitNote} className="w-full space-y-4 animate-fade-in group/form">
                    {/* Word-style Toolbar */}
                    <div className={`sticky top-4 z-40 flex items-center justify-between p-2 bg-slate-800/95 backdrop-blur-md border ${editingNoteId ? 'border-blue-500 shadow-blue-500/20' : 'border-slate-700'} rounded-xl shadow-2xl transition-all`}>
                        <div className="flex items-center gap-1">
                            <h3 className="text-xs font-bold text-slate-400 px-3 uppercase tracking-wider border-r border-slate-700 mr-2">
                                {editingNoteId ? 'Editor' : 'Nový dokument'}
                            </h3>
                            <button type="button" onClick={() => addBlock('text')} className="p-2 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-lg transition-all" title="Vložiť text">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            </button>
                            <button type="button" onClick={() => addBlock('image')} className="p-2 hover:bg-slate-700 text-slate-300 hover:text-blue-400 rounded-lg transition-all" title="Vložiť obrázok">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                            </button>
                        </div>

                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={removeSelectedBlocks}
                                disabled={!blocks.some(b => b.selected)}
                                className={`p-2 rounded-lg transition-all flex items-center gap-2 ${blocks.some(b => b.selected)
                                    ? 'bg-red-500/20 text-red-400 hover:bg-red-500 hover:text-white border border-red-500/30 shadow-lg shadow-red-500/20'
                                    : 'bg-slate-700/30 text-slate-600 border border-slate-700/50 cursor-not-allowed opacity-50'
                                    }`}
                                title={blocks.some(b => b.selected) ? "Vymazať vybraté" : "Najprв vyberte položky kliknutím na ne"}
                            >
                                <TrashIcon className="w-4 h-4" />
                                {blocks.some(b => b.selected) && <span className="text-xs font-bold animate-pulse">{blocks.filter(b => b.selected).length}</span>}
                            </button>

                            <div className="h-6 w-[1px] bg-slate-700 mx-1"></div>
                            <div className="relative">
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="appearance-none bg-slate-900/50 border border-slate-700 rounded-lg py-1.5 px-3 pr-8 text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all cursor-pointer"
                                >
                                    {categories.map(cat => (
                                        <option key={cat} value={cat} className="bg-slate-800">{cat}</option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                                    <svg className="h-3 w-3 fill-current" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                </div>
                            </div>

                            <div className="h-6 w-[1px] bg-slate-700 mx-1"></div>

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
                    <div className="bg-slate-800/40 backdrop-blur-sm rounded-2xl shadow-2xl min-h-[700px] border border-slate-700 flex flex-col transition-all">
                        {/* Paper Header */}
                        <div className="h-12 border-b border-slate-700/50 bg-slate-900/60 flex items-center px-8">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
                            </div>
                        </div>

                        <div className="p-12 md:p-20 space-y-2 flex-grow">
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
                                                    <div className={`rounded-xl overflow-hidden shadow-lg border-2 transition-all ${block.selected ? 'border-blue-500 shadow-blue-500/20' : 'border-slate-700'}`}>
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
                                                    <label className="w-full py-16 border-2 border-dashed border-slate-700 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-700/30 hover:border-blue-500/50 transition-all group/up">
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

                        <div className="h-10 bg-slate-900/50 mt-auto border-t border-slate-700/50 flex items-center px-8 justify-end text-[10px] text-slate-500 font-medium uppercase tracking-widest">
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
                                className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all cursor-pointer hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full active:scale-[0.98]"
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
                                        <div className="mb-4 rounded-xl overflow-hidden shadow-md h-32 w-full relative group/cardimg">
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
                                <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-between items-center">
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
                        <div className="col-span-full py-20 text-center bg-slate-800/20 rounded-2xl border border-dashed border-slate-700">
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
                return <TestsContentPage beigeTextColor={beigeTextColor} onUpdate={() => loadStats(currentUser.id)} setModal={setModal} />;
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
                    <button onClick={() => { setCurrentPage('notes'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'notes' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><NoteIcon className="mr-3 text-current" /> Poznámky</button>
                    <button onClick={() => { setCurrentPage('settings'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'settings' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><CogIcon className="mr-3 text-current" /> Nastavenia</button>
                    <button onClick={() => { setCurrentPage('contacts'); setSidebarOpen(false); }} className={`w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium ${currentPage === 'contacts' ? 'bg-blue-600 shadow-lg text-white' : 'hover:bg-slate-700/70 text-slate-300'}`}><EnvelopeIcon className="mr-3 text-current" /> Kontakty</button>
                    <button
                        onClick={() => {
                            EventBus.dispatch("logout");
                            setRedirect("/home");
                        }}
                        className="w-full text-left flex items-center p-3 rounded-lg transition-all duration-200 font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300"
                    >
                        <LogoutIcon className="mr-3" /> Odhlásiť sa
                    </button>
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

            {/* Confirmation Modal */}
            {modal.show && (
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
            )}
        </div>
    );
};

const ProfileOverview = ({ currentUser, stats, statsLoading, beigeTextColor, onViewClassmates, classmatesLoading, profileImage }) => {

    const calculateOverallProgress = () => {
        if (!stats || statsLoading) return 0;
        const totalMaterials = (stats?.lectureStats?.total ?? 0) + (stats?.seminarStats?.total ?? 0);
        const completedMaterials = (stats?.lectureStats?.completed ?? 0) + (stats?.seminarStats?.completed ?? 0);
        if (totalMaterials === 0) return 0;
        return Math.round((completedMaterials / totalMaterials) * 100);
    };

    return (
        <div className="space-y-8">
            <header className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold tracking-wide mb-6 pb-6 border-b border-slate-700" style={{ color: beigeTextColor }}>
                    Môj profil
                </h2>
                <div className="flex items-start justify-start gap-8">
                    {/* Profile picture */}
                    <div className="relative shrink-0 transition-transform duration-300 hover:scale-105">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-blue-600/30 shadow-2xl">
                            {profileImage ? (
                                <img
                                    src={profileImage}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = '/images/default-avatar.svg'; }}
                                />
                            ) : (
                                <img src="/images/default-avatar.svg" alt="" className="w-full h-full object-cover" />
                            )}
                        </div>
                    </div>
                    {/* User details */}
                    <div className="flex-1 min-w-0">
                        <div className="inline-flex flex-col items-center">
                            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-center w-full" style={{ color: beigeTextColor }}>
                                {currentUser.username}
                            </h1>
                            <p className="mt-1 text-lg text-slate-400 font-medium text-center w-full">
                                {currentUser.email}
                            </p>
                            <div className="mt-6">
                                <button
                                    onClick={onViewClassmates}
                                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-900/40 hover:bg-blue-700 hover:shadow-blue-500/30 transition-all duration-200 active:scale-95 flex items-center gap-2"
                                    disabled={classmatesLoading}
                                >
                                    <FriendsIcon className="w-5 h-5 text-blue-100" />
                                    {classmatesLoading ? 'Načítava sa...' : 'Moji spolužiaci'}
                                </button>
                            </div>
                        </div>
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

const SettingsContent = ({ currentUser, beigeTextColor, profileImage, onImageChange }) => {
    const fileInputRef = useRef(null);
    const [newUsername, setNewUsername] = useState(currentUser?.username || "");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userLoading, setUserLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handlePhotoClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onImageChange(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsError(false);
        setUserLoading(true);

        if (!newUsername || newUsername.trim() === "") {
            setMessage("Chyba: Používateľské meno nemôže byť prázdne.");
            setIsError(true);
            setUserLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/users/${currentUser.id}/username`, {
                method: "PUT",
                headers: {
                    ...authHeader(),
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username: newUsername }),
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(data.message || "Meno bolo úspešne zmenené!");
                // Update localStorage
                const user = JSON.parse(localStorage.getItem("user"));
                user.username = newUsername;
                localStorage.setItem("user", JSON.stringify(user));
                // We reload to sync all components
                setTimeout(() => window.location.reload(), 1500);
            } else {
                setMessage(data.message || "Nepodarilo sa zmeniť meno.");
                setIsError(true);
            }
        } catch (error) {
            setMessage(`Chyba: ${error.message}`);
            setIsError(true);
        } finally {
            setUserLoading(false);
        }
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
        <div className="space-y-10 w-full">
            <header>
                <h2 className="text-3xl font-bold tracking-tight" style={{ color: beigeTextColor }}>Nastavenia a profil</h2>
            </header>

            {/* Main Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Column 1: Photo & Username */}
                <div className="space-y-6">
                    {/* Compact Profile Photo */}
                    <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        <div className="flex items-center gap-6">
                            <div className="relative group shrink-0">
                                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-4 border-blue-600/30 shadow-2xl relative transition-transform duration-300 group-hover:scale-105">
                                    {profileImage ? (
                                        <img
                                            src={profileImage}
                                            alt=""
                                            className="w-full h-full object-cover"
                                            onError={(e) => { e.target.src = '/images/default-avatar.svg'; }}
                                        />
                                    ) : (
                                        <img src="/images/default-avatar.svg" alt="" className="w-full h-full object-cover" />
                                    )}
                                </div>
                                <button
                                    onClick={handlePhotoClick}
                                    className="absolute -bottom-1 -right-1 bg-blue-600 p-2 rounded-full shadow-lg border-2 border-slate-800 hover:bg-blue-500 transition-all duration-200 active:scale-90"
                                >
                                    <CameraIcon className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold mb-3 flex items-center text-blue-400">
                                    <CameraIcon className="w-5 h-5 mr-2" />
                                    Foto profilu
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        onClick={handlePhotoClick}
                                        className="px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all active:scale-95"
                                    >
                                        Zmeniť
                                    </button>
                                    {profileImage && (
                                        <button
                                            onClick={() => onImageChange(null)}
                                            className="px-4 py-2 bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-600 hover:bg-slate-600 transition-all active:scale-95"
                                        >
                                            Odstrániť
                                        </button>
                                    )}
                                </div>
                                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                            </div>
                        </div>
                    </div>

                    {/* Compact Username Change */}
                    <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 shadow-xl backdrop-blur-sm">
                        <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                            <UserCircleIcon className="w-5 h-5 mr-2" />
                            Meno používateľa
                        </h3>
                        <form onSubmit={handleUsernameUpdate} className="space-y-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové meno</label>
                                <input
                                    type="text"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                    placeholder="Zadajte nové meno"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={userLoading}
                                className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-95 flex items-center justify-center gap-2 ${userLoading ? 'opacity-50' : 'hover:bg-blue-700'}`}
                            >
                                {userLoading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Ukladá sa...
                                    </>
                                ) : "Uložiť zmenu mena"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Column 2: Password Change */}
                <div className="bg-slate-800/40 border border-slate-700 rounded-3xl p-6 shadow-xl backdrop-blur-sm flex flex-col">
                    <h3 className="text-lg font-bold mb-4 flex items-center text-blue-400">
                        <KeyIcon className="w-5 h-5 mr-3" />
                        Zmeniť heslo
                    </h3>

                    {message && (
                        <div className={`p-3 mb-4 rounded-xl text-xs font-medium flex items-center gap-2 border ${isError ? 'bg-red-900/20 text-red-300 border-red-500/30' : 'bg-green-900/20 text-green-300 border-green-500/30'}`}>
                            {isError ? <ExclamationTriangleIcon className="w-4 h-4" /> : <CheckCircleIcon className="w-4 h-4" />}
                            {message}
                        </div>
                    )}

                    <form onSubmit={handlePasswordUpdate} className="grid grid-cols-1 gap-4 flex-1">
                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Aktuálne heslo</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Současné heslo"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                    required
                                />
                                <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-white">
                                    {showPassword ? <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg> : <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zM9.5 6.5a3.5 3.5 0 00-3.5 3.5a.5.5 0 01-1 0a4.5 4.5 0 014.5-4.5a.5.5 0 010 1zM10.928 9.072a.5.5 0 01.527.527l-4.288 4.288a.5.5 0 01-.527-.527l4.288-4.288z" clipRule="evenodd" /></svg>}
                                </button>
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Nové heslo</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Min. 6 znakov"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-500 uppercase tracking-wider">Potvrdenie</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Zopakujte hesло"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-xl border bg-slate-900/50 border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100 text-sm transition-all"
                                required
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-blue-600 text-white font-bold py-3 rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 ${loading ? 'opacity-50' : 'hover:bg-blue-700'}`}
                            >
                                {loading ? "Aktualizuje sa..." : "Zmeniť heslo"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
        <div className="space-y-10">
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
        </div>
    );
};

export default Profile;