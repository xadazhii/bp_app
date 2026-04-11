import React from 'react';
import { CalendarIcon, ExclamationTriangleIcon } from './AdminIcons';

export const SemesterSettings = ({ adminCtx }) => {
    const { semesterStartDate } = adminCtx.state;

    return (
        <div className="space-y-8 animate-fade-in">
            <h2 className="text-3xl font-bold mb-6 text-blue-400">Nastavenia semestra</h2>
            <div className="mb-10 p-6 border border-white/5 rounded-2xl bg-slate-800/10 backdrop-blur-sm">
                <h3 className="text-2xl font-semibold mb-4 text-blue-400 flex items-center">
                    <CalendarIcon className="mr-2 text-current" /> Termíny a týždne
                </h3>
                <form onSubmit={adminCtx.handleDateSave} className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        <label className="text-slate-300 font-medium">Začiatok semestra:</label>
                        <input
                            type="date"
                            value={semesterStartDate ? semesterStartDate.split('T')[0] : ""}
                            onChange={e => adminCtx.setState({ semesterStartDate: e.target.value })}
                            className="w-full sm:w-auto px-4 py-2 rounded-lg border bg-[#0f172a] border-white/5 focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-100"
                        />
                        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg shadow-md transition-all active:scale-95">Uložiť</button>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aktuálny stav</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-lg">
                                        {adminCtx.getCurrentWeek() === 0
                                            ? "Semester ešte nezačal"
                                            : adminCtx.getCurrentWeek() === 14
                                            ? "Koniec semestra"
                                            : `${adminCtx.getCurrentWeek()}. týždeň`}
                                    </span>
                                    <span className={`w-1.5 h-1.5 rounded-full ${
                                        adminCtx.getCurrentWeek() === 0 ? "bg-yellow-500" :
                                        adminCtx.getCurrentWeek() === 14 ? "bg-red-500" :
                                        "bg-emerald-500"
                                    } animate-pulse`}></span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-start gap-2 max-w-md bg-amber-500/10 border border-amber-500/20 p-3 rounded-xl">
                            <ExclamationTriangleIcon className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                            <p className="text-[10px] text-amber-200/70 leading-relaxed font-medium">
                                Zmena dátumu <strong className="text-amber-400">vymaže všetky testy a pokrok</strong> študentov v tomto semestri!
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};