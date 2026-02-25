import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";
import heic2any from "heic2any";
import { UserIcon } from '../common/ProfileIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

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

export default ClassmatesModal;
