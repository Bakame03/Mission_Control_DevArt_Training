"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
    { href: "/", label: "Dashboard" },
    { href: "/crew", label: "Crew" },
    { href: "/inventory", label: "Inventory" },
    { href: "/logs", label: "Logs" },
];

export default function Navbar() {
    const pathname = usePathname();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <span className="text-lg font-black tracking-tighter text-white group-hover:text-cyan-400 transition-colors">
                        MISSION <span className="text-cyan-500">CTRL</span>
                    </span>
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                </Link>

                {/* Nav Links */}
                <div className="flex items-center gap-1">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-4 py-2 rounded-lg text-sm font-medium tracking-wide uppercase transition-all ${isActive
                                        ? "bg-cyan-600/20 text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]"
                                        : "text-slate-400 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                </div>
            </div>
        </nav>
    );
}
