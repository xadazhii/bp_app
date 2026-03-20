import React from 'react';
import { UploadIcon, PlusCircleIcon, TrashIcon, RotateCcw } from './AdminIcons';

export const StudentListUpload = ({ adminCtx }) => {
    const {
        uploadingStudentList, allowedStudents, newAllowedStudentEmail, addingAllowedStudent, deletingAllowedStudentEmail, selectedStudentFile
    } = adminCtx.state;

    return (<div className="space-y-8 animate-fade-in pb-12">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex-1 min-w-0">
                                        <h2 className="text-3xl font-bold text-blue-400 truncate">Registrácia študentov</h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                                    {}
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

                                        <form onSubmit={adminCtx.handleStudentListUpload} className="space-y-6" encType="multipart/form-data">
                                            <div className="relative group/file">
                                                <input
                                                    type="file"
                                                    name="studentFile"
                                                    accept=".pdf"
                                                    onChange={adminCtx.handleStudentFileChange}
                                                    className="w-full text-slate-100 file:mr-4 file:py-2.5 file:px-6 file:rounded-2xl file:border-0 file:text-xs file:font-black file:uppercase file:tracking-widest file:bg-blue-600 file:text-white hover:file:bg-blue-500 transition-all cursor-pointer bg-[#0f172a]/40 border border-white/5 p-2 rounded-2xl"
                                                    required
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={!selectedStudentFile || uploadingStudentList}
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

                                    {}
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

                                        <form onSubmit={adminCtx.handleAddAllowedStudent} className="space-y-4">
                                            <div className="relative">
                                                <input
                                                    type="email"
                                                    placeholder="Zadajte e-mail študenta..."
                                                    value={newAllowedStudentEmail}
                                                    onChange={adminCtx.handleAllowedStudentEmailChange}
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
                                    <div className="px-6 py-3 border-b border-white/5 bg-[#0f172a]/20 flex justify-between items-center">
                                        <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
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
                                                                    onClick={() => adminCtx.handleDeleteAllowedStudent(student.email)}
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
                            </div>);
};
