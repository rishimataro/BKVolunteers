import { Menu, Sun, Moon, Bell, Search } from 'lucide-react';
import { useTheme } from 'next-themes';
import * as React from 'react';
import { NavLink, useNavigation } from 'react-router';

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
        <div className="fixed top-0 left-0 z-[100] h-1 w-full bg-muted">
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

    return (
        <header className="sticky top-0 z-40 flex h-20 items-center justify-between bg-background/80 px-4 backdrop-blur-md sm:px-8">
            <Progress />
            {/* Mobile Menu */}
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
                    <DrawerContent className="h-full w-[280px] rounded-none border-none p-0 focus:outline-none">
                        <div className="flex h-20 items-center  px-6 bg-card">
                            <Logo />
                        </div>
                        <nav className="space-y-2 p-4 pt-6">
                            {navigation.map((item) => (
                                <NavLink
                                    key={item.name}
                                    to={item.to}
                                    className={({ isActive }) =>
                                        cn(
                                            'flex items-center gap-4 rounded-xl px-4 py-3.5 text-base font-semibold transition-all',
                                            isActive
                                                ? 'bg-bk-blue text-white'
                                                : 'text-muted-foreground hover:bg-muted',
                                        )
                                    }
                                >
                                    <item.icon className="size-6" />
                                    <span>{item.name}</span>
                                </NavLink>
                            ))}
                        </nav>
                    </DrawerContent>
                </Drawer>
                <Logo collapsed />
            </div>

            {/* Search Bar Placeholder */}
            <div className="hidden md:flex flex-1 max-w-md">
                <div className="relative w-full group">
                    <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-bk-blue" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm nhanh..."
                        className="h-11 w-full rounded-full border bg-muted/30 pl-11 pr-4 text-sm transition-all focus:bg-background focus:outline-none focus:ring-2 focus:ring-bk-blue/20"
                    />
                </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden sm:flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-muted-foreground"
                    >
                        <Bell className="size-5" />
                    </Button>
                    <ThemeToggle />
                </div>

                <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>

                <UserMenu />
            </div>
        </header>
    );
};
