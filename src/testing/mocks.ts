import { http, HttpResponse } from 'msw';
import { env } from '@/config/env';

const apiUrl = env.API_URL.replace(/\/$/, '');

const handlers = [
    http.get(`${apiUrl}/api/v1/auth/me`, ({ request }) => {
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }
        return HttpResponse.json({
            id: '1',
            email: 'admin@example.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
        });
    }),

    http.post(`${apiUrl}/api/v1/auth/login`, () => {
        return HttpResponse.json({
            user: {
                id: '1',
                email: 'admin@example.com',
                firstName: 'Admin',
                lastName: 'User',
                role: 'ADMIN',
            },
            accessToken: 'mock-token',
        });
    }),
];

export const enableMocking = async () => {
    if (!env.ENABLE_API_MOCKING || typeof window === 'undefined') {
        return;
    }
    const { setupWorker } = await import('msw/browser');
    const worker = setupWorker(...handlers);
    return worker.start({
        onUnhandledRequest: 'bypass',
    });
};
