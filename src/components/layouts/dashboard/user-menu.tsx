import { LogOut, User, Settings } from 'lucide-react';
import { useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { paths } from '@/config/paths';
import { useLogout, useUser } from '@/features/auth';

export const UserMenu = () => {
    const navigate = useNavigate();
    const user = useUser();
    const logout = useLogout({
        onSuccess: () => navigate(paths.auth.login.getHref()),
    });

    if (!user.data) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    // Xóa z-[100] ở trigger vì nó không cần thiết, quan trọng là phần Content
                    className="flex items-center gap-3 rounded-full px-2 py-1.5 hover:bg-muted sm:px-3 focus-visible:ring-0"
                >
                    <div className="flex size-9 items-center justify-center rounded-full bg-bk-blue text-white shadow-md">
                        <User className="size-5" />
                    </div>
                    <div className="hidden text-left sm:block">
                        <p className="text-sm font-bold leading-tight">
                            {user.data.firstName} {user.data.lastName}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                            {user.data.role}
                        </p>
                    </div>
                </Button>
            </DropdownMenuTrigger>

            {/* Portal giúp menu thoát khỏi overflow:hidden của cha (như Sidebar/Header) */}
            <DropdownMenuPortal>
                <DropdownMenuContent
                    align="end"
                    sideOffset={8}
                    // z-[100] ở đây mới là quan trọng để không bị đè
                    className="z-[100] w-72 p-0 overflow-hidden rounded-2xl shadow-2xl border border-border/40 bg-popover ring-1 ring-black/5 dark:ring-white/10"
                >
                    {/* User Profile Summary Section */}
                    <div className="bg-muted/40 px-5 py-5 border-b border-border/50">
                        <div className="flex items-center gap-4">
                            <div className="flex size-12 items-center justify-center rounded-2xl bg-bk-blue text-white font-extrabold text-base shadow-lg shadow-bk-blue/20">
                                {user.data.firstName?.[0]}
                                {user.data.lastName?.[0]}
                            </div>
                            <div className="flex flex-col min-w-0">
                                <p className="text-sm font-extrabold truncate leading-tight">
                                    {user.data.firstName} {user.data.lastName}
                                </p>
                                <p className="text-xs text-muted-foreground truncate mt-0.5 font-medium">
                                    {user.data.email}
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
                                className="group/item rounded-xl px-3 py-2.5 cursor-pointer transition-colors focus:bg-bk-blue/5"
                            >
                                <User className="mr-3 size-4.5 text-muted-foreground transition-colors group-focus/item:text-bk-blue" />
                                <span className="font-semibold">
                                    Hồ sơ của tôi
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="group/item rounded-xl px-3 py-2.5 cursor-pointer transition-colors focus:bg-bk-blue/5">
                                <Settings className="mr-3 size-4.5 text-muted-foreground transition-colors group-focus/item:text-bk-blue" />
                                <span className="font-semibold">
                                    Cài đặt hệ thống
                                </span>
                            </DropdownMenuItem>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="my-2 mx-1 opacity-50" />

                        <DropdownMenuItem
                            onClick={() => logout.mutate({})}
                            className="rounded-xl px-3 py-2.5 cursor-pointer transition-colors text-destructive focus:bg-destructive focus:text-destructive-foreground"
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
