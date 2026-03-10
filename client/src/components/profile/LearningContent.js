import React, { useState, useEffect } from "react";
import authHeader from "../../services/auth-header";
import { FileIcon, CheckCircleIcon, ExclamationTriangleIcon } from "../common/ProfileIcons";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

const fetchMaterials = async () => {
    try {
        const res = await fetch(`${API_URL}/api/materials`, { headers: authHeader() });
        if (!res.ok) throw new Error("Nepodarilo sa načítať materiály.");
        return await res.json();
    } catch (error) {
        console.error("Chyba pri načítaní materiálov:", error);
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
};

const MaterialSection = ({ title, materials, completedMaterials, onMarkAsCompleted, accentColor }) => {
    return (
        <div className="space-y-4 sm:space-y-6 flex-1 min-w-0">
            <h3 className="hidden sm:flex text-2xl font-bold text-slate-200 pb-3 border-b border-slate-700/50 items-center gap-3">
                <span className={`w-2 h-7 rounded-full ${accentColor}`}></span>
                {title}
            </h3>
            <div className="space-y-3 sm:space-y-4">
                {materials.length === 0 ? (
                    <p className="text-slate-500 italic text-sm py-8 text-center bg-[#0f172a]/20 rounded-2xl border border-dashed border-white/5">Žiadne materiály v tejto sekcii.</p>
                ) : (
                    materials.map(material => {
                        const materialUrl = material.url || material.fileUrl;
                        const fullUrl = materialUrl ? (materialUrl.startsWith('http') ? materialUrl : `${API_URL}/uploads/${materialUrl.startsWith('/') ? materialUrl.substring(1) : materialUrl}`) : null;
                        const isCompleted = completedMaterials.has(material.id);

                        return (
                            <div
                                key={material.id}
                                className="group relative bg-[#0f172a]/40 backdrop-blur-md border border-white/5 rounded-2xl px-4 py-8 sm:px-5 sm:py-8 transition-all duration-300 hover:bg-[#15203d]/60 hover:border-white/10 shadow-xl overflow-hidden"
                            >
                                <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block`} />

                                <div className="flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                                        <div className="p-2 sm:p-2.5 bg-slate-700/30 rounded-xl group-hover:bg-slate-700/50 transition-colors shrink-0">
                                            <FileIcon className="h-5 w-5 sm:h-6 sm:w-6 text-slate-400" />
                                        </div>
                                        {fullUrl ? (
                                            <a
                                                href={fullUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="font-bold text-slate-200 text-sm sm:text-lg hover:text-blue-400 transition-colors truncate"
                                            >
                                                {material.title}
                                            </a>
                                        ) : (
                                            <span className="font-bold text-slate-200 text-sm sm:text-lg truncate">
                                                {material.title}
                                            </span>
                                        )}
                                    </div>

                                    <div className="shrink-0">
                                        {isCompleted ? (
                                            <div className="px-3 py-1.5 sm:px-6 sm:py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl flex items-center gap-1.5">
                                                <CheckCircleIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                                                Prečítané
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => onMarkAsCompleted(material.id)}
                                                className="px-3 py-1.5 sm:px-4 sm:py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-xs font-black uppercase tracking-wider rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 whitespace-nowrap"
                                            >
                                                Označiť ako prečítané
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

const LearningContent = ({ beigeTextColor, onUpdate, setModal }) => {
    const [materials, setMaterials] = useState([]);
    const [completedMaterials, setCompletedMaterials] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('lecture'); // 'lecture' or 'seminar'

    useEffect(() => {
        const loadData = async () => {
            try {
                const [materialsData, completedIdsData] = await Promise.all([
                    fetchMaterials(),
                    fetchCompletedMaterialIds()
                ]);

                // Sort materials descending by ID so newest (e.g. 12th) appear at the top
                const sortedMaterials = materialsData.sort((a, b) => b.id - a.id);
                setMaterials(sortedMaterials);
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
        <div className="space-y-6 sm:space-y-10 max-w-[1600px] mx-auto animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight" style={{ color: beigeTextColor }}>
                    Učebné materiály
                </h2>

                {/* Mobile Tab Switcher */}
                <div className="flex sm:hidden bg-slate-900/50 p-1 rounded-xl border border-white/5 shadow-inner">
                    <button
                        onClick={() => setActiveTab('lecture')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'lecture' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Prednášky
                    </button>
                    <button
                        onClick={() => setActiveTab('seminar')}
                        className={`flex-1 py-1.5 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'seminar' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                        Cvičenia
                    </button>
                </div>
            </div>

            {/* Desktop View (Side by Side) */}
            <div className="hidden sm:flex flex-row gap-8 lg:gap-12">
                <MaterialSection
                    title="Prednášky"
                    materials={lectures}
                    completedMaterials={completedMaterials}
                    onMarkAsCompleted={handleMarkAsCompleted}
                    accentColor="bg-blue-500"
                />
                <MaterialSection
                    title="Cvičenia"
                    materials={seminars}
                    completedMaterials={completedMaterials}
                    onMarkAsCompleted={handleMarkAsCompleted}
                    accentColor="bg-blue-500"
                />
            </div>

            {/* Mobile View (Filtered by Active Tab) */}
            <div className="block sm:hidden animate-fade-in">
                {activeTab === 'lecture' ? (
                    <MaterialSection
                        title="Prednášky"
                        materials={lectures}
                        completedMaterials={completedMaterials}
                        onMarkAsCompleted={handleMarkAsCompleted}
                        accentColor="bg-blue-500"
                    />
                ) : (
                    <MaterialSection
                        title="Cvičenia"
                        materials={seminars}
                        completedMaterials={completedMaterials}
                        onMarkAsCompleted={handleMarkAsCompleted}
                        accentColor="bg-blue-500"
                    />
                )}
            </div>
        </div>
    );
};

export default LearningContent;
export { fetchMaterials };
