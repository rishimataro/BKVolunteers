import { paths } from '@/config/paths';
import type { User } from '@/types/api';

export const isManagerAccount = (
    user: User | null | undefined,
): user is User & { accountType: 'manager' } => user?.accountType === 'manager';

export const getDisplayName = (user: User) =>
    user.fullName || `${user.firstName} ${user.lastName}`.trim();

export const getRoleLabel = (user: User) => {
    if (user.accountType === 'manager') {
        if (user.roleType === 'CLB_MANAGER') return 'Quản trị CLB';
        if (user.roleType === 'LCD_MANAGER') return 'Quản trị LCĐ';
        return 'Quản trị Đoàn trường';
    }

    if (user.role === 'STUDENT') return 'Sinh viên';
    if (user.role === 'ADMIN') return 'Quản trị hệ thống';
    return 'Người dùng';
};

export const getScopeLabel = (user: User) => {
    if (!isManagerAccount(user)) {
        return null;
    }

    if (user.roleType === 'CLB_MANAGER') {
        return user.clubName || user.scopeName || 'CLB';
    }

    if (user.roleType === 'LCD_MANAGER') {
        return user.facultyName || user.scopeName || 'LCĐ';
    }

    return user.scopeName || 'Đoàn trường';
};

export const getPostLoginPath = (user: User, redirectTo?: string | null) => {
    if (isManagerAccount(user)) {
        return redirectTo || paths.app.dashboard.getHref();
    }

    return paths.app.profile.getHref();
};
