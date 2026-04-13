import React from 'react';

import { Sidebar } from './dashboard/sidebar';
import { Header } from './dashboard/header';
import { Head } from '../seo';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head title="BK Volunteers LCĐ/CLB" />
            <div className="relative flex min-h-screen w-full overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(0,101,189,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_45%,_#f7f9fc_100%)] text-foreground transition-colors duration-300">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.54),transparent_35%,transparent_65%,rgba(255,255,255,0.4))]" />
                <Sidebar />
                <div className="relative flex flex-1 flex-col sm:pl-72">
                    <Header />
                    <main className="flex-1 p-4 sm:p-8">
                        <div className="mx-auto max-w-7xl animate-fade-in-up">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
