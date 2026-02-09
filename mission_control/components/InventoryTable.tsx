"use client";

import React from 'react';

interface InventoryItem {
    id: number;
    name: string;
    level: number;
    status: string;
}

interface InventoryTableProps {
    items: InventoryItem[];
}

const InventoryTable: React.FC<InventoryTableProps> = ({ items }) => {
    const getProgressBarColor = (level: number) => {
        if (level >= 70) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
        if (level >= 30) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
        return 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse';
    };

    const getStatusColor = (level: number) => {
        if (level >= 70) return 'text-emerald-400';
        if (level >= 30) return 'text-amber-400';
        return 'text-rose-400 font-bold';
    };

    return (
        <div className="w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/80">
                <h2 className="text-xl font-bold text-slate-100 tracking-wider uppercase">System Resources</h2>
                <div className="flex gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
                    <span className="text-xs text-slate-400 font-mono uppercase tracking-tighter">Live Telemetry</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-950/50">
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800">Resource</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800">Status</th>
                            <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-widest border-b border-slate-800 w-1/2">Capacity Level</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                        {items.map((item) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <span className="text-slate-100 font-medium group-hover:text-cyan-400 transition-colors">{item.name}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`text-sm px-2.5 py-0.5 rounded-full bg-slate-950 border border-slate-800 ${getStatusColor(item.level)}`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                                            <div
                                                className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressBarColor(item.level)}`}
                                                style={{ width: `${item.level}%` }}
                                            ></div>
                                        </div>
                                        <span className={`text-sm font-mono min-w-[3rem] text-right ${getStatusColor(item.level)}`}>
                                            {item.level}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryTable;
