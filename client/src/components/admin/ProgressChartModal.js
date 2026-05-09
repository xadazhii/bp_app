import React from 'react';

const colorForGain = (g) => {
    if (g == null) return { fill: '#64748b', stroke: '#475569', text: 'text-slate-400' };
    if (g < 0) return { fill: '#fb7185', stroke: '#e11d48', text: 'text-rose-400' };
    if (g < 30) return { fill: '#fbbf24', stroke: '#d97706', text: 'text-amber-400' };
    if (g < 70) return { fill: '#60a5fa', stroke: '#2563eb', text: 'text-blue-400' };
    return { fill: '#34d399', stroke: '#059669', text: 'text-emerald-400' };
};

export const ProgressChartModal = ({ studentsProgress, entryTest, exitTest, globalGain, onClose }) => {
    const sorted = React.useMemo(() => {
        return studentsProgress
            .filter(s => s.progress != null)
            .sort((a, b) => b.progress - a.progress);
    }, [studentsProgress]);

    const minGain = Math.min(0, ...sorted.map(s => s.progress), -10);
    const maxGain = Math.max(100, ...sorted.map(s => s.progress));

    const padding = { top: 30, right: 90, bottom: 50, left: 130 };
    const rowHeight = 38;
    const chartW = 560;
    const chartH = Math.max(rowHeight * sorted.length, 80);
    const width = padding.left + chartW + padding.right;
    const height = padding.top + chartH + padding.bottom;

    const xScale = (g) => padding.left + ((g - minGain) / (maxGain - minGain)) * chartW;
    const zeroX = xScale(0);

    const tickValues = [];
    for (let v = Math.ceil(minGain / 25) * 25; v <= maxGain; v += 25) tickValues.push(v);

    const hakeMarkers = [
        { value: 30, color: 'rgba(96, 165, 250, 0.5)', label: 'g = 30' },
        { value: 70, color: 'rgba(52, 211, 153, 0.55)', label: 'g = 70' },
    ].filter(m => m.value >= minGain && m.value <= maxGain);

    return (
        <div
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 backdrop-blur-md p-4"
            onClick={onClose}
        >
            <div
                className="bg-slate-900 border border-white/10 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start gap-4 p-5 sm:p-6 border-b border-white/5 sticky top-0 bg-slate-900/95 backdrop-blur-md z-10">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-blue-400 tracking-tight">Vizualizácia progresu</h2>
                        <p className="text-slate-400 text-xs sm:text-sm mt-1">
                            Normalizovaný zisk ⟨g⟩ pre jednotlivých študentov, zoradený zostupne.
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 w-9 h-9 rounded-xl bg-slate-800/60 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all flex items-center justify-center text-xl font-light"
                        aria-label="Zatvoriť"
                    >
                        ×
                    </button>
                </div>

                <div className="p-4 sm:p-6">
                    {sorted.length === 0 ? (
                        <div className="py-20 text-center text-slate-500">
                            <p className="font-bold uppercase tracking-widest text-sm">Žiadni študenti s~kompletnými výsledkami</p>
                            <p className="text-xs mt-2">Pre zobrazenie grafu musí mať aspoň jeden študent oba testy.</p>
                        </div>
                    ) : (
                        <>
                            <div className="bg-slate-800/20 rounded-2xl p-3 sm:p-5 border border-white/5">
                                <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
                                    {tickValues.map(v => (
                                        <line
                                            key={`grid-${v}`}
                                            x1={xScale(v)}
                                            y1={padding.top - 8}
                                            x2={xScale(v)}
                                            y2={padding.top + chartH}
                                            stroke="rgba(255,255,255,0.04)"
                                            strokeDasharray="2,4"
                                        />
                                    ))}

                                    {hakeMarkers.map(m => (
                                        <g key={`hake-${m.value}`}>
                                            <line
                                                x1={xScale(m.value)}
                                                y1={padding.top - 8}
                                                x2={xScale(m.value)}
                                                y2={padding.top + chartH + 4}
                                                stroke={m.color}
                                                strokeDasharray="4,4"
                                                strokeWidth="1.5"
                                            />
                                            <text
                                                x={xScale(m.value)}
                                                y={padding.top - 12}
                                                textAnchor="middle"
                                                fill={m.color}
                                                fontSize="10"
                                                fontWeight="700"
                                                letterSpacing="1"
                                            >
                                                {m.label}
                                            </text>
                                        </g>
                                    ))}

                                    <line
                                        x1={zeroX}
                                        y1={padding.top - 8}
                                        x2={zeroX}
                                        y2={padding.top + chartH + 4}
                                        stroke="rgba(255, 255, 255, 0.35)"
                                        strokeWidth="2"
                                    />

                                    {sorted.map((s, i) => {
                                        const c = colorForGain(s.progress);
                                        const y = padding.top + i * rowHeight + rowHeight / 2;
                                        const barX = s.progress >= 0 ? zeroX : xScale(s.progress);
                                        const barW = Math.abs(xScale(s.progress) - zeroX);
                                        const valueX = s.progress >= 0 ? xScale(s.progress) + 8 : xScale(s.progress) - 8;
                                        const valueAnchor = s.progress >= 0 ? 'start' : 'end';
                                        return (
                                            <g key={s.id}>
                                                <text
                                                    x={padding.left - 12}
                                                    y={y + 4}
                                                    textAnchor="end"
                                                    fill="#e2e8f0"
                                                    fontSize="13"
                                                    fontWeight="600"
                                                >
                                                    {s.username.length > 14 ? s.username.slice(0, 13) + '…' : s.username}
                                                </text>
                                                <rect
                                                    x={padding.left}
                                                    y={y - rowHeight / 2 + 4}
                                                    width={chartW}
                                                    height={rowHeight - 8}
                                                    fill="rgba(255, 255, 255, 0.015)"
                                                    rx={4}
                                                />
                                                <rect
                                                    x={barX}
                                                    y={y - 10}
                                                    width={Math.max(barW, 1)}
                                                    height={20}
                                                    fill={c.fill}
                                                    fillOpacity={0.85}
                                                    rx={4}
                                                />
                                                <rect
                                                    x={barX}
                                                    y={y - 10}
                                                    width={Math.max(barW, 1)}
                                                    height={20}
                                                    fill="none"
                                                    stroke={c.stroke}
                                                    strokeWidth="1"
                                                    rx={4}
                                                />
                                                <text
                                                    x={valueX}
                                                    y={y + 4}
                                                    textAnchor={valueAnchor}
                                                    fill={c.fill}
                                                    fontSize="13"
                                                    fontWeight="800"
                                                >
                                                    {s.progress >= 0 ? '+' : ''}{s.progress.toFixed(1).replace('.', ',')}%
                                                </text>
                                            </g>
                                        );
                                    })}

                                    <line
                                        x1={padding.left}
                                        y1={padding.top + chartH}
                                        x2={padding.left + chartW}
                                        y2={padding.top + chartH}
                                        stroke="rgba(255,255,255,0.18)"
                                        strokeWidth="1.5"
                                    />

                                    {tickValues.map(v => (
                                        <text
                                            key={`xlbl-${v}`}
                                            x={xScale(v)}
                                            y={padding.top + chartH + 22}
                                            textAnchor="middle"
                                            fill="#94a3b8"
                                            fontSize="11"
                                            fontWeight="500"
                                        >
                                            {v > 0 ? '+' : ''}{v}%
                                        </text>
                                    ))}

                                    <text
                                        x={padding.left + chartW / 2}
                                        y={height - 8}
                                        textAnchor="middle"
                                        fill="#cbd5e1"
                                        fontSize="11"
                                        fontWeight="700"
                                        letterSpacing="2"
                                    >
                                        NORMALIZOVANÝ ZISK ⟨g⟩
                                    </text>
                                </svg>
                            </div>

                            {globalGain != null && (() => {
                                const c = colorForGain(globalGain);
                                return (
                                    <div className="mt-4 px-5 py-3 bg-slate-800/30 rounded-2xl border border-white/5 flex items-center justify-between gap-4 flex-wrap">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Triedny zisk ⟨g⟩</p>
                                            <p className="text-[11px] text-slate-400 mt-0.5">Hakeho formula na priemerných skóre skupiny</p>
                                        </div>
                                        <p className={`text-2xl font-black ${c.text}`}>
                                            {globalGain >= 0 ? '+' : ''}{globalGain.toFixed(1).replace('.', ',')}<span className="text-sm">%</span>
                                        </p>
                                    </div>
                                );
                            })()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
