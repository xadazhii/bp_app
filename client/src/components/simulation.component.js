import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
const TaskIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
);
const RetroClientIcon = () => (
    <svg width="60" height="60" viewBox="0 0 64 64" fill="none">
        <rect x="8" y="6" width="40" height="32" fill="#1e293b" stroke="currentColor" strokeWidth="2"/>
        <rect x="12" y="10" width="32" height="24" fill="#0f172a" stroke="currentColor" strokeWidth="1"/>
        <path d="M8 38L4 52H52L56 38H8Z" fill="#1e293b" stroke="currentColor" strokeWidth="2"/>
        <rect x="42" y="44" width="8" height="2" fill="currentColor"/>
    </svg>
);
const RetroServerIcon = ({ type }) => (
    <svg width="50" height="70" viewBox="0 0 64 80" fill="none">
        <path d="M10 10L26 2H54V64L38 72H10V10Z" fill={type === 'auth' ? "#334155" : "#1e293b"} stroke="currentColor" strokeWidth="2"/>
        <path d="M10 10L26 2V64L10 72V10Z" fill="#0f172a" stroke="currentColor" strokeWidth="1"/>
        {type === 'auth' ? (
            <>
                <rect x="30" y="15" width="16" height="4" fill="#4ade80" />
                <rect x="30" y="25" width="16" height="4" fill="#4ade80" />
            </>
        ) : (
            <>
                <rect x="30" y="12" width="20" height="6" fill="#64748b" stroke="currentColor"/>
                <rect x="30" y="22" width="20" height="6" fill="#64748b" stroke="currentColor"/>
                <rect x="30" y="32" width="20" height="6" fill="#64748b" stroke="currentColor"/>
            </>
        )}
    </svg>
);
const RetroResolverIcon = () => (
    <svg width="70" height="90" viewBox="0 0 64 90" fill="none">
        <rect x="5" y="5" width="54" height="80" rx="4" fill="#1e293b" stroke="currentColor" strokeWidth="2"/>
        <rect x="15" y="15" width="34" height="10" rx="2" fill="#0f172a" stroke="currentColor"/>
        <circle cx="20" cy="20" r="2" fill="currentColor" className="animate-pulse"/>
        <line x1="10" y1="40" x2="54" y2="40" stroke="#334155" strokeWidth="2"/>
        <line x1="10" y1="55" x2="54" y2="55" stroke="#334155" strokeWidth="2"/>
        <line x1="10" y1="70" x2="54" y2="70" stroke="#334155" strokeWidth="2"/>
    </svg>
);
const RetroCloudIcon = () => (
    <svg width="60" height="40" viewBox="0 0 100 60" fill="none">
        <path d="M25 45H15C6.7 45 0 38.3 0 30C0 22.5 5.5 16.2 12.7 15.2C13.8 6.7 21 0 30 0C39.5 0 47.3 7.2 48.4 16.5C51.6 13.7 55.7 12 60 12C71 12 80 21 80 32C80 32.8 79.9 33.6 79.8 34.4C85.6 35.8 90 41 90 47C90 54.2 84.2 60 77 60H25C11.2 60 25 45 25 45Z" fill="#1e293b" stroke="currentColor" strokeWidth="2"/>
    </svg>
);
const GameIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h4m-2-2v4" />
        <circle cx="15" cy="11" r="1" />
        <circle cx="17" cy="13" r="1" />
    </svg>
);
const NetworkIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.5" />
        <path d="M2 12h20" strokeOpacity="0.5" />
        <path d="M12 2v20" strokeOpacity="0.5" />
        <circle cx="12" cy="12" r="3" className="fill-blue-500/20" />
        <circle cx="12" cy="12" r="6" strokeDasharray="4 4" className="animate-spin-slow" style={{animationDuration: '10s'}} />
    </svg>
);
const LabIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M2 12h20" />
        <path d="M2 12l5-5m0 10l-5-5" />
        <path d="M22 12l-5-5m0 10l5-5" />
        <circle cx="12" cy="12" r="4" />
    </svg>
);
const RouterIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-indigo-400">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2v20" strokeOpacity="0.5" />
        <path d="M2 12h20" strokeOpacity="0.5" />
        <path d="M8.5 8.5l7 7" />
        <path d="M8.5 15.5l7-7" />
    </svg>
);
const SwitchIcon = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cyan-400">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <path d="M6 12h12" strokeOpacity="0.5" strokeDasharray="2 2" />
        <circle cx="5" cy="9" r="0.5" fill="currentColor" />
        <circle cx="8" cy="9" r="0.5" fill="currentColor" />
        <circle cx="11" cy="9" r="0.5" fill="currentColor" />
        <circle cx="14" cy="9" r="0.5" fill="currentColor" />
    </svg>
);
const CyberDeviceIcon = ({ type }) => {
    switch (type) {
        case 'pc': return (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-400">
                <rect x="2" y="4" width="20" height="12" rx="2" />
                <path d="M6 20h12" />
                <path d="M12 16v4" />
            </svg>
        );
        case 'server': return (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-purple-400">
                <rect x="2" y="2" width="20" height="8" rx="2" />
                <rect x="2" y="14" width="20" height="8" rx="2" />
                <line x1="6" y1="6" x2="6" y2="6" />
                <line x1="6" y1="18" x2="6" y2="18" />
            </svg>
        );
        case 'firewall': return (
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-400">
                <path d="M4 4h16v16H4z" />
                <path d="M4 12h16" />
                <path d="M12 4v16" />
            </svg>
        );
        case 'router': return <RouterIcon />;
        case 'switch': return <SwitchIcon />;
        default: return null;
    }
};
const PacketIcon = ({ type }) => {
    const color = type === 'malware' ? 'text-red-500' : (type === 'ssh_attack' ? 'text-orange-400' : 'text-green-400');
    return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className={color}>
            <rect x="2" y="6" width="20" height="12" rx="2" />
            <path d="M12 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" fill="white" fillOpacity="0.2"/>
        </svg>
    );
};
const FirewallGameIcon = () => (
    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-orange-500">
        <path d="M4 4h16v16H4z" strokeDasharray="4 4" />
        <path d="M4 12h16" />
        <path d="M12 4v16" />
        <path d="M8 8l8 8" className="text-red-500" />
        <path d="M16 8l-8 8" className="text-red-500" />
    </svg>
);
const ServerGameIcon = ({ health }) => (
    <div className="relative">
        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={health > 50 ? "text-blue-400" : "text-red-400 transition-colors duration-500"}>
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" y1="6" x2="16" y2="6" />
            <line x1="8" y1="18" x2="16" y2="18" />
            <circle cx="12" cy="12" r="2" fill="currentColor" className="animate-pulse" />
        </svg>
        <div className={`absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold w-full text-center ${health < 30 ? 'text-red-500 animate-bounce' : 'text-slate-400'}`}>
            Zdravie: {health}%
        </div>
    </div>
);
const SimWrapper = ({ title, onStart, isRunning, info, children }) => {
    const [showInfo, setShowInfo] = useState(false);
    return (
        <div className="flex flex-col h-full w-full">
            <div className="mb-6 text-center relative z-50">
                <h2 className="text-3xl font-bold text-white mb-2">{title}</h2>
                <div className="flex justify-center items-center gap-4">
                    <button
                        onClick={onStart}
                        disabled={isRunning}
                        className={`px-8 py-2 text-sm font-bold text-white rounded-lg transition-all shadow-lg shadow-blue-600/20 ${isRunning ? 'bg-slate-700 cursor-not-allowed opacity-50' : 'bg-blue-600 hover:bg-blue-500 hover:scale-105'}`}
                    >
                        {isRunning ? "Simulácia beží..." : "Spustiť simuláciu"}
                    </button>
                    <button
                        onClick={() => setShowInfo(!showInfo)}
                        className="w-8 h-8 rounded-full border border-slate-500 text-slate-400 hover:text-white flex items-center justify-center font-bold transition-colors"
                    >?</button>
                </div>
                {showInfo && <div className="absolute top-12 left-1/2 -translate-x-1/2 w-80 bg-slate-800 p-4 rounded border border-slate-600 text-left text-xs text-slate-300 z-50 shadow-xl whitespace-pre-line leading-relaxed">{info}</div>}
            </div>
            {}
            <div className="relative w-full px-4 h-[560px] bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden flex items-center justify-center">
                {children}
            </div>
        </div>
    );
};
const DeviceNode = ({ IconComponent, label, active, color = "blue", subLabel, scale = 1 }) => {
    const colors = {
        cyan: "text-cyan-400 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)] border-cyan-500/50",
        indigo: "text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)] border-indigo-500/50",
        purple: "text-purple-400 drop-shadow-[0_0_15px_rgba(192,132,252,0.5)] border-purple-500/50",
        green: "text-green-400 drop-shadow-[0_0_15px_rgba(74,222,128,0.5)] border-green-500/50",
        orange: "text-orange-400 drop-shadow-[0_0_15px_rgba(251,146,60,0.5)] border-orange-500/50",
        default: "text-slate-600 border-slate-800",
        blue: "text-blue-400 drop-shadow-[0_0_15px_rgba(96,165,250,0.5)] border-blue-500/50"
    };
    return (
        <div className={`flex flex-col items-center gap-2 z-20 relative transition-all duration-[1500ms] ${active ? 'opacity-100' : 'opacity-40'}`} style={{ transform: `scale(${scale})` }}>
            <div className={`
          p-4 rounded-2xl border bg-[#0B1120] transition-all duration-500
          ${active ? (colors[color] || colors.default) : colors.default}
        `}>
                <IconComponent />
            </div>
            <div className="text-center">
            <span className={`block text-xs font-bold tracking-widest uppercase transition-colors duration-500 ${active ? 'text-white' : 'text-slate-600'}`}>
            {label}
            </span>
                {subLabel && <span className="text-[10px] text-slate-500">{subLabel}</span>}
            </div>
        </div>
    );
};
const ArrowLine = ({ active, keepLabel, direction = "right", color = "cyan", label }) => {
    const isRight = direction === "right";
    const neonColor = color === "cyan" ? "#22d3ee" : (color === "green" ? "#4ade80" : "#c084fc");
    const shadowColor = color === "cyan" ? "rgba(34,211,238,0.5)" : (color === "green" ? "rgba(74,222,128,0.5)" : "rgba(192,132,252,0.5)");
    return (
        <div className="relative w-full h-4 flex items-center">
            <div className="w-full h-[2px] bg-slate-800/50 absolute top-1/2 -translate-y-1/2 rounded-full"></div>
            <div className="w-full h-[2px] relative rounded-full overflow-hidden">
                <motion.div
                    initial={{ x: isRight ? "-100%" : "100%" }}
                    animate={{ x: active ? "0%" : (isRight ? "-100%" : "100%") }}
                    transition={{ duration: 0.5, ease: "linear" }}
                    className="w-full h-full absolute top-0 left-0"
                    style={{ backgroundColor: neonColor, boxShadow: active ? `0 0 10px ${shadowColor}` : "none" }}
                />
            </div>
            <div className={`absolute ${isRight ? "-right-1" : "-left-1"} top-1/2 -translate-y-1/2 transition-colors duration-300`}
                 style={{ color: active ? neonColor : (keepLabel ? "#334155" : "#1e293b") }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" style={{ transform: isRight ? "rotate(0deg)" : "rotate(180deg)" }}>
                    <path d="M21 12l-18 12v-24z" />
                </svg>
            </div>
            <div className={`absolute left-1/2 -translate-x-1/2 text-[11px] font-mono font-bold whitespace-nowrap px-2 rounded bg-[#0B1120] border border-slate-700/50 transition-opacity duration-500 z-50 ${isRight ? "-top-5" : "-bottom-5"} ${(active || keepLabel) ? "opacity-100" : "opacity-0"}`}
                 style={{ color: neonColor }}>
                {label}
            </div>
        </div>
    );
};
const BiDirectionalConnection = ({ activeRequest, keepRequest, activeResponse, keepResponse, labelRequest, labelResponse, rotateClass = "", width = "w-full" }) => {
    return (
        <div className={`absolute left-0 flex flex-col gap-1 justify-center origin-left ${rotateClass} ${width}`} style={{ pointerEvents: 'none' }}>
            <ArrowLine active={activeRequest} keepLabel={keepRequest} direction="right" color="cyan" label={labelRequest} />
            <ArrowLine active={activeResponse} keepLabel={keepResponse} direction="left" color="green" label={labelResponse} />
        </div>
    );
};
const PacketFlow = ({ active, direction = "right", label, color = "cyan", speed = 1.5 }) => {
    const colors = {
        cyan: "bg-cyan-400 shadow-[0_0_10px_#22d3ee]",
        purple: "bg-purple-400 shadow-[0_0_10px_#c084fc]",
        green: "bg-green-400 shadow-[0_0_10px_#4ade80]",
        yellow: "bg-yellow-400 shadow-[0_0_10px_#facc15]",
        orange: "bg-orange-400 shadow-[0_0_10px_#fb923c]"
    };
    const textColors = {
        cyan: "text-cyan-300",
        purple: "text-purple-300",
        green: "text-green-300",
        yellow: "text-yellow-300",
        orange: "text-orange-300"
    };
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            {}
            <div className="w-full h-[2px] bg-slate-800 relative rounded-full overflow-hidden max-w-[80%]">
                {active && (
                    <motion.div
                        initial={{ x: direction === "right" ? "-100%" : "100%" }}
                        animate={{ x: direction === "right" ? "100%" : "-100%" }}
                        transition={{ duration: speed, ease: "easeInOut" }}
                        className={`w-1/3 h-full absolute top-0 ${colors[color]}`}
                    />
                )}
            </div>
            {}
            <div className={`
                absolute bg-[#0f172a] px-3 py-1 rounded border border-slate-600 
                text-[10px] font-bold uppercase tracking-wider 
                transition-all duration-500 z-50 shadow-lg
                ${active ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} 
                ${textColors[color]}
            `}>
                {label}
            </div>
        </div>
    );
};
const SimDNS = () => {
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    useEffect(() => {
        if (!isRunning) return;
        setStep(1);
        const timeline = [
            { s: 2, t: 1500 }, { s: 3, t: 3000 }, { s: 4, t: 4500 }, { s: 5, t: 6000 },
            { s: 6, t: 7500 }, { s: 7, t: 9000 }, { s: 8, t: 10500 }, { s: 9, t: 12000 }
        ];
        const timers = timeline.map(item => setTimeout(() => setStep(item.s), item.t));
        return () => timers.forEach(clearTimeout);
    }, [isRunning]);
    const handleStart = () => {
        setStep(0);
        setTimeout(() => setIsRunning(true), 100);
    };
    return (
        <SimWrapper title="DNS Lookup" onStart={handleStart} isRunning={isRunning && step < 9} info="Celý cyklus: Dopyt -> Rekurzia -> Odpoveď">
            <div className="w-full h-[520px] max-w-6xl grid grid-cols-[1fr_2.5fr_1fr] gap-4 items-center relative p-8">
                <DeviceNode IconComponent={RetroClientIcon} label="Client" active={step === 1 || step >= 8} color={step >= 8 ? "green" : "cyan"} subLabel={step >= 8 ? "IP: 142.250.1.1" : "google.com?"} />
                <div className="relative h-[450px] w-full">
                    <div className="absolute left-[-2%] top-1/2 -translate-y-1/2 w-[35%] h-12 flex items-center z-0">
                        <BiDirectionalConnection activeRequest={step === 1} keepRequest={step >= 1} activeResponse={step === 8} keepResponse={step >= 8} labelRequest="DNS Query" labelResponse="IP Address" />
                    </div>
                    <div className="absolute left-[48%] top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 p-2">
                        <DeviceNode IconComponent={RetroResolverIcon} label="Resolver" active={step >= 2 && step <= 7} color="indigo" subLabel="ISP / Recursive" />
                    </div>
                    <div className="absolute top-[25%] left-[60%] w-[40%] origin-left -rotate-[15deg]"><BiDirectionalConnection activeRequest={step === 2} keepRequest={step >= 2} activeResponse={step === 3} keepResponse={step >= 3} labelRequest="Where is .com?" labelResponse="Ask TLD" /></div>
                    <div className="absolute top-[50%] left-[65%] w-[35%] -translate-y-1/2"><BiDirectionalConnection activeRequest={step === 4} keepRequest={step >= 4} activeResponse={step === 5} keepResponse={step >= 5} labelRequest="Where is google?" labelResponse="Ask Auth" /></div>
                    <div className="absolute top-[75%] left-[60%] w-[40%] origin-left rotate-[15deg]"><BiDirectionalConnection activeRequest={step === 6} keepRequest={step >= 6} activeResponse={step === 7} keepResponse={step >= 7} labelRequest="IP for google?" labelResponse="142.250.1.1" /></div>
                </div>
                <div className="flex flex-col gap-16 justify-center py-4 pl-2">
                    <DeviceNode IconComponent={RetroCloudIcon} label="Root Server" active={step === 2 || step === 3} color="purple" />
                    <DeviceNode IconComponent={RetroCloudIcon} label="TLD Server" active={step === 4 || step === 5} color="orange" />
                    <DeviceNode IconComponent={RetroServerIcon} label="Auth Server" active={step === 6 || step === 7} color="green" />
                </div>
            </div>
        </SimWrapper>
    );
};
const SimDHCP = () => {
    const [step, setStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [simData, setSimData] = useState({ ip: "..." });
    useEffect(() => {
        if (!isRunning) return;
        setSimData({ ip: `192.168.1.${Math.floor(Math.random() * 200) + 10}` });
        setStep(1);
        const timeline = [
            { s: 2, t: 2500 },
            { s: 3, t: 5000 },
            { s: 4, t: 7500 },
            { s: 5, t: 10000 }
        ];
        const timers = timeline.map(item => setTimeout(() => setStep(item.s), item.t));
        return () => timers.forEach(clearTimeout);
    }, [isRunning]);
    const handleStart = () => {
        setStep(0);
        setTimeout(() => setIsRunning(true), 100);
    };
    const DhcpLink = ({ start, end, color, label, subLabel, dashed, active, visited, id }) => {
        const colors = { yellow: "#facc15", green: "#4ade80", blue: "#60a5fa", purple: "#c084fc" };
        const c = colors[color];
        const styleMap = {
            yellow: { text: "text-yellow-400", border: "border-yellow-500/50" },
            green: { text: "text-green-400", border: "border-green-500/50" },
            blue: { text: "text-blue-400", border: "border-blue-500/50" },
            purple: { text: "text-purple-400", border: "border-purple-500/50" }
        };
        const currentStyles = styleMap[color] || styleMap.yellow;
        return (
            <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{zIndex: 1}}>
                    <defs>
                        <marker id={`arrow-gray-${id}`} markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill="#334155" />
                        </marker>
                    </defs>
                    <line
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke="#334155"
                        strokeWidth="2"
                        strokeDasharray="none"
                        markerEnd={`url(#arrow-gray-${id})`}
                        style={{ opacity: 0.5 }}
                    />
                </svg>
                <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible" style={{zIndex: 2}}>
                    <defs>
                        <marker id={`arrow-color-${id}`} markerWidth="10" markerHeight="10" refX="10" refY="3" orient="auto" markerUnits="strokeWidth">
                            <path d="M0,0 L0,6 L9,3 z" fill={c} />
                        </marker>
                    </defs>
                    <motion.line
                        x1={start.x} y1={start.y}
                        x2={end.x} y2={end.y}
                        stroke={c}
                        strokeWidth="2"
                        strokeDasharray={dashed ? "5,5" : "none"}
                        markerEnd={`url(#arrow-color-${id})`}
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{
                            pathLength: active ? 1 : 1,
                            opacity: active ? 1 : 0
                        }}
                        transition={{
                            pathLength: { duration: 0.5, ease: "linear" },
                            opacity: { duration: 1.5, ease: "linear" }
                        }}
                        style={{ filter: `drop-shadow(0 0 5px ${c})` }}
                    />
                </svg>
                <div
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-all duration-700 
                    ${(active || visited) ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}
                    style={{ left: `calc(${start.x} + (${end.x} - ${start.x}) / 2)`, top: `calc(${start.y} + (${end.y} - ${start.y}) / 2)` }}
                >
                    <div className={`px-3 py-1 rounded bg-[#0B1120] border ${currentStyles.border} shadow-[0_0_15px_rgba(0,0,0,0.8)] flex flex-col items-center min-w-[120px]`}>
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${currentStyles.text} drop-shadow-md`}>{label}</span>
                        <span className="text-[9px] text-slate-400 whitespace-nowrap">{subLabel}</span>
                    </div>
                </div>
            </>
        );
    };
    return (
        <SimWrapper title="DHCP (DORA)" onStart={handleStart} isRunning={isRunning && step < 5} info={`1. Discover\n2. Offer\n3. Request\n4. Ack`}>
            <div className="w-full h-[520px] relative p-8">
                <div className="absolute left-[10%] top-[5%] w-24 flex flex-col items-center z-10">
                    <DeviceNode IconComponent={RetroClientIcon} label="Client" active={step === 1} color="cyan" />
                    <div className="text-[9px] text-slate-500 mt-1 font-mono">00:1A:2B:3C</div>
                </div>
                <div className="absolute right-[10%] top-[25%] w-24 flex flex-col items-center z-10">
                    <DeviceNode IconComponent={RetroServerIcon} label="Server" active={step === 1 || step === 2} color="purple" />
                </div>
                <div className="absolute left-[10%] top-[45%] w-24 flex flex-col items-center z-10">
                    <DeviceNode IconComponent={RetroClientIcon} label="Client" active={step === 2 || step === 3} color="cyan" />
                </div>
                <div className="absolute right-[10%] top-[65%] w-24 flex flex-col items-center z-10">
                    <DeviceNode IconComponent={RetroServerIcon} label="Server" active={step === 3 || step === 4} color="purple" />
                </div>
                <div className={`absolute left-[10%] top-[85%] w-32 -translate-x-[12%] z-10 transition-all duration-[1000ms] ${step >= 4 ? 'opacity-100 scale-105' : 'opacity-40 scale-100'}`}>
                    <div className={`
                        bg-transition-colors duration-1000 border px-4 py-3 rounded-lg flex flex-col items-center justify-center
                        ${step >= 4
                        ? 'bg-green-900/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                        : 'bg-[#0B1120] border-slate-700 shadow-none'
                    }
                     `}>
                        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 transition-colors duration-1000 ${step >= 4 ? 'text-green-500' : 'text-slate-500'}`}>Configured</div>
                        <div className={`text-sm font-mono font-bold transition-colors duration-1000 ${step >= 4 ? 'text-white' : 'text-slate-600'}`}>
                            {step >= 4 ? simData.ip : "0.0.0.0"}
                        </div>
                    </div>
                </div>
                <DhcpLink id="d1" active={step === 1} visited={step >= 1} color="yellow" dashed={true} label="DISCOVER" subLabel="Broadcast" start={{x: "25%", y: "15%"}} end={{x: "75%", y: "30%"}} />
                <DhcpLink id="d2" active={step === 2} visited={step >= 2} color="green" label="OFFER" subLabel={`IP: ${simData.ip}`} start={{x: "75%", y: "35%"}} end={{x: "25%", y: "50%"}} />
                <DhcpLink id="d3" active={step === 3} visited={step >= 3} color="blue" label="REQUEST" subLabel="I'll take it" start={{x: "25%", y: "55%"}} end={{x: "75%", y: "70%"}} />
                <DhcpLink id="d4" active={step === 4} visited={step >= 4} color="purple" label="ACK" subLabel="Confirmed" start={{x: "75%", y: "75%"}} end={{x: "25%", y: "90%"}} />
            </div>
        </SimWrapper>
    );
};
const SimTcpUdp = () => {
    const [step, setStep] = useState(0);
    const [udpStep, setUdpStep] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    useEffect(() => {
        if (!isRunning) return;
        setStep(1);
        setUdpStep(1);
        const tcpTimers = [
            setTimeout(() => setStep(2), 2000), // SYN-ACK
            setTimeout(() => setStep(3), 4000), // ACK
            setTimeout(() => setStep(4), 6000), // Data
        ];
        const udpTimers = [
            setTimeout(() => setUdpStep(2), 1500), // Response 1
            setTimeout(() => setUdpStep(3), 3000), // Request 2
            setTimeout(() => setUdpStep(4), 4500), // Response 2
        ];
        const stopTimer = setTimeout(() => setIsRunning(false), 7000);
        return () => {
            [...tcpTimers, ...udpTimers, stopTimer].forEach(clearTimeout);
        };
    }, [isRunning]);
    return (
        <SimWrapper title="TCP vs UDP" onStart={() => { setStep(0); setUdpStep(0); setTimeout(() => setIsRunning(true), 100); }} isRunning={isRunning} info="TCP: Handshake -> Reliable\nUDP: Fire & Forget -> Fast">
            <div className="w-full h-[520px] grid grid-cols-2 gap-0 relative">
                {}
                <div className="border-r border-slate-700/50 relative p-6 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <h3 className="text-xl font-bold text-blue-400">TCP</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Connection Oriented</p>
                    </div>
                    <div className="flex justify-between items-center w-full mt-4 gap-4">
                        <DeviceNode IconComponent={RetroClientIcon} label="Client" active={step > 0} color="blue" scale={0.8} />
                        <div className="flex-1 relative h-64 flex flex-col justify-evenly">
                            {}
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[20%]"></div>
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[40%]"></div>
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[60%]"></div>
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[80%]"></div>
                            {}
                            <div className="h-6 relative w-full">
                                <PacketFlow active={step >= 1} direction="right" label="SYN" color="cyan" speed={1.5} />
                            </div>
                            <div className="h-6 relative w-full">
                                <PacketFlow active={step >= 2} direction="left" label="SYN-ACK" color="yellow" speed={1.5} />
                            </div>
                            <div className="h-6 relative w-full">
                                <PacketFlow active={step >= 3} direction="right" label="ACK" color="green" speed={1.5} />
                            </div>
                            <div className="h-6 relative w-full flex items-center justify-center">
                                {step >= 4 && (
                                    <motion.div
                                        initial={{opacity:0, scale: 0.8}}
                                        animate={{opacity:1, scale: 1}}
                                        className="w-full text-center text-[10px] font-bold text-green-400 tracking-widest border border-green-500/30 rounded bg-green-900/20 py-1 shadow-[0_0_10px_rgba(74,222,128,0.2)]"
                                    >
                                        CONNECTED: DATA STREAM
                                    </motion.div>
                                )}
                            </div>
                        </div>
                        <DeviceNode IconComponent={RetroServerIcon} label="Server" active={step > 0} color="purple" scale={0.8} />
                    </div>
                </div>
                {}
                <div className="relative p-6 flex flex-col items-center">
                    <div className="mb-4 text-center">
                        <h3 className="text-xl font-bold text-orange-400">UDP</h3>
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Connectionless</p>
                    </div>
                    <div className="flex justify-between items-center w-full mt-4 gap-4">
                        <DeviceNode IconComponent={RetroClientIcon} label="Client" active={udpStep > 0} color="orange" scale={0.8} />
                        <div className="flex-1 relative h-64 flex flex-col justify-evenly">
                            {}
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[20%]"></div>
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[40%]"></div>
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[60%]"></div>
                            <div className="w-full h-[1px] bg-slate-800/50 absolute top-[80%]"></div>
                            {}
                            <div className="h-6 relative w-full"><PacketFlow active={udpStep >= 1} direction="right" label="DATA REQ" color="orange" speed={1} /></div>
                            <div className="h-6 relative w-full"><PacketFlow active={udpStep >= 2} direction="left" label="DATA RES" color="purple" speed={1} /></div>
                            <div className="h-6 relative w-full"><PacketFlow active={udpStep >= 3} direction="right" label="DATA REQ" color="orange" speed={1} /></div>
                            <div className="h-6 relative w-full"><PacketFlow active={udpStep >= 4} direction="left" label="DATA RES" color="purple" speed={1} /></div>
                        </div>
                        <DeviceNode IconComponent={RetroServerIcon} label="Server" active={udpStep > 0} color="purple" scale={0.8} />
                    </div>
                </div>
            </div>
        </SimWrapper>
    );
};
const FirewallGame = () => {
    const [packets, setPackets] = useState([]);
    const [serverHealth, setServerHealth] = useState(100);
    const [score, setScore] = useState(0);
    const [rules, setRules] = useState({
        blockMalware: false,
        allowSSH: true,
    });
    const [isGameRunning, setIsGameRunning] = useState(false);
    useEffect(() => {
        if (!isGameRunning) return;
        const interval = setInterval(() => {
            if (serverHealth <= 0) {
                setIsGameRunning(false);
                return;
            }
            const types = ['legit', 'malware', 'malware', 'ssh_attack', 'legit'];
            const type = types[Math.floor(Math.random() * types.length)];
            const newPacket = {
                id: Date.now() + Math.random(),
                type: type,
                x: 0,
                blocked: false
            };
            setPackets(prev => [...prev, newPacket]);
        }, 1200);
        return () => clearInterval(interval);
    }, [isGameRunning, serverHealth]);
    useEffect(() => {
        if (!isGameRunning) return;
        const moveInterval = setInterval(() => {
            setPackets(prev => prev.map(p => {
                if (p.x >= 90 || p.blocked) return p;
                let speed = 1.5;
                if(p.type === 'ssh_attack') speed = 2.0;
                let newX = p.x + speed;
                if (p.x < 50 && newX >= 50) {
                    let shouldBlock = false;
                    if (p.type === 'malware' && rules.blockMalware) shouldBlock = true;
                    if (p.type === 'ssh_attack' && !rules.allowSSH) shouldBlock = true;
                    if (shouldBlock) {
                        return { ...p, x: 50, blocked: true };
                    }
                }
                if (newX >= 90 && p.x < 90) {
                    handleServerHit(p);
                }
                return { ...p, x: newX };
            }).filter(p => !p.blocked && p.x < 92));
        }, 30);
        return () => clearInterval(moveInterval);
    }, [isGameRunning, rules]);
    const handleServerHit = (packet) => {
        if (packet.type === 'malware') {
            setServerHealth(h => Math.max(0, h - 20));
        } else if (packet.type === 'ssh_attack') {
            setServerHealth(h => Math.max(0, h - 15));
        } else {
            setScore(s => s + 10);
        }
    };
    const toggleRule = (rule) => {
        setRules(prev => ({ ...prev, [rule]: !prev[rule] }));
    };
    return (
        <div className="w-full h-full flex flex-col p-2">
            <div className="flex justify-between items-center mb-6 border-b border-slate-700 pb-4">
                <div>
                    <h3 className="text-xl font-bold text-white">Firewall Traffic Control</h3>
                    <p className="text-sm text-slate-400">Nastavte pravidlá na ochranu servera pred útokmi.</p>
                </div>
                <div className="text-right flex gap-6 items-center">
                    <div className="text-2xl font-bold text-blue-400 tracking-widest">{score} <span className="text-xs text-slate-500">XP</span></div>
                    <div className={`text-sm font-bold px-3 py-1 rounded border ${serverHealth > 50 ? 'border-green-500/30 bg-green-500/10 text-green-400' : 'border-red-500/30 bg-red-500/10 text-red-400'}`}>
                        SYSTEM: {serverHealth > 0 ? 'ONLINE' : 'CRITICAL'}
                    </div>
                </div>
            </div>
            <div className="flex-1 flex gap-8 h-[380px]">
                {}
                <div className="w-1/3 bg-slate-800/50 rounded-xl p-6 border border-slate-700 flex flex-col gap-4 shadow-lg">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Konfigurácia Firewallu</h4>
                    {}
                    <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex flex-col">
                            <span className="font-bold text-red-400 text-sm">Blokovať Malware</span>
                            <span className="text-[10px] text-slate-500">UDP/TCP Signatures</span>
                        </div>
                        <button
                            onClick={() => toggleRule('blockMalware')}
                            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${rules.blockMalware ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${rules.blockMalware ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    {}
                    <div className="flex items-center justify-between p-4 bg-slate-900/80 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
                        <div className="flex flex-col">
                            <span className="font-bold text-blue-400 text-sm">Povoliť SSH (Port 22)</span>
                            <span className="text-[10px] text-slate-500">Remote Access</span>
                        </div>
                        <button
                            onClick={() => toggleRule('allowSSH')}
                            className={`w-12 h-6 rounded-full transition-all duration-300 relative ${rules.allowSSH ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${rules.allowSSH ? 'translate-x-6' : 'translate-x-0'}`} />
                        </button>
                    </div>
                    <div className="mt-auto">
                        {!isGameRunning ? (
                            <button
                                onClick={() => { setServerHealth(100); setScore(0); setIsGameRunning(true); setPackets([]); }}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-blue-600/20"
                            >
                                {serverHealth <= 0 ? "REŠTARTOVAŤ SYSTÉM" : "SPUSTIŤ PREVÁDZKU"}
                            </button>
                        ) : (
                            <button
                                onClick={() => setIsGameRunning(false)}
                                className="w-full py-3 bg-red-600 hover:bg-red-500 rounded-lg font-bold text-white transition-all shadow-lg hover:shadow-red-600/20"
                            >
                                STOP
                            </button>
                        )}
                    </div>
                </div>
                {}
                <div className="flex-1 bg-slate-900/30 rounded-xl border border-slate-700 relative overflow-hidden flex items-center px-12">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:40px_40px] opacity-10"></div>
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-700/50"></div>
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <div className="w-16 h-16 bg-slate-800 rounded-full border border-slate-600 flex items-center justify-center shadow-xl">
                            <span className="text-xs font-bold text-slate-300">WAN</span>
                        </div>
                    </div>
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 flex flex-col items-center z-20">
                        <div className="bg-slate-900 p-4 rounded-xl border border-orange-500/50 shadow-[0_0_30px_rgba(249,115,22,0.15)] relative">
                            <FirewallGameIcon />
                            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
                        </div>
                        <span className="mt-2 text-xs font-bold text-orange-400 tracking-widest">FIREWALL</span>
                    </div>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                        <ServerGameIcon health={serverHealth} />
                        <span className="mt-2 text-xs font-bold text-slate-400">Internal Server</span>
                    </div>
                    <AnimatePresence>
                        {packets.map(p => (
                            <motion.div
                                key={p.id}
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1, left: `${p.x}%` }}
                                exit={{ opacity: 0, scale: 0 }}
                                transition={{ duration: 0 }}
                                className="absolute top-1/2 -translate-y-1/2 -mt-3 z-30 pointer-events-none"
                                style={{ left: `${p.x}%` }}
                            >
                                <div className="flex flex-col items-center">
                                    <PacketIcon type={p.type} />
                                    <span className={`text-[8px] font-mono font-bold bg-black/70 px-1 rounded mt-1 border border-slate-700 whitespace-nowrap ${
                                        p.type === 'malware' ? 'text-red-400' : (p.type === 'ssh_attack' ? 'text-orange-400' : 'text-green-400')
                                    }`}>
                                        {p.type === 'malware' ? 'VÍRUS' : (p.type === 'ssh_attack' ? 'SSH BRUTE' : 'DATA')}
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {packets.filter(p => p.blocked).map(p => (
                        <motion.div
                            key={`block-${p.id}`}
                            initial={{ scale: 0.5, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border-2 border-red-500 rounded-full z-40 bg-red-500/20"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
const CyberLab = () => {
    const [nodes, setNodes] = useState([
        { id: 1, type: 'pc', x: 80, y: 100, name: 'Client A', ip: '192.168.1.10' },
        { id: 2, type: 'switch', x: 300, y: 100, name: 'Switch-1' },
        { id: 3, type: 'router', x: 300, y: 250, name: 'Router-Main', ip: '192.168.1.1' },
        { id: 4, type: 'server', x: 550, y: 250, name: 'Web Server', ip: '10.0.0.5' },
    ]);
    const [links, setLinks] = useState([[1, 2], [2, 3], [3, 4]]);
    const [tool, setTool] = useState('cursor');
    const [selectedNodeId, setSelectedNodeId] = useState(null);
    const [draggingId, setDraggingId] = useState(null);
    const [cableStartId, setCableStartId] = useState(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [pingPacket, setPingPacket] = useState(null);
    const [logs, setLogs] = useState(["Systém inicializovaný. Pripravený."]);
    const [currentTask, setCurrentTask] = useState(null);
    const [completedTaskIds, setCompletedTaskIds] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [isAllFinished, setIsAllFinished] = useState(false);
    const containerRef = useRef(null);
    const addLog = (msg) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev.slice(0, 5)]);
    const ALL_TASKS = [
        {
            id: 't1',
            text: "Nastavte IP adresu hlavného routera ('Router-Main') na 192.168.1.1 (Gateway).",
            check: (ns) => {
                const r = ns.find(n => n.name === 'Router-Main');
                return r && r.ip === '192.168.1.1';
            }
        },
        {
            id: 't2',
            text: "Vytvorte DMZ: Pridajte Firewall a zapojte ho medzi Router a Web Server (Router <-> Firewall <-> Server).",
            check: (ns, ls) => {
                const fw = ns.find(n => n.type === 'firewall');
                const router = ns.find(n => n.type === 'router');
                const server = ns.find(n => n.type === 'server');
                if (!fw || !router || !server) return false;
                const routerFw = ls.some(l => (l[0] === router.id && l[1] === fw.id) || (l[0] === fw.id && l[1] === router.id));
                const fwServer = ls.some(l => (l[0] === fw.id && l[1] === server.id) || (l[0] === server.id && l[1] === fw.id));
                const directLink = ls.some(l => (l[0] === router.id && l[1] === server.id) || (l[0] === server.id && l[1] === router.id));
                return routerFw && fwServer && !directLink;
            }
        },
        {
            id: 't3',
            text: "Premenujte 'Client A' na 'Admin-PC' a nastavte mu IP z rozsahu routera (napr. 192.168.1.100).",
            check: (ns) => {
                const pc = ns.find(n => n.name === 'Admin-PC');
                return pc && pc.ip && pc.ip.startsWith('192.168.1.');
            }
        },
        {
            id: 't4',
            text: "Zabezpečte redundanciu: Pridajte druhý Router s názvom 'Backup-Router'.",
            check: (ns) => ns.some(n => n.type === 'router' && n.name === 'Backup-Router')
        },
        {
            id: 't5',
            text: "Pripojte 'Switch-1' k obom routerom (Main aj Backup) pre výpadok linky.",
            check: (ns, ls) => {
                const sw = ns.find(n => n.name === 'Switch-1');
                const r1 = ns.find(n => n.name === 'Router-Main');
                const r2 = ns.find(n => n.name === 'Backup-Router');
                if (!sw || !r1 || !r2) return false;
                const link1 = ls.some(l => (l[0] === sw.id && l[1] === r1.id) || (l[0] === r1.id && l[1] === sw.id));
                const link2 = ls.some(l => (l[0] === sw.id && l[1] === r2.id) || (l[0] === r2.id && l[1] === sw.id));
                return link1 && link2;
            }
        },
        {
            id: 't6',
            text: "Rozšírte sieť: Pridajte 2 nové PC a pripojte ich k 'Switch-1'.",
            check: (ns, ls) => {
                const sw = ns.find(n => n.name === 'Switch-1');
                if (!sw) return false;
                let connectedPCs = 0;
                ns.filter(n => n.type === 'pc').forEach(pc => {
                    if (ls.some(l => (l[0] === pc.id && l[1] === sw.id) || (l[0] === sw.id && l[1] === pc.id))) {
                        connectedPCs++;
                    }
                });
                return connectedPCs >= 3;
            }
        }
    ];
    const generateTask = () => {
        if (currentTask && !showSuccess && !isAllFinished) {
            addLog("Najprv dokončite aktuálnu úlohu!");
            return;
        }
        const availableTasks = ALL_TASKS.filter(t => !completedTaskIds.includes(t.id));
        if (availableTasks.length === 0) {
            setIsAllFinished(true);
            setCurrentTask(null);
            addLog("Gratulujeme! Všetky scenáre dokončené.");
            return;
        }
        const newTask = availableTasks[0];
        setIsAllFinished(false);
        setShowSuccess(false);
        setCurrentTask(newTask);
        addLog(`Nová úloha: ${newTask.text}`);
    };
    const restartTasks = () => {
        setCompletedTaskIds([]);
        setIsAllFinished(false);
        setNodes([
            { id: 1, type: 'pc', x: 80, y: 100, name: 'Client A', ip: '10.0.0.5' },
            { id: 2, type: 'switch', x: 300, y: 100, name: 'Switch-1' },
            { id: 3, type: 'router', x: 300, y: 250, name: 'Router-Main', ip: '0.0.0.0' },
            { id: 4, type: 'server', x: 550, y: 250, name: 'Web Server', ip: '10.0.0.5' },
        ]);
        setLinks([[1, 2], [2, 3], [3, 4]]);
        addLog("Reštart simulácie.");
        setTimeout(() => {
            setCurrentTask(ALL_TASKS[0]);
        }, 100);
    };
    useEffect(() => {
        if (!currentTask || showSuccess || isAllFinished) return;
        const isComplete = currentTask.check(nodes, links);
        if (isComplete) {
            setShowSuccess(true);
            setCompletedTaskIds(prev => [...prev, currentTask.id]);
            addLog("Úloha úspešne splnená!");
            setTimeout(() => {
                setShowSuccess(false);
                setCurrentTask(null);
            }, 2500);
        }
    }, [nodes, links, currentTask, showSuccess, isAllFinished]);
    const addNode = (type) => {
        const id = Date.now();
        const x = 50 + Math.random() * 500;
        const y = 50 + Math.random() * 300;
        let ip = null;
        if (['pc', 'server', 'router'].includes(type)) {
            ip = `192.168.0.${Math.floor(Math.random() * 254)}`;
        }
        const newNode = {
            id, type, x, y,
            name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${nodes.length + 1}`,
            ip
        };
        setNodes(prev => [...prev, newNode]);
        addLog(`Pridané zariadenie: ${type}.`);
    };
    const getRelPos = (e) => {
        if (!containerRef.current) return { x: 0, y: 0 };
        const rect = containerRef.current.getBoundingClientRect();
        return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleMouseDown = (e, id) => {
        e.stopPropagation();
        const pos = getRelPos(e);
        if (tool === 'eraser') {
            setNodes(prev => prev.filter(n => n.id !== id));
            setLinks(prev => prev.filter(l => l[0] !== id && l[1] !== id));
            if (selectedNodeId === id) setSelectedNodeId(null);
            addLog("Zariadenie odstránené.");
            return;
        }
        if (tool === 'cable') {
            setCableStartId(id);
        } else {
            const node = nodes.find(n => n.id === id);
            setSelectedNodeId(id);
            setOffset({ x: pos.x - node.x, y: pos.y - node.y });
            setDraggingId(id);
        }
    };
    const handleMouseUpNode = (e, id) => {
        e.stopPropagation();
        if (tool === 'cable' && cableStartId) {
            if (cableStartId !== id) {
                const exists = links.some(l => (l[0] === cableStartId && l[1] === id) || (l[0] === id && l[1] === cableStartId));
                if (!exists) {
                    setLinks(prev => [...prev, [cableStartId, id]]);
                    addLog("Kábel pripojený.");
                } else {
                    addLog("Už pripojené.");
                }
            }
            setCableStartId(null);
        }
        setDraggingId(null);
    };
    const handleContainerMouseMove = (e) => {
        const pos = getRelPos(e);
        setMousePos(pos);
        if (draggingId) {
            setNodes(prev => prev.map(n => {
                if (n.id === draggingId) {
                    return { ...n, x: pos.x - offset.x, y: pos.y - offset.y };
                }
                return n;
            }));
        }
    };
    const handleContainerMouseUp = () => {
        setDraggingId(null);
        setCableStartId(null);
    };
    const handleLinkClick = (e, index) => {
        e.stopPropagation();
        if (tool === 'eraser') {
            setLinks(prev => prev.filter((_, i) => i !== index));
            addLog("Kábel odstránený.");
        }
    };
    const deleteSelected = () => {
        if (!selectedNodeId) return;
        setNodes(prev => prev.filter(n => n.id !== selectedNodeId));
        setLinks(prev => prev.filter(l => l[0] !== selectedNodeId && l[1] !== selectedNodeId));
        setSelectedNodeId(null);
        addLog("Zariadenie odstránené.");
    };
    const findPath = (start, end) => {
        let queue = [[start]];
        let visited = new Set();
        visited.add(start);
        while (queue.length > 0) {
            let path = queue.shift();
            let node = path[path.length - 1];
            if (node === end) return path;
            let neighbors = links.filter(l => l[0] === node || l[1] === node).map(l => l[0] === node ? l[1] : l[0]);
            for (let neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([...path, neighbor]);
                }
            }
        }
        return null;
    };
    const sendPing = () => {
        if (!selectedNodeId) return;
        const others = nodes.filter(n => n.id !== selectedNodeId && n.type !== 'switch');
        if (others.length === 0) return addLog("Žiadne ciele.");
        const target = others[Math.floor(Math.random() * others.length)];
        const path = findPath(selectedNodeId, target.id);
        if (path) {
            addLog(`PING: ${selectedNodeId} -> ${target.id} ...`);
            setPingPacket({ path, step: 0, progress: 0 });
        } else {
            addLog("PING: Host nedostupný.");
        }
    };
    useEffect(() => {
        if (!pingPacket) return;
        const interval = setInterval(() => {
            setPingPacket(prev => {
                if (!prev) return null;
                const newProgress = prev.progress + 0.1;
                if (newProgress >= 1) {
                    const nextStep = prev.step + 1;
                    if (nextStep >= prev.path.length - 1) {
                        addLog("PING: Úspech!");
                        return null;
                    }
                    return { ...prev, step: nextStep, progress: 0 };
                }
                return { ...prev, progress: newProgress };
            });
        }, 50);
        return () => clearInterval(interval);
    }, [pingPacket]);
    const selectedNode = nodes.find(n => n.id === selectedNodeId);
    return (
        <div className="w-full h-[600px] flex gap-4 text-slate-200 select-none">
            {}
            <div className="w-16 bg-slate-900 border border-slate-700 flex flex-col items-center py-4 gap-4 rounded-xl z-20 shadow-xl">
                <div className="flex flex-col gap-2 w-full px-2 border-b border-slate-700 pb-4">
                    <button onClick={() => setTool('cursor')} className={`p-2 rounded transition-all ${tool === 'cursor' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`} title="Presunúť">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg>
                    </button>
                    <button onClick={() => setTool('cable')} className={`p-2 rounded transition-all ${tool === 'cable' ? 'bg-green-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`} title="Kábel">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14"/><circle cx="5" cy="12" r="3"/><circle cx="19" cy="12" r="3"/></svg>
                    </button>
                    <button onClick={() => setTool('eraser')} className={`p-2 rounded transition-all ${tool === 'eraser' ? 'bg-pink-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`} title="Guma">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="w-full px-2">
                    <button
                        onClick={generateTask}
                        className={`w-full p-2 rounded flex justify-center shadow-lg transition-all active:scale-95 ${currentTask || isAllFinished ? 'bg-slate-700 cursor-not-allowed text-slate-400' : 'bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-500/20'}`}
                        disabled={!!currentTask || isAllFinished}
                        title={isAllFinished ? "Dokončené" : (currentTask ? "Úloha aktívna" : "Získať úlohu")}
                    >
                        <TaskIcon />
                    </button>
                    <div className="text-[8px] text-center text-slate-500 font-bold mt-1">ÚLOHA</div>
                </div>
                <div className="flex flex-col gap-2 w-full px-2 overflow-y-auto custom-scrollbar border-t border-slate-700 pt-4 mt-2">
                    <span className="text-[9px] text-center text-slate-500 font-bold">DEVICES</span>
                    <button onClick={() => addNode('pc')} className="p-2 bg-slate-800 rounded hover:bg-blue-600/50 flex justify-center" title="PC"><CyberDeviceIcon type="pc"/></button>
                    <button onClick={() => addNode('server')} className="p-2 bg-slate-800 rounded hover:bg-blue-600/50 flex justify-center" title="Server"><CyberDeviceIcon type="server"/></button>
                    <button onClick={() => addNode('router')} className="p-2 bg-slate-800 rounded hover:bg-blue-600/50 flex justify-center" title="Router"><CyberDeviceIcon type="router"/></button>
                    <button onClick={() => addNode('switch')} className="p-2 bg-slate-800 rounded hover:bg-blue-600/50 flex justify-center" title="Switch"><CyberDeviceIcon type="switch"/></button>
                    <button onClick={() => addNode('firewall')} className="p-2 bg-slate-800 rounded hover:bg-blue-600/50 flex justify-center" title="Firewall"><CyberDeviceIcon type="firewall"/></button>
                </div>
            </div>
            {}
            <div
                ref={containerRef}
                className={`flex-1 bg-[#0f172a] rounded-xl border border-slate-700 relative overflow-hidden shadow-inner 
                ${tool === 'cable' ? 'cursor-crosshair' : (tool === 'eraser' ? 'cursor-not-allowed' : 'cursor-default')}`}
                onMouseMove={handleContainerMouseMove}
                onMouseUp={handleContainerMouseUp}
                onClick={() => setSelectedNodeId(null)}
            >
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:20px_20px] opacity-20 pointer-events-none"></div>
                <AnimatePresence>
                    {}
                    {currentTask && !showSuccess && (
                        <motion.div initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -50, opacity: 0 }} className="absolute top-4 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 border border-yellow-500/50 text-white px-6 py-3 rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.5)] flex items-center gap-3 max-w-md">
                            <div className="text-yellow-400 animate-pulse"><TaskIcon /></div>
                            <div>
                                <div className="text-[10px] text-yellow-500 font-bold uppercase tracking-wider">Aktuálna úloha</div>
                                <div className="text-sm font-medium leading-tight">{currentTask.text}</div>
                            </div>
                        </motion.div>
                    )}
                    {}
                    {isAllFinished && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-slate-800 border border-slate-600 text-white p-6 rounded-xl shadow-2xl flex flex-col items-center gap-4 text-center max-w-sm"
                        >
                            <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center text-2xl">🏆</div>
                            <div>
                                <h3 className="text-lg font-bold text-white">Scenáre dokončené</h3>
                                <p className="text-xs text-slate-400 mt-1">Úspešne ste nakonfigurovali celú sieťovú topológiu.</p>
                            </div>
                            <button
                                onClick={restartTasks}
                                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white rounded text-sm font-bold transition-all w-full"
                            >
                                Začať odznova
                            </button>
                        </motion.div>
                    )}
                    {}
                    {showSuccess && (
                        <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }} className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600/90 border border-green-400 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 backdrop-blur-sm">
                            <div className="text-xl">✅</div>
                            <div>
                                <div className="text-xs font-bold uppercase tracking-wider text-green-100">Splnené!</div>
                                <div className="text-sm font-bold">Skvelá práca</div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
                <svg className="absolute inset-0 w-full h-full overflow-visible">
                    {links.map((link, i) => {
                        const n1 = nodes.find(n => n.id === link[0]);
                        const n2 = nodes.find(n => n.id === link[1]);
                        if (!n1 || !n2) return null;
                        return (
                            <g key={i} onClick={(e) => handleLinkClick(e, i)} className={tool === 'eraser' ? "cursor-pointer hover:opacity-50" : ""}>
                                <line x1={n1.x + 20} y1={n1.y + 20} x2={n2.x + 20} y2={n2.y + 20} stroke="transparent" strokeWidth="15" />
                                <line x1={n1.x + 20} y1={n1.y + 20} x2={n2.x + 20} y2={n2.y + 20} stroke="#475569" strokeWidth="2" className="pointer-events-none" />
                            </g>
                        );
                    })}
                    {tool === 'cable' && cableStartId && (() => {
                        const startNode = nodes.find(n => n.id === cableStartId);
                        if (!startNode) return null;
                        return <line x1={startNode.x + 20} y1={startNode.y + 20} x2={mousePos.x} y2={mousePos.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="5,5" className="animate-pulse pointer-events-none" />
                    })()}
                    {pingPacket && (() => {
                        const currId = pingPacket.path[pingPacket.step];
                        const nextId = pingPacket.path[pingPacket.step + 1];
                        const n1 = nodes.find(n => n.id === currId);
                        const n2 = nodes.find(n => n.id === nextId);
                        if (!n1 || !n2) return null;
                        const x = (n1.x + 20) + ((n2.x + 20) - (n1.x + 20)) * pingPacket.progress;
                        const y = (n1.y + 20) + ((n2.y + 20) - (n1.y + 20)) * pingPacket.progress;
                        return <circle cx={x} cy={y} r="4" fill="#facc15" className="drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] pointer-events-none" />;
                    })()}
                </svg>
                {nodes.map(node => (
                    <div
                        key={node.id}
                        onMouseDown={(e) => handleMouseDown(e, node.id)}
                        onMouseUp={(e) => handleMouseUpNode(e, node.id)}
                        onClick={(e) => e.stopPropagation()}
                        className={`absolute w-10 h-10 flex items-center justify-center transition-transform active:scale-95 
                        ${tool === 'cursor' ? 'cursor-grab active:cursor-grabbing' : (tool === 'eraser' ? 'cursor-pointer hover:scale-110 hover:bg-red-500/20 rounded-full' : 'cursor-crosshair')}`}
                        style={{ left: node.x, top: node.y, zIndex: 10 }}
                    >
                        {selectedNodeId === node.id && tool === 'cursor' && <div className="absolute inset-[-8px] border-2 border-blue-500 rounded-lg animate-pulse bg-blue-500/10 pointer-events-none"></div>}
                        {cableStartId === node.id && <div className="absolute inset-[-8px] border-2 border-green-500 rounded-full animate-ping opacity-50 pointer-events-none"></div>}
                        <CyberDeviceIcon type={node.type} />
                        <div className="absolute top-11 left-1/2 -translate-x-1/2 bg-slate-900/80 px-2 py-0.5 rounded text-[9px] whitespace-nowrap border border-slate-700 text-slate-300 pointer-events-none">{node.name}</div>
                    </div>
                ))}
            </div>
            {}
            <div className="w-64 bg-slate-900 rounded-xl border border-slate-700 flex flex-col p-4 shadow-xl z-20">
                <h3 className="font-bold border-b border-slate-700 pb-2 mb-4 text-white">Vlastnosti</h3>
                {selectedNode ? (
                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold">Typ</span>
                            <div className="text-slate-200 capitalize">{selectedNode.type}</div>
                        </div>
                        <div>
                            <span className="text-xs text-slate-500 uppercase font-bold">Názov</span>
                            <input
                                className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-white mt-1 focus:border-blue-500 outline-none"
                                value={selectedNode.name}
                                onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode.id ? {...n, name: e.target.value} : n))}
                            />
                        </div>
                        {selectedNode.ip && (
                            <div>
                                <span className="text-xs text-slate-500 uppercase font-bold">IP Adresa</span>
                                <input
                                    className="w-full bg-slate-800 border border-slate-600 rounded px-2 py-1 text-sm text-green-400 font-mono mt-1 focus:border-blue-500 outline-none"
                                    value={selectedNode.ip || ''}
                                    onChange={(e) => setNodes(nodes.map(n => n.id === selectedNode.id ? {...n, ip: e.target.value} : n))}
                                />
                            </div>
                        )}
                        <div className="mt-4 border-t border-slate-700 pt-4 flex gap-2">
                            {['pc', 'server'].includes(selectedNode.type) && (
                                <button onClick={sendPing} className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-1.5 rounded text-xs font-bold transition-colors">PING TEST</button>
                            )}
                            <button onClick={deleteSelected} className="flex-1 bg-red-900/50 hover:bg-red-900 border border-red-800 text-red-200 py-1.5 rounded text-xs font-bold transition-colors">ODSTRÁNIŤ</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-600">
                        <span className="text-4xl mb-2">👆</span>
                        <span className="text-xs">Vyberte zariadenie na konfiguráciu</span>
                    </div>
                )}
                <div className="mt-auto pt-4 border-t border-slate-700">
                    <span className="text-[10px] font-bold text-slate-500 uppercase mb-2 block">Denník udalostí</span>
                    <div className="h-32 overflow-y-auto text-[10px] font-mono space-y-1 pr-1 custom-scrollbar">
                        {logs.map((l, i) => <div key={i} className={i===0 ? "text-green-400" : "text-slate-500"}>{l}</div>)}
                    </div>
                </div>
            </div>
        </div>
    );
};
const ProtocolsView = ({ onBack }) => {
    const [activeTab, setActiveTab] = useState('dns');
    return (
        <div className="w-full flex flex-col h-full text-left">
            {}
            <div className="flex items-center justify-between mb-6 border-b border-slate-700 pb-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
                    >
                        ← Späť
                    </button>
                    <h2 className="text-xl font-bold text-white border-l border-slate-700 pl-4">Sieťové protokoly</h2>
                </div>
                {}
                <div className="flex bg-[#111827] p-1 rounded-lg border border-slate-700">
                    {['dns', 'dhcp', 'tcp/udp'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all ${
                                activeTab === tab
                                    ? 'bg-blue-600 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>
            {}
            <div className="flex-1 bg-[#111827] border border-slate-700 rounded-lg overflow-hidden relative">
                <AnimatePresence mode="wait">
                    {activeTab === 'dhcp' && (
                        <motion.div key="dhcp" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <SimDHCP />
                        </motion.div>
                    )}
                    {activeTab === 'dns' && (
                        <motion.div key="dns" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <SimDNS />
                        </motion.div>
                    )}
                    {activeTab === 'tcp/udp' && (
                        <motion.div key="tcp" className="h-full" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                            <SimTcpUdp />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};
const GamesView = ({ onBack }) => {
    return (
        <div className="w-full flex flex-col h-full text-left">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">← Späť</button>
                <h2 className="text-xl font-bold text-white border-l border-slate-700 pl-4">Firewall Defense</h2>
            </div>
            <div className="flex-1 bg-[#111827] border border-slate-700 rounded-lg overflow-hidden">
                <FirewallGame />
            </div>
        </div>
    );
};
const LabView = ({ onBack }) => {
    return (
        <div className="w-full flex flex-col h-full text-left">
            <div className="flex items-center gap-4 mb-6 border-b border-slate-700 pb-4">
                <button onClick={onBack} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">← Späť</button>
                <h2 className="text-xl font-bold text-white border-l border-slate-700 pl-4">CyberLab Sandbox</h2>
            </div>
            <div className="flex-1 bg-[#111827] border border-slate-700 rounded-lg overflow-hidden">
                <CyberLab />
            </div>
        </div>
    );
};
const MainMenu = ({ onSelect }) => {
    const ModuleCard = ({ title, description, icon, onClick }) => (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative flex flex-col items-center text-center p-8
                       bg-[#1f2937] rounded-xl border border-slate-700
                       hover:border-blue-500/50 hover:bg-[#263042] hover:shadow-2xl hover:shadow-blue-900/10
                       transition-all duration-300 h-full justify-between"
        >
            <div className="flex flex-col items-center w-full">
                {}
                <div className="w-20 h-20 mb-6 rounded-full bg-slate-900/50 border border-slate-700/50
                              flex items-center justify-center text-slate-400
                              group-hover:text-blue-400 group-hover:border-blue-500/50 group-hover:scale-110
                              transition-all duration-300">
                    <div className="transform scale-110">
                        {icon}
                    </div>
                </div>
                {}
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors">
                    {title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-[260px]">
                    {description}
                </p>
            </div>
            {}
            <button
                onClick={onClick}
                className="w-full py-3 rounded-lg border border-slate-600 text-slate-300 font-bold text-xs uppercase tracking-widest
                           hover:bg-blue-600 hover:border-blue-600 hover:text-white hover:shadow-lg hover:shadow-blue-600/20
                           transition-all duration-200"
            >
                Spustiť modul
            </button>
        </motion.div>
    );
    return (
        <div className="w-full h-full flex flex-col">
            {}
            <div className="flex flex-col w-full mb-10">
                <h2 className="text-3xl font-bold text-white mb-6 text-left tracking-tight">
                    Simulácia
                </h2>
                {}
                <div className="w-full h-[2px] bg-slate-700 rounded-full"></div>
            </div>
            {}
            <div className="flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full h-full">
                    <ModuleCard
                        title="Sieťové protokoly"
                        description="Vizuálna reprezentácia protokolov DNS, DHCP a TCP/UDP v reálnom čase."
                        icon={<NetworkIcon />}
                        onClick={() => onSelect('protocols')}
                    />
                    <ModuleCard
                        title="Firewall Defense"
                        description="Ochráňte server pred útokmi pomocou správnej konfigurácie pravidiel."
                        icon={<FirewallGameIcon />}
                        onClick={() => onSelect('games')}
                    />
                    <ModuleCard
                        title="CyberLab Sandbox"
                        description="Voľný režim pre stavbu a testovanie vlastných sieťových topológií."
                        icon={<LabIcon />}
                        onClick={() => onSelect('lab')}
                    />
                </div>
            </div>
        </div>
    );
};
const App = () => {
    const [view, setView] = useState('menu');
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-start pt-1 font-sans text-slate-200">
            {/* ЗМІНА ТУТ: max-w-[1800px]
                Це ще ширше. Якщо і цього мало, можна поставити "w-full px-6", щоб було на 100%.
            */}
            <div className="w-full max-w-[1800px] relative transition-all duration-500 px-4">
                <div className="border-slate-700 border rounded-xl shadow-2xl p-8 min-h-[600px] bg-[#161e2e]">
                    <AnimatePresence mode="wait">
                        {view === 'menu' && (
                            <motion.div key="menu" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                                <MainMenu onSelect={setView} />
                            </motion.div>
                        )}
                        {view === 'protocols' && (
                            <motion.div key="protocols" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                                <ProtocolsView onBack={() => setView('menu')} />
                            </motion.div>
                        )}
                        {view === 'games' && (
                            <motion.div key="games" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                                <GamesView onBack={() => setView('menu')} />
                            </motion.div>
                        )}
                        {view === 'lab' && (
                            <motion.div key="lab" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full">
                                <LabView onBack={() => setView('menu')} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};
export default App;