import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ApiError, api } from '../fetch-client';

// Mock dependencies - must use factory functions to avoid hoisting issues
vi.mock('@/components/ui/notifications', () => ({
    useNotifications: {
        getState: () => ({
            addNotification: vi.fn(),
            notifications: [],
            dismissNotification: vi.fn(),
        }),
    },
}));

vi.mock('@/store/auth-store', () => ({
    useAuthStore: {
        getState: () => ({
            accessToken: null,
            setAuth: vi.fn(),
            clearAuth: vi.fn(),
            user: null,
        }),
    },
}));

vi.mock('@/config/env', () => ({
    env: {
        API_URL: 'http://localhost:3000',
    },
}));

describe('ApiError', () => {
    it('should create ApiError with message, status, and data', () => {
        const error = new ApiError('Error message', 400, { field: 'error' });
        expect(error.message).toBe('Error message');
        expect(error.status).toBe(400);
        expect(error.data).toEqual({ field: 'error' });
        expect(error.name).toBe('ApiError');
    });
});

describe('api', () => {
    let fetchMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        fetchMock = vi.fn();
        global.fetch = fetchMock;
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('GET', () => {
        it('should call fetch with GET method', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            const result = await api.get('/test');

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/test',
                expect.objectContaining({ method: 'GET' }),
            );
            expect(result).toEqual({ id: 1 });
        });

        it('should include auth token in headers when token exists', async () => {
            // Re-mock with vi.fn() to allow mocking
            vi.mock('@/store/auth-store', () => ({
                useAuthStore: {
                    getState: vi.fn(() => ({
                        accessToken: 'test-token',
                        setAuth: vi.fn(),
                        clearAuth: vi.fn(),
                        user: null,
                    })),
                },
            }));

            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            await api.get('/test');

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/test',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Authorization: 'Bearer test-token',
                    }),
                }),
            );
        });
    });

    describe('POST', () => {
        it('should call fetch with POST method and body', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            const body = { email: 'test@example.com', password: 'password' };
            const result = await api.post('/auth/login', body);

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/auth/login',
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(body),
                }),
            );
            expect(result).toEqual({ id: 1 });
        });
    });

    describe('PUT', () => {
        it('should call fetch with PUT method', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            const body = { name: 'Updated Name' };
            await api.put('/users/1', body);

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/users/1',
                expect.objectContaining({
                    method: 'PUT',
                    body: JSON.stringify(body),
                }),
            );
        });
    });

    describe('PATCH', () => {
        it('should call fetch with PATCH method', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            const body = { firstName: 'New' };
            await api.patch('/users/1', body);

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/users/1',
                expect.objectContaining({
                    method: 'PATCH',
                    body: JSON.stringify(body),
                }),
            );
        });
    });

    describe('DELETE', () => {
        it('should call fetch with DELETE method', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            await api.delete('/users/1');

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/users/1',
                expect.objectContaining({ method: 'DELETE' }),
            );
        });
    });

    describe('Error handling', () => {
        it('should throw ApiError on failed response', async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 400,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({
                    success: false,
                    message: 'Validation error',
                }),
            });

            await expect(api.get('/test')).rejects.toThrow(ApiError);
        });

        it('should include status in ApiError', async () => {
            fetchMock.mockResolvedValue({
                ok: false,
                status: 404,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({
                    success: false,
                    message: 'Not found',
                }),
            });

            try {
                await api.get('/test');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                if (error instanceof ApiError) {
                    expect(error.status).toBe(404);
                }
            }
        });

        it('should include response data in ApiError', async () => {
            const responseData = { error: 'Invalid email', field: 'email' };
            fetchMock.mockResolvedValue({
                ok: false,
                status: 422,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({
                    success: false,
                    message: 'Validation failed',
                    ...responseData,
                }),
            });

            try {
                await api.get('/test');
            } catch (error) {
                expect(error).toBeInstanceOf(ApiError);
                if (error instanceof ApiError) {
                    expect(error.data).toMatchObject(responseData);
                }
            }
        });
    });

    describe('Request configuration', () => {
        it('should include Accept header', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            await api.get('/test');

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/test',
                expect.objectContaining({
                    headers: expect.objectContaining({
                        Accept: 'application/json',
                    }),
                }),
            );
        });

        it('should include credentials include', async () => {
            fetchMock.mockResolvedValue({
                ok: true,
                headers: new Headers({ 'content-type': 'application/json' }),
                json: async () => ({ success: true, data: { id: 1 } }),
            });

            await api.get('/test');

            expect(fetchMock).toHaveBeenCalledWith(
                'http://localhost:3000/api/v1/test',
                expect.objectContaining({
                    credentials: 'include',
                }),
            );
        });
    });
});
