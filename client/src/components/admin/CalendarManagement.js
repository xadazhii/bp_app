import React from 'react';
import { PlusCircleIcon, TrashIcon } from './AdminIcons';

export const CalendarManagement = ({ adminCtx }) => {
    const {
        calendarEvents, newEvent, addingEvent, deletingEventId
    } = adminCtx.state;

    return (<div className="space-y-8">
                                <h2 className="text-3xl font-bold mb-6 text-blue-400">Správa udalostí</h2>
                                <form onSubmit={adminCtx.handleAddEvent} className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <input
                                        type="date"
                                        value={newEvent.date}
                                        onChange={(e) =>
                                            adminCtx.setState({ newEvent: { ...newEvent, date: e.target.value } })
                                        }
                                        className="px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Správa udalosti"
                                        value={newEvent.message}
                                        onChange={(e) =>
                                            adminCtx.setState({ newEvent: { ...newEvent, message: e.target.value } })
                                        }
                                        className="px-4 py-2 rounded-lg border bg-[#15203d] border-white/5 text-slate-100 flex-1"
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={addingEvent}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <PlusCircleIcon className="w-5 h-5 mr-2" />
                                        {addingEvent ? "Pridávanie..." : "Pridať udalosť"}
                                    </button>
                                </form>
                                <div className="bg-[#15203d]/50 p-4 rounded-2xl border border-white/5">
                                    <h3 className="font-bold text-blue-400 mb-2">Nadchádzajúce udalosti:</h3>
                                    <ul className="space-y-2">
                                        {calendarEvents.length === 0 ? (
                                            <li className="text-slate-400">Žiadne udalosti.</li>
                                        ) : (
                                            calendarEvents
                                                .filter(ev => ev.eventDate)
                                                .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))
                                                .map(ev => {
                                                    const dateParts = ev.eventDate.split("-");
                                                    const localDate =
                                                        dateParts.length === 3
                                                            ? new Date(dateParts[0], dateParts[1] - 1, dateParts[2])
                                                            : new Date(NaN);
                                                    return (
                                                        <li
                                                            key={ev.id}
                                                            className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-lg transition-all duration-200 bg-blue-900/20 border-l-4 border-blue-500"
                                                        >
                                                            <div>
                                                                <span className="font-bold text-blue-400">
                                                                    {isNaN(localDate)
                                                                        ? "Neplatný dátum"
                                                                        : localDate.toLocaleDateString("sk-SK", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        })}
                                                                </span>
                                                                <span className="ml-2 text-sm text-gray-100">{ev.message}</span>
                                                            </div>
                                                            <button
                                                                onClick={() => adminCtx.handleDeleteEvent(ev.id)}
                                                                disabled={deletingEventId === ev.id}
                                                                className="bg-red-600/90 hover:bg-red-600 text-white font-bold py-1 px-2.5 rounded-lg flex items-center text-[10px] uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 mt-2 sm:mt-0"
                                                            >
                                                                <TrashIcon className="w-3 h-3 mr-1" />
                                                                {deletingEventId === ev.id ? "Odstraňovanie..." : "Odstrániť"}
                                                            </button>
                                                        </li>
                                                    );
                                                })
                                        )}
                                    </ul>
                                </div>
                            </div>);
};
