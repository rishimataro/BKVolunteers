import React from 'react';
import { Navigate, useLocation } from 'react-router';

import { paths } from '@/config/paths';
import type { User } from '@/types/api';

import { useUser } from './auth-provider';
import { useAuthorization, type RoleTypes } from './authorization-hooks';
import { isManagerAccount } from './session-utils';

type AuthorizationProps = {
    forbiddenFallback?: React.ReactNode;
    children: React.ReactNode;
} & (
    | {
          allowedRoles: RoleTypes[];
          policyCheck?: never;
      }
    | {
          allowedRoles?: RoleTypes[];
          policyCheck: boolean;
      }
);

export const Authorization = ({
    policyCheck,
    allowedRoles,
    forbiddenFallback = null,
    children,
}: AuthorizationProps) => {
    const { checkAccess } = useAuthorization();
    let canAccess = false;

    if (allowedRoles) {
        canAccess = checkAccess({ allowedRoles });
    }

    if (typeof policyCheck !== 'undefined') {
        canAccess = policyCheck;
    }

    return <>{canAccess ? children : forbiddenFallback}</>;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const user = useUser();
    const location = useLocation();

    if (!user.data) {
        return (
            <Navigate
                to={paths.auth.login.getHref(location.pathname)}
                replace
            />
        );
    }

    return children;
};

export const ManagerOnlyRoute = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const user = useUser();
    const currentUser = user.data as User | null | undefined;
    const location = useLocation();

    if (!currentUser) {
        return (
            <Navigate
                to={paths.auth.login.getHref(location.pathname)}
                replace
            />
        );
    }

    if (!isManagerAccount(currentUser)) {
        return <Navigate to={paths.app.profile.getHref()} replace />;
    }

    return children;
};
