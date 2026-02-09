import React from 'react';
import './globals.css';

export const metadata = {
    title: 'Mission Control',
    description: 'Mission Inventory and Resource Management',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-[#020617]">{children}</body>
        </html>
    );
}
