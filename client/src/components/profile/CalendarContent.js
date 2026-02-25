import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import authHeader from "../../services/auth-header";
import heic2any from "heic2any";
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";


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

export default CalendarContent;
