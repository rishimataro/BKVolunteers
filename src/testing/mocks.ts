import { http, HttpResponse } from 'msw';

import { env } from '@/config/env';

const apiUrl = env.API_URL.replace(/\/$/, '');

const managerUser = {
    id: 'manager-lcd-cntt',
    username: 'lcd_cntt',
    email: 'lcd.cntt@dut.udn.vn',
    firstName: 'Ban Chấp Hành',
    lastName: 'LCĐ CNTT',
    fullName: 'Ban Chấp Hành LCĐ CNTT',
    role: 'ADMIN' as const,
    accountType: 'manager' as const,
    roleType: 'LCD_MANAGER' as const,
    facultyId: 101,
    facultyName: 'Khoa Công nghệ Thông tin',
    facultyCode: 'CNTT',
    scopeName: 'LCĐ Khoa Công nghệ Thông tin',
    dashboardType: 'faculty' as const,
    status: 'ACTIVE' as const,
    createdAt: Date.now(),
};

const adminUser = {
    id: '1',
    username: 'admin',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'User',
    fullName: 'Admin User',
    role: 'ADMIN' as const,
    accountType: 'user' as const,
    createdAt: Date.now(),
};

const handlers = [
    http.get(`${apiUrl}/api/v1/auth/me`, ({ request }) => {
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        if (authToken === 'Bearer mock-manager-token') {
            return HttpResponse.json(managerUser);
        }

        return HttpResponse.json(adminUser);
    }),

    http.post(`${apiUrl}/api/v1/auth/login`, async () => {
        return HttpResponse.json({
            user: adminUser,
            accessToken: 'mock-token',
        });
    }),

    http.post(`${apiUrl}/api/v1/auth/manager/login`, async ({ request }) => {
        const body = (await request.json().catch(() => ({}))) as {
            identifier?: string;
            password?: string;
        };

        const identifier = body.identifier?.toLowerCase() ?? '';

        if (!identifier.includes('lcd')) {
            return HttpResponse.json(
                {
                    message: 'ERR_INVALID_MANAGER_CREDENTIALS',
                },
                { status: 401 },
            );
        }

        return HttpResponse.json({
            user: managerUser,
            accessToken: 'mock-manager-token',
        });
    }),

    http.post(`${apiUrl}/api/v1/auth/logout`, () => {
        return new HttpResponse(null, { status: 200 });
    }),

    http.post(`${apiUrl}/api/v1/auth/refresh`, ({ request }) => {
        const authToken = request.headers.get('Authorization');
        return HttpResponse.json({
            accessToken:
                authToken === 'Bearer mock-manager-token'
                    ? 'mock-manager-token'
                    : 'mock-refreshed-token',
        });
    }),

    http.post(`${apiUrl}/api/v1/password/forgot-password`, () => {
        return HttpResponse.json({
            message:
                'Email khôi phục mật khẩu đã được gửi nếu email tồn tại trong hệ thống.',
        });
    }),

    http.post(`${apiUrl}/api/v1/password/reset-password/:token`, () => {
        return HttpResponse.json({
            message: 'Mật khẩu đã được đặt lại thành công.',
        });
    }),

    http.post(`${apiUrl}/api/v1/verify-email/send-verification-email`, () => {
        return HttpResponse.json({
            message: 'Email xác minh đã được gửi.',
        });
    }),

    http.get(`${apiUrl}/api/v1/verify-email/:token`, () => {
        return HttpResponse.json({
            message: 'Email đã được xác minh thành công.',
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
