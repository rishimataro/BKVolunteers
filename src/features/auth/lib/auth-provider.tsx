/* eslint-disable react-refresh/only-export-components */

import {
    useMutation,
    useQueryClient,
    type UseMutationOptions,
} from '@tanstack/react-query';
import { configureAuth } from 'react-query-auth';

import type { User } from '@/types/api';
import { useAuthStore } from '@/store/auth-store';

import {
    getUser,
    loginManagerWithIdentifierAndPassword,
    loginWithUsernameAndPassword,
    logout as apiLogout,
} from '../api/auth';
import type { LoginInput, ManagerLoginInput } from '../types';

export const AUTHENTICATED_USER_QUERY_KEY = ['authenticated-user'] as const;

const authConfig = {
    userFn: async () => {
        const { user, accessToken } = useAuthStore.getState();

        // Nếu store đã có sẵn user + token từ localStorage thì dùng lại ngay,
        // giúp người dùng giữ phiên đăng nhập sau khi refresh trang.
        if (user && accessToken) {
            return user;
        }

        if (accessToken) {
            try {
                const fetchedUser = await getUser();
                // Khi app khởi động lại chỉ còn token, gọi /auth/me để lấy lại profile
                // rồi ghi ngược vào store nhằm khôi phục session đầy đủ.
                useAuthStore.getState().setAuth(fetchedUser, accessToken);
                return fetchedUser;
            } catch {
                useAuthStore.getState().clearAuth();
                return null;
            }
        }

        return null;
    },
    loginFn: async (data: LoginInput) => {
        const response = await loginWithUsernameAndPassword(data);
        // Sau khi backend trả về accessToken + user, lưu cả hai vào auth-store.
        // Vì auth-store có persist nên session đăng nhập sẽ được giữ lại trong localStorage.
        useAuthStore.getState().setAuth(response.user, response.accessToken);
        return response.user;
    },
    logoutFn: async () => {
        try {
            await apiLogout();
        } finally {
            useAuthStore.getState().clearAuth();
        }
    },
    userKey: AUTHENTICATED_USER_QUERY_KEY,
};

export const { useUser, useLogin, useLogout, AuthLoader } =
    configureAuth(authConfig);

export const useManagerLogin = (
    options?: Omit<
        UseMutationOptions<User, Error, ManagerLoginInput>,
        'mutationFn'
    >,
) => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (data: ManagerLoginInput) => {
            const response = await loginManagerWithIdentifierAndPassword(data);
            useAuthStore
                .getState()
                .setAuth(response.user, response.accessToken);
            return response.user;
        },
        ...options,
        onSuccess: (user, ...rest) => {
            queryClient.setQueryData(AUTHENTICATED_USER_QUERY_KEY, user);
            options?.onSuccess?.(user, ...rest);
        },
    });
};
