import { Bell, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { NavLink, useLocation, useNavigation } from 'react-router';

import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { cn } from '@/lib/utils';
import { Logo } from './navigation';
import { useNavigationItems } from './navigation-utils';
import { UserMenu } from './user-menu';

const Progress = () => {
    const { state } = useNavigation();
    const [progress, setProgress] = React.useState(0);

    React.useEffect(() => {
        if (state !== 'loading') return;
        const timer = setInterval(() => {
            setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 200);
        return () => {
            clearInterval(timer);
            setProgress(0);
        };
    }, [state]);

    if (state !== 'loading') return null;

    return (
        <div className="fixed left-0 top-0 z-[100] h-1 w-full bg-muted">
            <div
                className="h-full bg-bk-blue transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
};

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return <div className="size-9" />;

    return (
        <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? (
                <Sun className="size-5 text-yellow-500" />
            ) : (
                <Moon className="size-5 text-slate-700" />
            )}
        </Button>
    );
};

export const Header = () => {
    const navigation = useNavigationItems();
    const { pathname } = useLocation();
    const currentItem = navigation
        .filter(
            (item) =>
                pathname === item.to ||
                (item.to !== '/app' && pathname.startsWith(`${item.to}/`)),
        )
        .sort((left, right) => right.to.length - left.to.length)[0];
    const pageTitle = currentItem?.name || 'Tổng quan';

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-white/50 bg-white/60 px-4 backdrop-blur-md sm:px-8">
            <Progress />
            <div className="flex items-center gap-4 sm:hidden">
                <Drawer direction="left">
                    <DrawerTrigger asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                        >
                            <Menu className="size-6" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-full w-[300px] rounded-none border-none bg-white p-0 focus:outline-none">
                        <div className="flex h-20 items-center px-6">
                            <Logo />
                        </div>
                        <nav className="space-y-2 p-4 pt-6">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        cn(
                                            'block rounded-2xl px-4 py-3.5 transition-all',
                                            isActive
                                                ? 'bg-bk-blue text-white'
                                                : 'text-slate-600 hover:bg-slate-50',
                                        )
                                    }
                                >
                                    {({ isActive }) => (
                                        <div className="flex gap-3">
                                            <item.icon className="mt-0.5 size-5 shrink-0" />
                                            <div>
                                                <div className="font-semibold">
                                                    {item.name}
                                                </div>
                                                {item.children && (
                                                    <div
                                                        className={cn(
                                                            'mt-1 text-xs leading-5',
                                                            isActive
                                                                ? 'text-white/70'
                                                                : 'text-slate-500',
                                                        )}
                                                    >
                                                        {item.children.join(
                                                            ' • ',
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </NavLink>
                            ))}
                        </nav>
                    </DrawerContent>
                </Drawer>
                <Logo collapsed />
            </div>

            <div className="hidden max-w-xl flex-1 md:block">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-bk-blue/60">
                    Workspace LCĐ/CLB
                </p>
                <h2 className="mt-1 text-xl font-bold text-slate-900">
                    {pageTitle}
                </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden items-center gap-2 sm:flex">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-muted-foreground"
                    >
                        <Bell className="size-5" />
                    </Button>
                    <ThemeToggle />
                </div>
                <div className="mx-1 hidden h-8 w-px bg-border sm:block" />
                <UserMenu />
            </div>
        </header>
    );
};
