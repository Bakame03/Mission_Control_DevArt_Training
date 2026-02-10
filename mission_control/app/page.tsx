import React from 'react';
import Link from 'next/link';

export default function Home() {
    return (
        <main className="min-h-screen bg-[#020617] text-slate-200 flex flex-col items-center justify-center p-24 font-sans">
            <h1 className="text-6xl font-black text-white mb-8 tracking-tighter">
                MISSION <span className="text-cyan-500">CONTROL</span>
            </h1>
            <p className="text-xl text-slate-400 mb-12 max-w-lg text-center leading-relaxed">
                Welcome to the central command hub. Select a module below to begin monitoring mission status.
            </p>
            <div className="flex gap-6">
                <Link
                    href="/inventory"
                    className="px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:scale-105"
                >
                    Access Inventory System
                </Link>
                <Link
                    href="/logs"
                    className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-bold transition-all shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:scale-105"
                >
                    Captain's Log
                </Link>
            </div>
        </main>
    );
}
