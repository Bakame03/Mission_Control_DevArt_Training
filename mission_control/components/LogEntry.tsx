"use client";

import React from "react";

interface LogEntryProps {
    id: number;
    date: string;
    title: string;
    message: string;
    type: "alert" | "info";
}

const LogEntry: React.FC<LogEntryProps> = ({ date, title, message, type }) => {
    const isAlert = type === "alert";

    return (
        <div
            className={`relative pl-8 pb-8 border-l-2 ${isAlert ? "border-rose-500/50" : "border-cyan-500/30"
                } last:pb-0`}
        >
            {/* Timeline dot */}
            <div
                className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full border-2 ${isAlert
                        ? "bg-rose-500 border-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.6)]"
                        : "bg-cyan-500 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                    }`}
            />

            {/* Card */}
            <div
                className={`ml-4 p-5 rounded-xl border backdrop-blur-md transition-all hover:scale-[1.01] ${isAlert
                        ? "bg-rose-950/30 border-rose-800/50 hover:border-rose-600/60"
                        : "bg-slate-900/50 border-slate-800 hover:border-cyan-700/40"
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <span
                        className={`text-xs font-mono tracking-widest uppercase px-2.5 py-1 rounded-full border ${isAlert
                                ? "text-rose-400 bg-rose-950 border-rose-800"
                                : "text-cyan-400 bg-cyan-950 border-cyan-800"
                            }`}
                    >
                        {type}
                    </span>
                    <span className="text-xs text-slate-500 font-mono">
                        {date}
                    </span>
                </div>

                {/* Title */}
                <h3
                    className={`text-lg font-bold mb-2 ${isAlert ? "text-rose-200" : "text-slate-100"
                        }`}
                >
                    {title}
                </h3>

                {/* Message */}
                <p className="text-sm text-slate-400 leading-relaxed">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default LogEntry;
