"use client";

import React, { useEffect, useState } from 'react';

interface ResourceItem {
    id: number;
    name: string;
    level: number;
    status: string;
    type: string;
    description: string;
    trend: 'up' | 'down' | 'stable';
    unit: string;
    maxCapacity: number;
    currentAmount: number;
}

interface ResourceCardProps {
    resource: ResourceItem;
    index: number;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource, index }) => {
    const [animatedLevel, setAnimatedLevel] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimatedLevel(resource.level);
        }, 100 + index * 150);
        return () => clearTimeout(timer);
    }, [resource.level, index]);

    const isCritical = resource.level < 30;
    const isWarning = resource.level >= 30 && resource.level < 50;

    const getGlowColor = () => {
        if (isCritical) return 'shadow-[0_0_30px_rgba(239,68,68,0.4)] border-red-500/60';
        if (isWarning) return 'shadow-[0_0_25px_rgba(251,191,36,0.3)] border-amber-500/50';
        return 'shadow-[0_0_20px_rgba(6,182,212,0.25)] border-cyan-500/30';
    };

    const getProgressGradient = () => {
        if (isCritical) return 'from-red-600 via-red-500 to-orange-500';
        if (isWarning) return 'from-amber-600 via-yellow-500 to-amber-400';
        return 'from-cyan-600 via-teal-500 to-emerald-400';
    };

    const getTrendIcon = () => {
        switch (resource.trend) {
            case 'up':
                return (
                    <span className="text-emerald-400 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                        </svg>
                        HAUSSE
                    </span>
                );
            case 'down':
                return (
                    <span className="text-red-400 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        BAISSE
                    </span>
                );
            default:
                return (
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
                        </svg>
                        STABLE
                    </span>
                );
        }
    };

    const getTypeColor = () => {
        switch (resource.type) {
            case 'Gaz': return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
            case 'Liquide': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
            case 'Solide': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
            case 'Énergie': return 'bg-violet-500/20 text-violet-300 border-violet-500/30';
            default: return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
        }
    };

    return (
        <div
            className={`
        group relative overflow-hidden rounded-2xl
        bg-slate-900/40 backdrop-blur-xl
        border-2 transition-all duration-500 ease-out
        hover:scale-[1.02] hover:bg-slate-900/60
        ${getGlowColor()}
        ${isCritical ? 'animate-pulse' : ''}
      `}
        >
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Corner accents */}
            <div className={`absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 rounded-tl-2xl ${isCritical ? 'border-red-500' : 'border-cyan-500/50'}`} />
            <div className={`absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 rounded-br-2xl ${isCritical ? 'border-red-500' : 'border-cyan-500/50'}`} />

            <div className="p-6 relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h3 className="text-xl font-bold text-white tracking-wide uppercase">
                                {resource.name}
                            </h3>
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getTypeColor()}`}>
                                {resource.type}
                            </span>
                        </div>
                        <p className="text-xs text-slate-400 font-mono leading-relaxed max-w-[280px]">
                            {resource.description}
                        </p>
                    </div>

                    {/* Status indicator */}
                    <div className={`
            flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider
            ${isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/40' :
                            isWarning ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' :
                                'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'}
          `}>
                        <span className={`w-2 h-2 rounded-full ${isCritical ? 'bg-red-500 animate-ping' : isWarning ? 'bg-amber-500' : 'bg-emerald-500'}`} />
                        {resource.status}
                    </div>
                </div>

                {/* Giant percentage display */}
                <div className="flex items-end justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                        <span className={`
              text-6xl font-black tracking-tighter font-mono
              ${isCritical ? 'text-red-400' : isWarning ? 'text-amber-400' : 'text-cyan-400'}
              drop-shadow-[0_0_10px_currentColor]
            `}>
                            {animatedLevel}
                        </span>
                        <span className="text-2xl text-slate-500 font-light">%</span>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-slate-300 font-mono">
                            {resource.currentAmount.toLocaleString()} <span className="text-slate-500">/ {resource.maxCapacity.toLocaleString()}</span> {resource.unit}
                        </div>
                        <div className="mt-1">
                            {getTrendIcon()}
                        </div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="relative h-4 bg-slate-950/80 rounded-full overflow-hidden border border-slate-700/50">
                    {/* Background glow */}
                    <div
                        className={`absolute inset-0 blur-sm bg-gradient-to-r ${getProgressGradient()} opacity-30`}
                        style={{ width: `${animatedLevel}%` }}
                    />

                    {/* Main bar */}
                    <div
                        className={`
              h-full bg-gradient-to-r ${getProgressGradient()} 
              rounded-full relative overflow-hidden
              transition-all duration-1000 ease-out
            `}
                        style={{ width: `${animatedLevel}%` }}
                    >
                        {/* Shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    </div>

                    {/* Grid lines */}
                    <div className="absolute inset-0 flex">
                        {[...Array(10)].map((_, i) => (
                            <div key={i} className="flex-1 border-r border-slate-700/30 last:border-r-0" />
                        ))}
                    </div>
                </div>

                {/* Capacity markers */}
                <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-600">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                </div>
            </div>

            {/* Critical alert overlay */}
            {isCritical && (
                <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse" />
            )}
        </div>
    );
};

export default ResourceCard;
