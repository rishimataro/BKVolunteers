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

const getAuthToken = () => {
    return useAuthStore.getState().accessToken;
};

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public data?: unknown,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

type RequestOptions = {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
};

const baseURL = `${env.API_URL.replace(/\/$/, '')}/api/v1`;

async function request<T>(
    url: string,
    options: RequestOptions = {},
): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const token = getAuthToken();
    const requestHeaders: Record<string, string> = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
    };

    if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers: requestHeaders,
        credentials: 'include',
    };

    if (body) {
        config.body = JSON.stringify(body);
    }

    let response: Response;

    try {
        response = await fetch(`${baseURL}${url}`, config);
    } catch (networkError) {
        throw new ApiError(
            networkError instanceof Error
                ? networkError.message
                : 'Network error',
            0,
        );
    }

    let responseData: unknown;
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
        responseData = await response.json();
    } else {
        responseData = await response.text();
    }

    const isSuccess = response.ok;
    const data = responseData as {
        success?: boolean;
        data?: unknown;
        message?: string;
        accessToken?: string;
    };

    // Auto-refresh token if present in response
    if (
        data &&
        data.success &&
        data.data &&
        typeof data.data === 'object' &&
        'accessToken' in data.data
    ) {
        setAccessToken((data.data as { accessToken: string }).accessToken);
    }

    // Handle 401 Unauthorized - token refresh
    if (
        response.status === HttpStatus.UNAUTHORIZED &&
        url !== '/auth/refresh'
    ) {
        if (isRefreshing) {
            return new Promise<T>((resolve, reject) => {
                failedQueue.push({
                    resolve: resolve as (token: string | null) => void,
                    reject,
                });
            }).then(() => request(url, options));
        }

        isRefreshing = true;

        try {
            const refreshResponse = await fetch(`${baseURL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                },
                credentials: 'include',
            });

            if (!refreshResponse.ok) {
                throw new ApiError(
                    'Token refresh failed',
                    refreshResponse.status,
                );
            }

            const refreshData = (await refreshResponse.json()) as {
                data?: { accessToken?: string };
            };

            if (refreshData.data?.accessToken) {
                setAccessToken(refreshData.data.accessToken);
                processQueue(null, refreshData.data.accessToken);
            }

            // Retry original request with NEW token (rebuild config to avoid stale token)
            const newToken = getAuthToken();
            const retryHeaders: Record<string, string> = {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...headers,
            };
            if (newToken) {
                retryHeaders.Authorization = `Bearer ${newToken}`;
            }
            const retryConfig: RequestInit = {
                method,
                headers: retryHeaders,
                credentials: 'include',
            };
            if (body) {
                retryConfig.body = JSON.stringify(body);
            }

            const retryResponse = await fetch(`${baseURL}${url}`, retryConfig);
            // Check content-type before parsing JSON (same as initial request)
            const retryContentType = retryResponse.headers.get('content-type');
            let retryData: unknown;
            if (retryContentType?.includes('application/json')) {
                retryData = await retryResponse.json();
            } else {
                retryData = await retryResponse.text();
            }

            if (!retryResponse.ok) {
                throw new ApiError(
                    (retryData as { message?: string })?.message ||
                        'Request failed',
                    retryResponse.status,
                    retryData,
                );
            }

            isRefreshing = false;
            return (retryData as { data?: T })?.data ?? (retryData as T);
        } catch (refreshError) {
            processQueue(refreshError, null);
            useAuthStore.getState().clearAuth();
            isRefreshing = false;
            throw refreshError;
        }
    }

    if (!isSuccess) {
        const message =
            data?.message || `Request failed with status ${response.status}`;

        // Show notification for non-401 errors
        if (response.status !== HttpStatus.UNAUTHORIZED) {
            useNotifications.getState().addNotification({
                type: 'error',
                title: 'Error',
                message,
            });
        }

        throw new ApiError(message, response.status, data);
    }

    return data?.data ?? (data as T);
}

// Helper methods matching axios API
export const api = {
    get: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'GET' }),

    post: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'POST', body }),

    put: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'PUT', body }),

    patch: <T>(url: string, body?: unknown, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'PATCH', body }),

    delete: <T>(url: string, options?: RequestOptions) =>
        request<T>(url, { ...options, method: 'DELETE' }),
};
