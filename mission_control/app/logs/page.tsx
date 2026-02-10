import React from "react";
import LogEntry from "@/components/LogEntry";
import logsData from "@/data/logs.json";

export default function LogsPage() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 p-8">
            <div className="max-w-3xl mx-auto">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
                        Captain&apos;s <span className="text-cyan-500">Log</span>
                    </h1>
                    <p className="text-slate-400 text-sm font-mono uppercase tracking-widest">
                        Mission Timeline — All Events
                    </p>
                </div>

                {/* Timeline */}
                <div className="mt-6">
                    {logsData.map((log) => (
                        <LogEntry
                            key={log.id}
                            id={log.id}
                            date={log.date}
                            title={log.title}
                            message={log.message}
                            type={log.type as "alert" | "info"}
                        />
                    ))}
                </div>
            </div>
        </main>
    );
}
