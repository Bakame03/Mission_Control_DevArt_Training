import React from 'react';
import InventoryTable from '@/components/InventoryTable';
import inventoryData from '@/data/inventory.json';

const InventoryPage = () => {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 p-8 md:p-12 lg:p-20 font-sans selection:bg-cyan-500/30">
            <div className="max-w-6xl mx-auto space-y-12">
                {/* Header Section */}
                <header className="space-y-4">
                    <div className="flex items-center gap-3 text-cyan-500">
                        <div className="h-[2px] w-12 bg-cyan-500/50"></div>
                        <span className="text-sm font-mono uppercase tracking-[0.3em]">Module: Inventory & Logistics</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-2">
                        Mission <span className="text-cyan-500">Control</span> Status Board
                    </h1>
                    <p className="text-slate-400 max-w-2xl text-lg leading-relaxed">
                        Real-time monitoring of critical life support systems and mission essential resources.
                        All values are synchronized with orbital telemetry.
                    </p>
                </header>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 gap-8">
                    <section className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-mono text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-500"></span>
                                Inventory Overview
                            </h3>
                            <div className="text-[10px] font-mono text-slate-600 uppercase">
                                Last Updated: {new Date().toLocaleTimeString()} UTC
                            </div>
                        </div>

                        <InventoryTable items={inventoryData} />
                    </section>
                </div>

                {/* Footer info/legend */}
                <footer className="pt-12 border-t border-slate-900 grid grid-cols-1 md:grid-cols-3 gap-8 text-xs font-mono text-slate-500 uppercase tracking-wider">
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                        <span>Levels 70-100%: Optimal</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        <span>Levels 30-69%: Caution</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-rose-500 animate-pulse"></div>
                        <span>Levels &lt;30%: Critical Alert</span>
                    </div>
                </footer>
            </div>
        </main>
    );
};

export default InventoryPage;
