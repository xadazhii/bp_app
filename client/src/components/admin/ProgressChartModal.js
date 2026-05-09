import React from 'react';

const colorForGain = (g) => {
    if (g == null) return { fill: '#64748b', stroke: '#475569' };
    if (g < 0) return { fill: '#fb7185', stroke: '#e11d48' };
    if (g < 30) return { fill: '#fbbf24', stroke: '#d97706' };
    if (g < 70) return { fill: '#60a5fa', stroke: '#2563eb' };
    return { fill: '#34d399', stroke: '#059669' };
};

const labelForGain = (g) => {
    if (g == null) return 'N/A';
    if (g < 0) return 'Regresia';
    if (g < 30) return 'Nízky zisk';
    if (g < 70) return 'Stredný zisk';
    return 'Vysoký zisk';
};

const LegendDot = ({ color, label }) => (
    <div className="flex items-center gap-2 text-[11px] sm:text-xs text-slate-300 font-medium">
        <span className="w-3 h-3 rounded-full ring-2 ring-slate-900 shadow" style={{ backgroundColor: color }} />
        {label}
    </div>
);

export const ProgressChartModal = ({ studentsProgress, entryTest, exitTest, globalGain, onClose }) => {
    const [hovered, setHovered] = React.useState(null);

    const points = React.useMemo(() => {
        if (!entryTest || !exitTest) return [];
        return studentsProgress
            .filter(s => s.entryScore != null && s.exitScore != null)
            .map(s => {
                const entryMax = s.maxScores?.[entryTest.id] ?? entryTest.maxScore ?? 1;
                const exitMax = s.maxScores?.[exitTest.id] ?? exitTest.maxScore ?? 1;
                return {
                    ...s,
                    prePercent: (s.entryScore / entryMax) * 100,
                    postPercent: (s.exitScore / exitMax) * 100,
                };
            });
    }, [studentsProgress, entryTest, exitTest]);

    const width = 800;
    const height = 560;
    const padding = { top: 30, right: 40, bottom: 70, left: 80 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    const xScale = (pct) => padding.left + (pct / 100) * chartW;
    const yScale = (pct) => padding.top + chartH - (pct / 100) * chartH;

    const ticks = [0, 25, 50, 75, 100];

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-5xl w-full max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start gap-4 p-6 sm:p-8 border-b border-white/5 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 tracking-tight">Vizualizácia progresu</h2>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1.5">
                            Vstupný test vs. Záverečný test podľa Hakeho klasifikácie. Bod nad diagonálou = zlepšenie, pod ňou = regresia.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 w-10 h-10 rounded-2xl bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center text-2xl font-light"
                        aria-label="Zatvoriť"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {points.length === 0 ? (
                        <div className="py-20 text-center text-slate-500">
                            <p className="font-bold uppercase tracking-widest text-sm">Žiadni študenti s~kompletnými výsledkami</p>
                            <p className="text-xs mt-2">Pre zobrazenie grafu musí mať aspoň jeden študent oba testy.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-slate-800/30 rounded-2xl p-3 sm:p-5 border border-white/5">
                                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: 360 }}>
                                    <polygon
                                        points={`${xScale(0)},${yScale(70)} ${xScale(100)},${yScale(100)} ${xScale(0)},${yScale(100)}`}
                                        fill="rgba(52, 211, 153, 0.08)"
                                    />
                                    <polygon
                                        points={`${xScale(0)},${yScale(30)} ${xScale(100)},${yScale(100)} ${xScale(0)},${yScale(70)}`}
                                        fill="rgba(96, 165, 250, 0.07)"
                                    />
                                    <polygon
                                        points={`${xScale(0)},${yScale(0)} ${xScale(100)},${yScale(100)} ${xScale(0)},${yScale(30)}`}
                                        fill="rgba(251, 191, 36, 0.06)"
                                    />
                                    <polygon
                                        points={`${xScale(0)},${yScale(0)} ${xScale(100)},${yScale(100)} ${xScale(100)},${yScale(0)}`}
                                        fill="rgba(251, 113, 133, 0.06)"
                                    />

                                    {ticks.slice(1, -1).map(v => (
                                        <g key={`grid-${v}`}>
                                            <line x1={xScale(v)} y1={padding.top} x2={xScale(v)} y2={padding.top + chartH} stroke="rgba(255,255,255,0.04)" strokeDasharray="2,4" />
                                            <line x1={padding.left} y1={yScale(v)} x2={padding.left + chartW} y2={yScale(v)} stroke="rgba(255,255,255,0.04)" strokeDasharray="2,4" />
                                        </g>
                                    ))}

                                    <line
                                        x1={xScale(0)} y1={yScale(0)}
                                        x2={xScale(100)} y2={yScale(100)}
                                        stroke="rgba(251, 113, 133, 0.5)" strokeWidth="1.5" strokeDasharray="6,4"
                                    />
                                    <line
                                        x1={xScale(0)} y1={yScale(30)}
                                        x2={xScale(100)} y2={yScale(100)}
                                        stroke="rgba(96, 165, 250, 0.5)" strokeWidth="1.5" strokeDasharray="6,4"
                                    />
                                    <line
                                        x1={xScale(0)} y1={yScale(70)}
                                        x2={xScale(100)} y2={yScale(100)}
                                        stroke="rgba(52, 211, 153, 0.55)" strokeWidth="1.5" strokeDasharray="6,4"
                                    />

                                    <line x1={padding.left} y1={padding.top + chartH} x2={padding.left + chartW} y2={padding.top + chartH} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />
                                    <line x1={padding.left} y1={padding.top} x2={padding.left} y2={padding.top + chartH} stroke="rgba(255,255,255,0.18)" strokeWidth="1.5" />

                                    {ticks.map(v => (
                                        <text key={`xlbl-${v}`} x={xScale(v)} y={padding.top + chartH + 26} textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="500">{v}%</text>
                                    ))}
                                    {ticks.map(v => (
                                        <text key={`ylbl-${v}`} x={padding.left - 14} y={yScale(v) + 4} textAnchor="end" fill="#94a3b8" fontSize="12" fontWeight="500">{v}%</text>
                                    ))}

                                    <text x={padding.left + chartW / 2} y={height - 18} textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="700" letterSpacing="3">VSTUPNÝ TEST</text>
                                    <text
                                        x={22}
                                        y={padding.top + chartH / 2}
                                        textAnchor="middle"
                                        fill="#cbd5e1"
                                        fontSize="12"
                                        fontWeight="700"
                                        letterSpacing="3"
                                        transform={`rotate(-90, 22, ${padding.top + chartH / 2})`}
                                    >
                                        ZÁVEREČNÝ TEST
                                    </text>

                                    {points.map(p => {
                                        const c = colorForGain(p.progress);
                                        const isHovered = hovered?.id === p.id;
                                        const cx = xScale(p.prePercent);
                                        const cy = yScale(p.postPercent);
                                        return (
                                            <g
                                                key={p.id}
                                                onMouseEnter={() => setHovered(p)}
                                                onMouseLeave={() => setHovered(null)}
                                                onClick={() => setHovered(isHovered ? null : p)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <circle cx={cx} cy={cy} r={isHovered ? 18 : 12} fill={c.fill} fillOpacity={0.18} style={{ transition: 'r 0.15s' }} />
                                                <circle cx={cx} cy={cy} r={isHovered ? 9 : 7} fill={c.fill} stroke="#0f172a" strokeWidth="2.5" style={{ transition: 'r 0.15s' }} />
                                            </g>
                                        );
                                    })}

                                    {hovered && (() => {
                                        const cx = xScale(hovered.prePercent);
                                        const cy = yScale(hovered.postPercent);
                                        const flipX = cx > padding.left + chartW * 0.65;
                                        const flipY = cy < padding.top + 80;
                                        const tooltipW = 180;
                                        const tooltipH = 76;
                                        const tx = flipX ? cx - tooltipW - 14 : cx + 14;
                                        const ty = flipY ? cy + 14 : cy - tooltipH - 14;
                                        const c = colorForGain(hovered.progress);
                                        return (
                                            <g style={{ pointerEvents: 'none' }}>
                                                <rect x={tx} y={ty} width={tooltipW} height={tooltipH} rx={10} fill="rgba(15, 23, 42, 0.97)" stroke="rgba(255,255,255,0.12)" />
                                                <text x={tx + 14} y={ty + 22} fill="#ffffff" fontSize="14" fontWeight="800">{hovered.username}</text>
                                                <text x={tx + 14} y={ty + 42} fill="#94a3b8" fontSize="11">{hovered.prePercent.toFixed(0)}% → {hovered.postPercent.toFixed(0)}%</text>
                                                <text x={tx + 14} y={ty + 62} fill={c.fill} fontSize="12" fontWeight="700">
                                                    g = {hovered.progress >= 0 ? '+' : ''}{hovered.progress.toFixed(1).replace('.', ',')}% · {labelForGain(hovered.progress)}
                                                </text>
                                            </g>
                                        );
                                    })()}
                                </svg>
                            </div>

                            <div className="flex flex-wrap gap-x-5 gap-y-3 mt-5 justify-center px-2">
                                <LegendDot color="#34d399" label="Vysoký zisk (g ≥ 70%)" />
                                <LegendDot color="#60a5fa" label="Stredný zisk (30-70%)" />
                                <LegendDot color="#fbbf24" label="Nízky zisk (0-30%)" />
                                <LegendDot color="#fb7185" label="Regresia (g < 0%)" />
                            </div>

                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
                                <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">Študentov</p>
                                    <p className="text-2xl font-black text-white">{points.length}</p>
                                </div>
                                <div className="bg-emerald-500/5 rounded-2xl p-4 border border-emerald-500/15">
                                    <p className="text-[10px] uppercase tracking-widest text-emerald-400/80 font-bold mb-1">Vysoký + Stredný</p>
                                    <p className="text-2xl font-black text-white">{points.filter(p => p.progress >= 30).length}</p>
                                </div>
                                <div className="bg-amber-500/5 rounded-2xl p-4 border border-amber-500/15">
                                    <p className="text-[10px] uppercase tracking-widest text-amber-400/80 font-bold mb-1">Nízky zisk</p>
                                    <p className="text-2xl font-black text-white">{points.filter(p => p.progress >= 0 && p.progress < 30).length}</p>
                                </div>
                                <div className="bg-rose-500/5 rounded-2xl p-4 border border-rose-500/15">
                                    <p className="text-[10px] uppercase tracking-widest text-rose-400/80 font-bold mb-1">Regresia</p>
                                    <p className="text-2xl font-black text-white">{points.filter(p => p.progress < 0).length}</p>
                                </div>
                            </div>

                            {globalGain != null && (
                                <div className="mt-5 p-5 bg-blue-500/5 rounded-2xl border border-blue-500/15 flex items-center justify-between gap-4 flex-wrap">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-blue-400/80 font-bold mb-1">Triedny zisk ⟨g⟩</p>
                                        <p className="text-xs text-slate-400">Hakeho formula aplikovaná na priemerné skóre celej skupiny</p>
                                    </div>
                                    <p className="text-3xl font-black text-white">
                                        {globalGain >= 0 ? '+' : ''}{globalGain.toFixed(1).replace('.', ',')}<span className="text-blue-400">%</span>
                                    </p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
