import React from 'react';

import type { User } from '@/types/api';

import { useUser } from './auth-provider';

export const ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    STUDENT: 'STUDENT',
} as const;

export type RoleTypes = keyof typeof ROLES;

export const POLICIES = () => {
    return true;
};

export const useAuthorization = () => {
    const user = useUser();
    const currentUser = user.data as User | null | undefined;

    const checkAccess = React.useCallback(
        ({ allowedRoles }: { allowedRoles: RoleTypes[] }) => {
            if (allowedRoles && allowedRoles.length > 0 && currentUser) {
                return allowedRoles.includes(currentUser.role);
            }
            return true;
        },
        [currentUser],
    );

    return { checkAccess, role: currentUser?.role };
};
