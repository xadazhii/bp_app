import React from 'react';
import { UploadIcon, PlusCircleIcon, TrashIcon } from './AdminIcons';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export const MaterialManagement = ({ adminCtx, filteredLectures, filteredSeminars, beigeTextColor }) => {
    const {
        newMaterial
    } = adminCtx.state;

    return (<div className="space-y-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa materiálov</h2>
                                <div className="mb-10 p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                    <h3 className="text-2xl font-semibold mb-4 flex items-center" style={{ color: beigeTextColor }}>
                                        <UploadIcon className="mr-2 text-blue-400" /> Pridať nový materiál
                                    </h3>
                                    <form onSubmit={adminCtx.handleAddMaterial} className="space-y-4" encType="multipart/form-data">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                type="text"
                                                placeholder="Názov"
                                                value={newMaterial.title}
                                                onChange={(e) =>
                                                    adminCtx.setState({ newMaterial: { ...newMaterial, title: e.target.value } })
                                                }
                                                className="w-full px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                                                required
                                            />
                                            <label className="flex items-center w-full">
                                                <select
                                                    value={newMaterial.weekNumber}
                                                    onChange={(e) =>
                                                        adminCtx.setState({ newMaterial: { ...newMaterial, weekNumber: parseInt(e.target.value) } })
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
                                                    adminCtx.setState({ newMaterial: { ...newMaterial, type: e.target.value } })
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
                                                    adminCtx.setState({ newMaterial: { ...newMaterial, file: e.target.files[0] } })
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
                                        <div className="space-y-3">
                                            {filteredLectures.length === 0 ? (
                                                <div className="text-center py-6 bg-[#0f172a]/30 rounded-2xl border border-white/5">
                                                    <p className="text-slate-400 text-sm italic">Zatiaľ žiadne prednášky.</p>
                                                </div>
                                            ) : (
                                                filteredLectures.map((material) => (
                                                    <div key={material.id} className="bg-[#0f172a]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-all duration-300 hover:border-blue-500/30 hover:bg-[#15203d]/40 shadow-lg">
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h5 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">
                                                                    {material.title}
                                                                </h5>
                                                                {![0, 13, 14].includes(material.weekNumber || 0) && (
                                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                                        {material.weekNumber}. týždeň
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <a
                                                                href={material.url ? (material.url.startsWith('http') ? material.url : `${API_URL}/uploads/${material.url}`) : '#'}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600/10 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-blue-500/20"
                                                            >
                                                                Stiahnuť
                                                            </a>
                                                            <button
                                                                onClick={() => adminCtx.handleDeleteMaterial(material.id)}
                                                                className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white p-1.5 rounded-xl transition-all duration-200 border border-rose-500/10 shadow-sm"
                                                                title="Odstrániť materiál"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-6 border border-white/5 rounded-2xl bg-[#0f172a]/50">
                                        <h4 className="text-lg font-semibold mb-4 text-blue-400">Cvičenia</h4>
                                        <div className="space-y-3">
                                            {filteredSeminars.length === 0 ? (
                                                <div className="text-center py-6 bg-[#0f172a]/30 rounded-2xl border border-white/5">
                                                    <p className="text-slate-400 text-sm italic">Zatiaľ žiadne cvičenia.</p>
                                                </div>
                                            ) : (
                                                filteredSeminars.map((material) => (
                                                    <div key={material.id} className="bg-[#0f172a]/60 backdrop-blur-sm border border-white/5 rounded-2xl p-4 flex items-center justify-between group transition-all duration-300 hover:border-blue-500/30 hover:bg-[#15203d]/40 shadow-lg">
                                                        <div className="flex items-center gap-4 min-w-0">
                                                            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0 group-hover:scale-110 transition-transform">
                                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                                </svg>
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h5 className="text-white font-bold truncate group-hover:text-blue-400 transition-colors uppercase tracking-tight text-sm">
                                                                    {material.title}
                                                                </h5>
                                                                {![0, 13, 14].includes(material.weekNumber || 0) && (
                                                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                                                        {material.weekNumber}. týždeň
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 shrink-0">
                                                            <a
                                                                href={material.url ? (material.url.startsWith('http') ? material.url : `${API_URL}/uploads/${material.url}`) : '#'}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="bg-blue-600/10 hover:bg-blue-600 text-blue-300 hover:text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 border border-blue-500/20"
                                                            >
                                                                Stiahnuť
                                                            </a>
                                                            <button
                                                                onClick={() => adminCtx.handleDeleteMaterial(material.id)}
                                                                className="bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white p-1.5 rounded-xl transition-all duration-200 border border-rose-500/10 shadow-sm"
                                                                title="Odstrániť materiál"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>);
};
