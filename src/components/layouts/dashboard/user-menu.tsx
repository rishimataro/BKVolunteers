import { LogOut, Settings, User } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { paths } from '@/config/paths';
import {
    getDisplayName,
    getRoleLabel,
    useLogout,
    useUser,
} from '@/features/auth';
import type { User as AppUser } from '@/types/api';

export const UserMenu = () => {
    const navigate = useNavigate();
    const user = useUser();
    const currentUser = user.data as AppUser | null | undefined;
    const logout = useLogout({
        onSuccess: () => navigate(paths.auth.login.getHref()),
    });

    if (!currentUser) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    className="flex items-center gap-3 rounded-full px-2 py-1.5 hover:bg-muted sm:px-3 focus-visible:ring-0"
                >
                    <div className="flex size-9 items-center justify-center rounded-full bg-bk-blue text-white shadow-md">
                        <User className="size-5" />
                    </div>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-bold leading-tight">
                            {getDisplayName(currentUser)}
                        </p>
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                            {getRoleLabel(currentUser)}
                        </p>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuPortal>
                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    className="z-[100] w-72 overflow-hidden rounded-2xl border border-border/40 bg-popover p-0 shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                >
                    <div className="border-b border-border/50 bg-muted/40 px-5 py-5">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-bk-blue text-base font-extrabold text-white shadow-lg shadow-bk-blue/20">
                                {currentUser.firstName?.[0]}
                                {currentUser.lastName?.[0]}
                            </div>
                            <div className="min-w-0 flex flex-col">
                                <p className="truncate text-sm font-extrabold leading-tight">
                                    {getDisplayName(currentUser)}
                                </p>
                                <p className="mt-0.5 truncate text-xs font-medium text-muted-foreground">
                                    {currentUser.email}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-2">
                        <DropdownMenuGroup>
                            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                                Cá nhân
                            </DropdownMenuLabel>
                            <DropdownMenuItem
                                onClick={() =>
                                    navigate(paths.app.profile.getHref())
                                }
                                className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-colors focus:bg-bk-blue/5"
                            >
                                <User className="mr-3 size-4.5 text-muted-foreground transition-colors group-focus/item:text-bk-blue" />
                                <span className="font-semibold">
                                    Hồ sơ của tôi
                                </span>
                            </DropdownMenuItem>
                            {currentUser.role !== 'STUDENT' && (
                                <DropdownMenuItem
                                    onClick={() =>
                                        navigate(paths.app.settings.getHref())
                                    }
                                    className="group/item cursor-pointer rounded-xl px-3 py-2.5 transition-colors focus:bg-bk-blue/5"
                                >
                                    <Settings className="mr-3 size-4.5 text-muted-foreground transition-colors group-focus/item:text-bk-blue" />
                                    <span className="font-semibold">
                                        Cài đặt hệ thống
                                    </span>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="my-2 mx-1 opacity-50" />

                        <DropdownMenuItem
                            onClick={() => logout.mutate({})}
                            className="cursor-pointer rounded-xl px-3 py-2.5 text-destructive transition-colors focus:bg-destructive focus:text-destructive-foreground"
                        >
                            <LogOut className="mr-3 size-4.5" />
                            <span className="font-bold">Đăng xuất</span>
                        </DropdownMenuItem>
                    </div>
                </DropdownMenuContent>
            </DropdownMenuPortal>
        </DropdownMenu>
    );
};
