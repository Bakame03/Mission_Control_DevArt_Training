"use client";

import React, { useEffect, useState, useRef } from 'react';

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

// ═══════════════════════════════════════════════════════════════════════════════
// STATIC DATA - Production Ready
// ═══════════════════════════════════════════════════════════════════════════════
const INVENTORY_DATA: InventoryItem[] = [
    { id: 1, name: "OXYGEN", level: 87, status: "NOMINAL", unit: "L", max: 15000, current: 13050, type: "GAS" },
    { id: 2, name: "WATER", level: 42, status: "WARNING", unit: "L", max: 8000, current: 3360, type: "LIQUID" },
    { id: 3, name: "PLASMA FUEL", level: 93, status: "OPTIMAL", unit: "TW", max: 500, current: 465, type: "ENERGY" },
    { id: 4, name: "BIO-RATIONS", level: 18, status: "CRITICAL", unit: "kg", max: 2000, current: 360, type: "SOLID" },
    { id: 5, name: "SHIELD POWER", level: 64, status: "STABLE", unit: "%", max: 100, current: 64, type: "ENERGY" },
    { id: 6, name: "REACTOR CORE", level: 100, status: "PEAK", unit: "MW", max: 1200, current: 1200, type: "ENERGY" },
];

// ═══════════════════════════════════════════════════════════════════════════════
// COLOR UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════
const getStatusColor = (level: number) => {
    if (level >= 80) return { primary: '#10b981', glow: 'rgba(16, 185, 129, 0.6)' };
    if (level >= 50) return { primary: '#06b6d4', glow: 'rgba(6, 182, 212, 0.6)' };
    if (level >= 30) return { primary: '#f59e0b', glow: 'rgba(245, 158, 11, 0.6)' };
    return { primary: '#ef4444', glow: 'rgba(239, 68, 68, 0.8)' };
};

// ═══════════════════════════════════════════════════════════════════════════════
// GLASS CARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
interface GlassCardProps {
    item: InventoryItem;
    mouseX: number;
    mouseY: number;
}

const GlassCard: React.FC<GlassCardProps> = ({ item, mouseX, mouseY }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [localX, setLocalX] = useState(50);
    const [localY, setLocalY] = useState(50);

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

    return (
        <div
            ref={cardRef}
            className="group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 ease-out hover:scale-[1.02] hover:-translate-y-1"
            style={{
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
            }}
        >
            {/* Noise texture */}
            <div
                className="absolute inset-0 opacity-[0.08] mix-blend-overlay pointer-events-none rounded-2xl"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Light reflection */}
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

                <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>{item.current.toLocaleString()} / {item.max.toLocaleString()} {item.unit}</span>
                    <span>CAPACITY</span>
                </div>
            </div>
        </div>
    );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE - AGGRESSIVE CLOCK WITH suppressHydrationWarning
// ═══════════════════════════════════════════════════════════════════════════════
export default function InventoryPage() {
    // ═══ CLOCK - Direct initialization with current time ═══
    const [time, setTime] = useState(new Date());

    // ═══ CLOCK INTERVAL - Live updates every second ═══
    useEffect(() => {
        const intervalId = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(intervalId);
    }, []);

    // ═══ MOUSE TRACKING ═══
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // ═══ STATIC COMPUTED VALUES ═══
    const criticalCount = INVENTORY_DATA.filter(item => item.level < 30).length;
    const avgLevel = Math.round(INVENTORY_DATA.reduce((a, r) => a + r.level, 0) / INVENTORY_DATA.length);

    return (
        <div
            className="h-screen w-screen overflow-hidden bg-[#030712] text-white font-sans relative"
            style={{
                '--mouse-x': `${mousePos.x}px`,
                '--mouse-y': `${mousePos.y}px`,
            } as React.CSSProperties}
        >
            {/* ═══ GLOBAL MOUSE LIGHT ═══ */}
            <div
                className="fixed inset-0 pointer-events-none z-0"
                style={{
                    background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(6, 182, 212, 0.06), transparent 40%)`,
                }}
            />

            {/* ═══ BACKGROUND ═══ */}
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

            {/* ═══ SCANLINES ═══ */}
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

            {/* ═══ MAIN LAYOUT ═══ */}
            <div className="relative z-10 h-full flex flex-col p-6">

                {/* ═══ HEADER ═══ */}
                <header className="flex items-center justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="h-[2px] w-12 bg-cyan-500" />
                            <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-[0.4em]">
                                NEXUS-7 :: INVENTORY MATRIX
                            </span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight">
                            RESOURCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">HUD</span>
                        </h1>
                    </div>

                    {/* ═══ CLOCK - With suppressHydrationWarning ═══ */}
                    <div className="text-center">
                        <div className="text-[9px] font-mono text-slate-600 uppercase tracking-[0.3em] mb-1">
                            SYSTEM TIME
                        </div>
                        <div
                            className="text-4xl font-mono font-bold tracking-[0.2em] text-cyan-400"
                            style={{ textShadow: '0 0 30px rgba(6, 182, 212, 0.8)' }}
                            suppressHydrationWarning
                        >
                            {time.toLocaleTimeString('fr-FR')} <span className="text-lg text-cyan-600">:: LOCAL</span>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-6">
                        <div className="text-right">
                            <div className="text-[9px] font-mono text-slate-600 uppercase">AVG LEVEL</div>
                            <div className="text-3xl font-black text-cyan-400" style={{ textShadow: '0 0 20px rgba(6, 182, 212, 0.5)' }}>
                                {avgLevel}%
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-[9px] font-mono text-slate-600 uppercase">ALERTS</div>
                            <div
                                className={`text-3xl font-black ${criticalCount > 0 ? 'text-red-500' : 'text-emerald-500'}`}
                                style={{ textShadow: criticalCount > 0 ? '0 0 20px rgba(239, 68, 68, 0.8)' : '0 0 20px rgba(16, 185, 129, 0.5)' }}
                            >
                                {criticalCount}
                            </div>
                        </div>
                    </div>
                </header>

                {/* ═══ CARDS GRID ═══ */}
                <div className="flex-1 grid grid-cols-3 gap-6 auto-rows-fr">
                    {INVENTORY_DATA.map((item) => (
                        <GlassCard
                            key={item.id}
                            item={item}
                            mouseX={mousePos.x}
                            mouseY={mousePos.y}
                        />
                    ))}
                </div>

                {/* ═══ FOOTER ═══ */}
                <footer className="mt-6 flex items-center justify-between text-[10px] font-mono text-slate-600 uppercase tracking-wider">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                            SYSTEMS ONLINE
                        </div>
                        <div>SECTOR: GAMMA-12</div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div>LAT: 42.3601° N</div>
                        <div className="text-cyan-500">v6.0.0-PRODUCTION</div>
                    </div>
                </footer>
            </div>
        </div>
    );
}
