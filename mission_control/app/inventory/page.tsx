"use client";

import React, { useEffect, useState, useRef, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════
interface InventoryItem {
    id: number;
    name: string;
    level: number;
    status: string;
    unit: string;
    max: number;
    current: number;
    type: string;
}

interface MaintenanceLog {
    date: string;
    action: string;
    status: 'OK' | 'WARN' | 'FAIL';
}

// ═══════════════════════════════════════════════════════════════════════════════
// DONNÉES STATIQUES - Version Française
// ═══════════════════════════════════════════════════════════════════════════════
const INVENTORY_DATA: InventoryItem[] = [
    { id: 1, name: "OXYGÈNE", level: 87, status: "NOMINAL", unit: "L", max: 15000, current: 13050, type: "GAZ" },
    { id: 2, name: "EAU", level: 42, status: "ATTENTION", unit: "L", max: 8000, current: 3360, type: "LIQUIDE" },
    { id: 3, name: "CARBURANT PLASMA", level: 93, status: "OPTIMAL", unit: "TW", max: 500, current: 465, type: "ÉNERGIE" },
    { id: 4, name: "BIO-RATIONS", level: 18, status: "CRITIQUE", unit: "kg", max: 2000, current: 360, type: "SOLIDE" },
    { id: 5, name: "BOUCLIER", level: 64, status: "STABLE", unit: "%", max: 100, current: 64, type: "ÉNERGIE" },
    { id: 6, name: "RÉACTEUR", level: 100, status: "MAXIMUM", unit: "MW", max: 1200, current: 1200, type: "ÉNERGIE" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// DONNÉES MAINTENANCE (Back Face)
// ═══════════════════════════════════════════════════════════════════════════════
const MAINTENANCE_LOGS: Record<number, MaintenanceLog[]> = {
    1: [
        { date: '2026.02.08', action: 'Calibration capteurs O₂', status: 'OK' },
        { date: '2026.02.05', action: 'Remplacement filtre A-12', status: 'OK' },
        { date: '2026.01.28', action: 'Inspection valve principale', status: 'WARN' },
    ],
    2: [
        { date: '2026.02.09', action: 'Alerte niveau bas détectée', status: 'WARN' },
        { date: '2026.02.03', action: 'Purification cycle #447', status: 'OK' },
        { date: '2026.01.30', action: 'Fuite micro-conduit B-7', status: 'FAIL' },
    ],
    3: [
        { date: '2026.02.10', action: 'Rendement plasma optimal', status: 'OK' },
        { date: '2026.02.06', action: 'Recharge cellule #3', status: 'OK' },
        { date: '2026.02.01', action: 'Diagnostic convertisseur', status: 'OK' },
    ],
    4: [
        { date: '2026.02.10', action: 'STOCK CRITIQUE — Alerte Cmd', status: 'FAIL' },
        { date: '2026.02.07', action: 'Inventaire nutritionnel', status: 'WARN' },
        { date: '2026.02.02', action: 'Rotation réserves Lot #12', status: 'OK' },
    ],
    5: [
        { date: '2026.02.09', action: 'Recalibration champ delta', status: 'OK' },
        { date: '2026.02.04', action: 'Test résistance impact', status: 'OK' },
        { date: '2026.01.29', action: 'Harmoniques instables', status: 'WARN' },
    ],
    6: [
        { date: '2026.02.10', action: 'Rendement 100% confirmé', status: 'OK' },
        { date: '2026.02.08', action: 'Cycle fusion #9812', status: 'OK' },
        { date: '2026.02.05', action: 'Maintenance préventive OK', status: 'OK' },
    ],
};

// ═══════════════════════════════════════════════════════════════════════════════
// DONNÉES TEMPÉRATURE (Sparkline for back face)
// ═══════════════════════════════════════════════════════════════════════════════
const TEMP_DATA: Record<number, number[]> = {
    1: [21, 22, 21, 23, 22, 24, 23, 22, 21, 22, 23, 22, 21, 20, 21, 22, 23, 22, 21, 22],
    2: [4, 5, 4, 4, 5, 6, 5, 4, 5, 4, 5, 5, 4, 4, 5, 6, 5, 4, 5, 4],
    3: [1850, 1870, 1860, 1880, 1900, 1890, 1870, 1880, 1890, 1870, 1860, 1880, 1890, 1900, 1880, 1870, 1860, 1880, 1870, 1880],
    4: [-18, -17, -18, -19, -18, -17, -18, -19, -18, -17, -18, -17, -18, -19, -18, -17, -18, -19, -18, -17],
    5: [42, 44, 43, 45, 44, 46, 45, 44, 43, 44, 45, 44, 43, 42, 43, 44, 45, 44, 43, 44],
    6: [2200, 2210, 2205, 2215, 2220, 2210, 2205, 2215, 2220, 2210, 2205, 2215, 2220, 2210, 2205, 2215, 2220, 2210, 2205, 2215],
};

const TEMP_UNITS: Record<number, string> = {
    1: '°C', 2: '°C', 3: '°C', 4: '°C', 5: '°C', 6: '°C',
};

// ═══════════════════════════════════════════════════════════════════════════════
// DONNÉES TECHNIQUES DÉTERMINISTES (évite Math.random → hydration mismatch)
// ═══════════════════════════════════════════════════════════════════════════════
const TECH_STATS: Record<number, { cycle: number; pressure: string }> = {
    1: { cycle: 4812, pressure: '1.2 atm' },
    2: { cycle: 3247, pressure: '2.8 atm' },
    3: { cycle: 7891, pressure: '1.6 atm' },
    4: { cycle: 1559, pressure: '1.0 atm' },
    5: { cycle: 6203, pressure: '2.1 atm' },
    6: { cycle: 9812, pressure: '3.0 atm' },
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITAIRE: Formater les nombres
// ═══════════════════════════════════════════════════════════════════════════════
const formatNumber = (num: number): string => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITAIRE: Couleurs selon le statut
// ═══════════════════════════════════════════════════════════════════════════════
const getStatusColor = (level: number) => {
    if (level >= 80) return { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' };
    if (level >= 50) return { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)' };
    if (level >= 30) return { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' };
    return { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' };
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: Mini Sparkline SVG (Temperature Graph)
// ═══════════════════════════════════════════════════════════════════════════════
function Sparkline({ data, color }: { data: number[]; color: string }) {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const w = 200;
    const h = 40;
    const points = data
        .map((v, i) => {
            const x = (i / (data.length - 1)) * w;
            const y = h - ((v - min) / range) * (h - 4) - 2;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-10" preserveAspectRatio="none">
            <defs>
                <linearGradient id={`spark-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                points={`0,${h} ${points} ${w},${h}`}
                fill={`url(#spark-fill-${color.replace('#', '')})`}
            />
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            {/* Pulsing dot at the last data point */}
            {(() => {
                const lastX = w;
                const lastY = h - ((data[data.length - 1] - min) / range) * (h - 4) - 2;
                return (
                    <>
                        <circle cx={lastX} cy={lastY} r="4" fill={color} opacity="0.4">
                            <animate attributeName="r" values="4;7;4" dur="2s" repeatCount="indefinite" />
                            <animate attributeName="opacity" values="0.4;0.1;0.4" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={lastX} cy={lastY} r="2.5" fill={color} />
                    </>
                );
            })()}
        </svg>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT: Maintenance Status Dot
// ═══════════════════════════════════════════════════════════════════════════════
function LogStatusDot({ status }: { status: 'OK' | 'WARN' | 'FAIL' }) {
    const colorMap = {
        OK: 'bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.7)]',
        WARN: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.7)]',
        FAIL: 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.7)] animate-pulse',
    };
    return <span className={`inline-block w-2 h-2 rounded-full ${colorMap[status]}`} />;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSANT CARTE — 3D FLIP  (Front + Back)
// ═══════════════════════════════════════════════════════════════════════════════
interface FlipCardProps {
    item: InventoryItem;
    mouseX: number;
    mouseY: number;
    isFlipped: boolean;
    onFlip: () => void;
}

function FlipCard({ item, mouseX, mouseY, isFlipped, onFlip }: FlipCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [localX, setLocalX] = useState(50);
    const [localY, setLocalY] = useState(50);
    const [flashVisible, setFlashVisible] = useState(false);
    const [mounted, setMounted] = useState(false);

    // ── Staggered entrance animation ──
    useEffect(() => {
        const delay = (item.id - 1) * 120;
        const timer = setTimeout(() => setMounted(true), delay);
        return () => clearTimeout(timer);
    }, [item.id]);

    useEffect(() => {
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            const x = ((mouseX - rect.left) / rect.width) * 100;
            const y = ((mouseY - rect.top) / rect.height) * 100;
            setLocalX(Math.max(0, Math.min(100, x)));
            setLocalY(Math.max(0, Math.min(100, y)));
        }
    }, [mouseX, mouseY]);

    const colors = getStatusColor(item.level);
    const isCritical = item.level < 30;

    const handleClick = useCallback(() => {
        setFlashVisible(true);
        setTimeout(() => setFlashVisible(false), 500);
        onFlip();
    }, [onFlip]);

    const logs = MAINTENANCE_LOGS[item.id] || [];
    const tempData = TEMP_DATA[item.id] || [];
    const tempUnit = TEMP_UNITS[item.id] || '°C';
    const currentTemp = tempData[tempData.length - 1];

    // ─── Shared card background style ───
    const faceStyle: React.CSSProperties = {
        background: `
            radial-gradient(circle at ${localX}% ${localY}%, ${colors.glow} 0%, transparent 50%),
            linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%),
            rgba(15, 23, 42, 0.6)
        `,
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        border: `2px solid ${isCritical ? '#ef4444' : colors.primary}40`,
        boxShadow: `
            0 0 0 1px rgba(255,255,255,0.05) inset,
            0 20px 40px -20px ${colors.glow},
            ${isCritical ? '0 0 30px rgba(239, 68, 68, 0.4)' : `0 0 60px -20px ${colors.glow}`}
        `,
    };

    return (
        /* ── 3D Perspective wrapper ── */
        <div
            className={`relative cursor-pointer [perspective:1200px] group transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${mounted ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                }`}
            onClick={handleClick}
        >
            {/* ── Click Flash Effect ── */}
            <div
                className={`absolute inset-0 z-50 rounded-2xl pointer-events-none transition-opacity duration-500 ${flashVisible ? 'opacity-100' : 'opacity-0'}`}
                style={{
                    background: `radial-gradient(circle at ${localX}% ${localY}%, ${colors.primary}60 0%, transparent 60%)`,
                    boxShadow: `inset 0 0 60px ${colors.glow}`,
                }}
            />

            {/* ── Rotating inner container ── */}
            <div
                ref={cardRef}
                className="relative w-full h-full duration-700 [transform-style:preserve-3d]"
                style={{
                    transition: 'transform 700ms cubic-bezier(0.23, 1, 0.32, 1)',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
            >
                {/* ════════════════════════════════════════════════════════════ */}
                {/* FRONT FACE — Gauge View                                    */}
                {/* ════════════════════════════════════════════════════════════ */}
                <div
                    className="absolute inset-0 overflow-hidden rounded-2xl p-6 [backface-visibility:hidden] transition-all duration-300 ease-out group-hover:scale-[1.02] group-hover:-translate-y-1"
                    style={faceStyle}
                >
                    {/* Noise texture */}
                    <div
                        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-2xl"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Top light strip */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[1px] opacity-50"
                        style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }}
                    />

                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 rounded-tl" style={{ borderColor: colors.primary }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 rounded-br" style={{ borderColor: colors.primary }} />

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">
                                    {item.type}
                                </span>
                                <h3
                                    className="text-lg font-bold tracking-wide text-white"
                                    style={{ textShadow: `0 0 30px ${colors.glow}` }}
                                >
                                    {item.name}
                                </h3>
                            </div>
                            <div
                                className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-2"
                                style={{
                                    backgroundColor: `${colors.primary}20`,
                                    color: colors.primary,
                                    boxShadow: `0 0 20px ${colors.glow}`,
                                }}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${isCritical ? 'animate-ping' : ''}`}
                                    style={{ backgroundColor: colors.primary }}
                                />
                                {item.status}
                            </div>
                        </div>

                        {/* Giant percentage */}
                        <div className="flex items-baseline gap-2 mb-4">
                            <span
                                className="text-5xl font-black font-mono tracking-tighter"
                                style={{
                                    color: colors.primary,
                                    textShadow: `0 0 40px ${colors.glow}, 0 0 80px ${colors.glow}`,
                                }}
                            >
                                {item.level}
                            </span>
                            <span className="text-2xl font-light text-slate-500">%</span>
                        </div>

                        {/* Progress bar */}
                        <div className="relative h-2 bg-slate-950/80 rounded-full overflow-hidden mb-3">
                            <div
                                className="absolute inset-0 blur-sm rounded-full"
                                style={{
                                    width: `${item.level}%`,
                                    background: `linear-gradient(90deg, ${colors.primary}80, ${colors.primary})`,
                                }}
                            />
                            <div
                                className="h-full rounded-full"
                                style={{
                                    width: `${item.level}%`,
                                    background: `linear-gradient(90deg, ${colors.primary}cc, ${colors.primary})`,
                                    boxShadow: `0 0 10px ${colors.glow}`,
                                }}
                            />
                        </div>

                        {/* Capacity info */}
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                            <span>{formatNumber(item.current)} / {formatNumber(item.max)} {item.unit}</span>
                            <span className="flex items-center gap-1 text-slate-600">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h4l3-9 4 18 3-9h4" /></svg>
                                INSPECTER
                            </span>
                        </div>
                    </div>
                </div>

                {/* ════════════════════════════════════════════════════════════ */}
                {/* BACK FACE — Inspection / Technical View                    */}
                {/* ════════════════════════════════════════════════════════════ */}
                <div
                    className="absolute inset-0 overflow-hidden rounded-2xl p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]"
                    style={faceStyle}
                >
                    {/* Noise texture */}
                    <div
                        className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-2xl"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                        }}
                    />

                    {/* Top light strip */}
                    <div
                        className="absolute top-0 left-0 right-0 h-[1px] opacity-50"
                        style={{ background: `linear-gradient(90deg, transparent, ${colors.primary}, transparent)` }}
                    />

                    {/* Corner accents */}
                    <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 rounded-tl" style={{ borderColor: colors.primary }} />
                    <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 rounded-br" style={{ borderColor: colors.primary }} />

                    {/* ── Back content ── */}
                    <div className="relative z-10 h-full flex flex-col">
                        {/* Header */}
                        <div className="flex justify-between items-center mb-3">
                            <div>
                                <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-slate-500">
                                    MODE INSPECTION
                                </span>
                                <h3
                                    className="text-sm font-bold tracking-wide text-white"
                                    style={{ textShadow: `0 0 30px ${colors.glow}` }}
                                >
                                    {item.name}
                                </h3>
                            </div>
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${colors.primary}20` }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke={colors.primary} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M9 18l6-6-6-6" />
                                </svg>
                            </div>
                        </div>

                        {/* ── Temperature Section ── */}
                        <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500">
                                    TEMPÉRATURE CŒUR
                                </span>
                                <span
                                    className="text-xs font-mono font-bold"
                                    style={{ color: colors.primary }}
                                >
                                    {currentTemp}{tempUnit}
                                </span>
                            </div>
                            <div
                                className="rounded-lg p-2 overflow-hidden"
                                style={{ backgroundColor: 'rgba(2, 6, 23, 0.6)' }}
                            >
                                <Sparkline data={tempData} color={colors.primary} />
                            </div>
                        </div>

                        {/* ── Technical Stats Grid ── */}
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)' }}>
                                <div className="text-[8px] font-mono uppercase text-slate-600 mb-0.5">DÉBIT</div>
                                <div className="text-xs font-bold font-mono" style={{ color: colors.primary }}>
                                    {(item.current / item.max * 100).toFixed(1)}%
                                </div>
                            </div>
                            <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)' }}>
                                <div className="text-[8px] font-mono uppercase text-slate-600 mb-0.5">CYCLE</div>
                                <div className="text-xs font-bold font-mono" style={{ color: colors.primary }}>
                                    {TECH_STATS[item.id]?.cycle ?? 0}
                                </div>
                            </div>
                            <div className="rounded-lg p-2 text-center" style={{ backgroundColor: 'rgba(2, 6, 23, 0.5)' }}>
                                <div className="text-[8px] font-mono uppercase text-slate-600 mb-0.5">PRESSION</div>
                                <div className="text-xs font-bold font-mono" style={{ color: colors.primary }}>
                                    {TECH_STATS[item.id]?.pressure ?? '0 atm'}
                                </div>
                            </div>
                        </div>

                        {/* ── Maintenance Logs ── */}
                        <div className="flex-1 min-h-0">
                            <div className="text-[9px] font-mono uppercase tracking-[0.2em] text-slate-500 mb-1.5">
                                JOURNAL MAINTENANCE
                            </div>
                            <div className="space-y-1.5">
                                {logs.map((log, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-2 text-[10px] font-mono rounded-md px-2 py-1"
                                        style={{ backgroundColor: 'rgba(2, 6, 23, 0.4)' }}
                                    >
                                        <LogStatusDot status={log.status} />
                                        <span className="text-slate-600 shrink-0">{log.date}</span>
                                        <span className="text-slate-400 truncate">{log.action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* ── Footer hint ── */}
                        <div className="mt-2 text-[9px] font-mono text-slate-600 text-center tracking-wider">
                            ↻ CLIQUER POUR REVENIR
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PAGE PRINCIPALE
// ═══════════════════════════════════════════════════════════════════════════════
export default function InventoryPage() {
    // ═══ HORLOGE - Initialisation directe ═══
    const [time, setTime] = useState(new Date());

    // ═══ INTERVALLE HORLOGE ═══
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // ═══ SUIVI SOURIS ═══
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ═══ FLIP STATE — Inspection Mode ═══
    const [flippedId, setFlippedId] = useState<number | null>(null);

    const handleFlip = useCallback((id: number) => {
        setFlippedId(prev => (prev === id ? null : id));
    }, []);

    // ═══ VALEURS CALCULÉES ═══
    const criticalCount = INVENTORY_DATA.filter(item => item.level < 30).length;
    const avgLevel = Math.round(INVENTORY_DATA.reduce((a, r) => a + r.level, 0) / INVENTORY_DATA.length);

    // Formater l'heure manuellement
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');
    const timeString = `${hours}:${minutes}:${seconds}`;

    return (
        <>
            {/* Empêcher la traduction automatique du navigateur */}
            <meta name="google" content="notranslate" />

            <div
                className="h-screen w-screen overflow-hidden bg-[#030712] text-white font-sans relative"
                translate="no"
                style={{
                    '--mouse-x': `${mousePos.x}px`,
                    '--mouse-y': `${mousePos.y}px`,
                } as React.CSSProperties}
            >
                {/* ═══ LUMIÈRE SOURIS GLOBALE ═══ */}
                <div
                    className="fixed inset-0 pointer-events-none z-0"
                    style={{
                        background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.06), transparent 40%)`,
                    }}
                />

                {/* ═══ FOND ═══ */}
                <div className="fixed inset-0 z-0">
                    <div
                        className="absolute inset-0 opacity-20"
                        style={{
                            backgroundImage: `
                linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
              `,
                            backgroundSize: '60px 60px',
                        }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `
                radial-gradient(ellipse at 30% 20%, rgba(139, 92, 246, 0.15) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
              `,
                        }}
                    />
                </div>

                {/* ═══ LIGNES DE BALAYAGE ═══ */}
                <div
                    className="fixed inset-0 pointer-events-none z-30 opacity-[0.015]"
                    style={{
                        background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
                    }}
                />

                {/* ═══ VIGNETTE ═══ */}
                <div
                    className="fixed inset-0 pointer-events-none z-20"
                    style={{
                        background: 'radial-gradient(ellipse at center, transparent 20%, rgba(0,0,0,0.7) 100%)',
                    }}
                />

                {/* ═══ MISE EN PAGE PRINCIPALE ═══ */}
                <div className="relative z-10 h-full flex flex-col p-6">

                    {/* ═══ EN-TÊTE ═══ */}
                    <header className="flex items-center justify-between mb-6">
                        <div suppressHydrationWarning>
                            <div className="flex items-center gap-3 mb-1">
                                <div className="h-[2px] w-12 bg-cyan-500" />
                                <span
                                    className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]"
                                    suppressHydrationWarning
                                >
                                    NEXUS-7 :: MATRICE D&apos;INVENTAIRE
                                </span>
                            </div>
                            <h1
                                className="text-4xl font-black tracking-tight"
                                suppressHydrationWarning
                            >
                                RESSOURCES <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">HUD</span>
                            </h1>
                        </div>

                        {/* ═══ HORLOGE ═══ */}
                        <div className="text-center">
                            <div
                                className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em] mb-1"
                                suppressHydrationWarning
                            >
                                HEURE SYSTÈME
                            </div>
                            <div
                                className="text-4xl font-mono font-bold tracking-[0.2em] text-cyan-400"
                                style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.8)' }}
                                suppressHydrationWarning
                            >
                                {timeString} <span className="text-lg text-cyan-600">:: LOCAL</span>
                            </div>
                        </div>

                        {/* Statistiques */}
                        <div className="flex gap-6">
                            <div className="text-right">
                                <div
                                    className="text-[9px] font-mono text-slate-600 uppercase"
                                    suppressHydrationWarning
                                >
                                    NIVEAU MOY.
                                </div>
                                <div className="text-3xl font-black text-cyan-400" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                                    {avgLevel}%
                                </div>
                            </div>
                            <div className="text-right">
                                <div
                                    className="text-[9px] font-mono text-slate-600 uppercase"
                                    suppressHydrationWarning
                                >
                                    ALERTES
                                </div>
                                <div
                                    className={`text-3xl font-black ${criticalCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}
                                    style={{ textShadow: criticalCount > 0 ? '0 0 20px rgba(239, 68, 68, 0.8)' : '0 0 20px rgba(16, 185, 129, 0.5)' }}
                                >
                                    {criticalCount}
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* ═══ GRILLE DES CARTES ═══ */}
                    <div className="flex-1 grid grid-cols-3 gap-6 auto-rows-fr">
                        {INVENTORY_DATA.map((item) => (
                            <FlipCard
                                key={item.id}
                                item={item}
                                mouseX={mousePos.x}
                                mouseY={mousePos.y}
                                isFlipped={flippedId === item.id}
                                onFlip={() => handleFlip(item.id)}
                            />
                        ))}
                    </div>

                    {/* ═══ PIED DE PAGE ═══ */}
                    <footer className="mt-6 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                        <div className="flex items-center gap-6" suppressHydrationWarning>
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                SYSTÈMES EN LIGNE
                            </div>
                            <div>SECTEUR: GAMMA-12</div>
                        </div>
                        <div className="flex items-center gap-6" suppressHydrationWarning>
                            <div>LAT: 42.3601° N</div>
                            <div className="text-cyan-500">v9.0.0-FR</div>
                        </div>
                    </footer>
                </div>
            </div>
        </>
    );
}
