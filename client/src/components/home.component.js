import React, { Component } from "react";
import './home.component.css';

const GraduationCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-blue-400">
        <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.084a1 1 0 0 0 0 1.838l8.57 3.908a2 2 0 0 0 1.66 0z"/>
        <path d="M22 10v6"/>
        <path d="M6 12v5a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3v-5"/>
    </svg>
);

const CheckCircleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-blue-400">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
);

const ListOrderedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-blue-400">
        <line x1="10" x2="21" y1="6" y2="6"/>
        <line x1="10" x2="21" y1="12" y2="12"/>
        <line x1="10" x2="21" y1="18" y2="18"/>
        <path d="M4 6h1v4"/>
        <path d="M4 10h2"/>
        <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/>
    </svg>
);

export default class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
        };

        this.courseData = {
            title: "BEZPEČNOSŤ TELEKOMUNIKAČNÝCH SYSTÉMOV, SIETÍ A SLUŽIEB",
            intro: "Predmet sa zaoberá prehľadom kryptografických systémov, sieťovou bezpečnosťou, bezpečnostnými protokolmi, bezpečnosťou počítačových sietí a informačných systémov, bezpečnosťou sietí NGN, sietí IMS, A-IMS a cloud computingu, bezpečnosťou bezdrôtových sietí, bezpečnosťou mobilných sietí, bezpečnosťou sietí MANET a VANET a bezpečnosťou služieb a aplikácií.",
            conditions: {
                title: "Podmienky na absolvovanie predmetu",
                text: "V priebehu semestra budú písomná previerka s bodovým ohodnotením 10 bodov a zadanie s bodovým ohodnotením maximálne 10 bodov. Študent môže získať maximálne 40 bodov z cvičení a 60 bodov zo skúšky. Na získanie zápočtu musí študent získať minimálne 20 bodov. Výsledné hodnotenie študenta bude stanovené na základe počtu získaných bodov podľa klasifikačnej stupnice uvedenej v Študijnom poriadku STU."
            },
            outcomes: {
                title: "Výsledky vzdelávania",
                text: "Absolvent predmetu získa komplexný prehľad o bezpečnostných hrozbách a mechanizmoch v moderných telekomunikačných systémoch. Bude schopný analyzovať, navrhovať a implementovať bezpečnostné riešenia pre rôzne typy sietí a služieb, od klasických počítačových sietí až po cloudové platformy a mobilné siete 5G."
            },
            syllabus: {
                title: "Stručná osnova predmetu",
                items: [
                    "Základné pojmy bezpečnosti, kryptografické systémy",
                    "Sieťová bezpečnosť (firewally, DMZ, IDPS, VPN, Honeypoty)",
                    "Bezpečnostné protokoly (IPSec, SSH), riadenie prístupu",
                    "Bezpečnosť počítačových sietí, bezpečnosť informačných systémov",
                    "Bezpečnosť sietí NGN",
                    "Bezpečnosť sietí IMS a A-IMS",
                    "Bezpečnosť cloud computingu",
                    "Bezpečnosť bezdrôtových sietí Wi-Fi, Bluetooth a WiMAX",
                    "Bezpečnosť bezdrôtových sietí ZigBee a Z-wave",
                    "Bezpečnosť mobilných sietí GSM, UMTS, LTE a 5G",
                    "Bezpečnosť sietí MANET a VANET",
                    "Bezpečnosť služieb a aplikácií, bezpečnosť webových stránok.",
                ]
            }
        };
    }

    render() {
        const beigeTextColor = '#F5F5DC';

        return (
            <div className="bg-slate-900 text-slate-200 min-h-screen font-sans antialiased">
                <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">

                    <header className="text-center mb-16">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight" style={{ color: beigeTextColor }}>
                            {this.courseData.title}
                        </h1>
                        <p className="mt-6 max-w-3xl mx-auto text-lg" style={{ color: beigeTextColor }}>
                            {this.courseData.intro}
                        </p>
                    </header>

                    <main className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 transition hover:border-blue-500/50">
                            <h2 className="text-2xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                                <CheckCircleIcon />
                                {this.courseData.conditions.title}
                            </h2>
                            <p className="leading-relaxed" style={{ color: beigeTextColor }}>
                                {this.courseData.conditions.text}
                            </p>
                        </section>

                        <section className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 transition hover:border-blue-500/50">
                            <h2 className="text-2xl font-bold flex items-center mb-4" style={{ color: beigeTextColor }}>
                                <GraduationCapIcon />
                                {this.courseData.outcomes.title}
                            </h2>
                            <p className="leading-relaxed" style={{ color: beigeTextColor }}>
                                {this.courseData.outcomes.text}
                            </p>
                        </section>

                        <section className="md:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 transition hover:border-blue-500/50">
                            <h2 className="text-2xl font-bold flex items-center mb-6" style={{ color: beigeTextColor }}>
                                <ListOrderedIcon />
                                {this.courseData.syllabus.title}
                            </h2>
                            <ul className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                                {this.courseData.syllabus.items.map((item, index) => (
                                    <li key={index} className="flex items-start" style={{ color: beigeTextColor }}>
                                        <span className="text-blue-400 font-semibold mr-3">{index + 1}.</span>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                    </main>

                    <footer className="text-center mt-16 text-sm" style={{ color: beigeTextColor }}>
                        <p>Katedra telekomunikácií a multimédií | FEI STU</p>
                    </footer>

                </div>
            </div>
        );
    }
}