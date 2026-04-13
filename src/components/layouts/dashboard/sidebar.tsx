import { ChevronRight } from 'lucide-react';
import { NavLink, useLocation } from 'react-router';

import { paths } from '@/config/paths';
import { cn } from '@/lib/utils';
import { Logo } from './navigation';
import { useNavigationItems } from './navigation-utils';

export const Sidebar = () => {
    const location = useLocation();
    const navigation = useNavigationItems();

    return (
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-72 flex-col border-r border-white/60 bg-white/75 backdrop-blur-xl sm:flex">
            <div className="flex h-20 items-center px-6">
                <Logo />
            </div>
            <nav className="flex-1 space-y-2 overflow-y-auto p-4 pt-6">
                {navigation.map((item) => (
                    <NavLink
                        key={item.name}
                        to={item.to}
                        end={item.to === paths.app.dashboard.getHref()}
                        className={({ isActive }) =>
                            cn(
                                'group block rounded-2xl px-4 py-3 transition-all duration-200',
                                isActive
                                    ? 'bg-bk-blue text-white shadow-lg shadow-bk-blue/20'
                                    : 'text-slate-600 hover:bg-white hover:text-slate-900',
                            )
                        }
                    >
                        {({ isActive }) => (
                            <div className="flex gap-3">
                                <div
                                    className={cn(
                                        'mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl',
                                        isActive
                                            ? 'bg-white/15 text-white'
                                            : 'bg-slate-100 text-bk-blue',
                                    )}
                                >
                                    <item.icon className="size-5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="truncate text-sm font-semibold">
                                            {item.name}
                                        </span>
                                        {location.pathname === item.to && (
                                            <ChevronRight className="ml-auto size-4 opacity-70" />
                                        )}
                                    </div>
                                    {item.children && (
                                        <p
                                            className={cn(
                                                'mt-1 text-xs leading-5',
                                                isActive
                                                    ? 'text-white/75'
                                                    : 'text-slate-500',
                                            )}
                                        >
                                            {item.children.join(' • ')}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div className="p-4">
                <div className="rounded-[24px] border border-bk-blue/10 bg-gradient-to-br from-bk-blue/10 via-white to-transparent p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-bk-blue/60">
                        Hệ thống
                    </p>
                    <p className="mt-1 text-sm font-bold text-slate-900">
                        BK Volunteers
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                        Workspace LCĐ/CLB 2026
                    </p>
                </div>
            </div>
        </aside>
    );
};
