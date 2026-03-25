import Axios, { type InternalAxiosRequestConfig, type AxiosError } from 'axios';

import { useNotifications } from '@/components/ui/notifications';
import { env } from '@/config/env';
import { useAuthStore } from '@/store/auth-store';
import { HttpStatus } from '@/types/http';

let isRefreshing = false;

type PromiseHandler = {
    resolve: (token: string | null) => void;
    reject: (error: unknown) => void;
};

let failedQueue: PromiseHandler[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

export const setAccessToken = (token: string | null) => {
    const { user, setAuth } = useAuthStore.getState();
    setAuth(user, token);
};

function authRequestInterceptor(config: InternalAxiosRequestConfig) {
    if (config.headers) {
        config.headers.Accept = 'application/json';
        const token = useAuthStore.getState().accessToken;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }

    config.withCredentials = true;

    return config;
}

export const api = Axios.create({
    baseURL: `${env.API_URL.replace(/\/$/, '')}/api/v1`,
});

api.interceptors.request.use(authRequestInterceptor);
api.interceptors.response.use(
    (response) => {
        const data = response.data;
        if (data && data.success && data.data && data.data.accessToken) {
            setAccessToken(data.data.accessToken);
        }
        return data?.data || data;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };
        const data = error.response?.data as { message?: string } | undefined;
        const message = data?.message || error.message;

        if (
            error.response?.status === HttpStatus.UNAUTHORIZED &&
            !originalRequest._retry &&
            originalRequest.url !== '/auth/refresh'
        ) {
            if (isRefreshing) {
                return new Promise<string | null>((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const response = (await api.post('/auth/refresh')) as {
                    accessToken: string;
                };
                const { accessToken: newToken } = response;
                setAccessToken(newToken);
                processQueue(null, newToken);
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                useAuthStore.getState().clearAuth();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response?.status !== HttpStatus.UNAUTHORIZED) {
            useNotifications.getState().addNotification({
                type: 'error',
                title: 'Error',
                message,
            });
        }

        return Promise.reject(error);
    },
);
