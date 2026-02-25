import React, { useState, useEffect } from "react";
import authHeader from "../../services/auth-header";
import { DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon } from "../common/ProfileIcons";

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
        if (!res.ok) throw new Error("Nepodarilo sa načíтаť dokončené materiály.");
        return await res.json();
    } catch (error) {
        console.error("Chyba pri načítaní dokončených materiálov:", error);
        throw error;
    }
};

const MaterialSection = ({ title, materials, completedMaterials, onMarkAsCompleted }) => (
    <div className="space-y-4">
        <h3 className="text-xl font-bold flex items-center text-blue-400">
            <DocumentTextIcon className="mr-3 h-6 w-6" /> {title}
        </h3>
        <div className="space-y-3">
            {materials.length === 0 ? (
                <p className="text-slate-500 italic">Žiadne materiály v tejto kategórii.</p>
            ) : (
                materials.map(material => (
                    <div
                        key={material.id}
                        className="group bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 hover:border-slate-500 transition-all duration-300 shadow-lg"
                    >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                            <div className="flex-1">
                                <h4 className="font-bold text-slate-200 text-lg mb-1 group-hover:text-white transition-colors">
                                    {material.title}
                                </h4>
                                <p className="text-slate-400 text-sm line-clamp-1">{material.description}</p>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                                {material.fileUrl && (
                                    <a
                                        href={material.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold rounded-xl transition-all active:scale-95 flex items-center gap-2 group/btn"
                                    >
                                        <svg className="w-3.5 h-3.5 group-hover/btn:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                        Zobraziť
                                    </a>
                                )}
                                {completedMaterials.has(material.id) ? (
                                    <button
                                        disabled
                                        className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-xl flex items-center gap-2"
                                    >
                                        <CheckCircleIcon className="h-4 w-4" />
                                        Hotovo
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => onMarkAsCompleted(material.id)}
                                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-2"
                                    >
                                        Hotovo?
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
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

export default LearningContent;
export { fetchMaterials };
