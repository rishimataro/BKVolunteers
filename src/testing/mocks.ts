import { http, HttpResponse, delay } from 'msw';
import { env } from '@/config/env';

const apiUrl = env.API_URL.replace(/\/$/, '');

// Mock data
const mockUsers = [
    {
        id: '1',
        username: 'admin',
        email: 'admin@sv.dut.udn.vn',
        firstName: 'Admin',
        lastName: 'User',
        role: 'ADMIN',
        createdAt: Date.now(),
    },
    {
        id: '2',
        username: 'volunteer1',
        email: 'volunteer1@sv.dut.udn.vn',
        firstName: 'Nguyen',
        lastName: 'Van A',
        role: 'USER',
        createdAt: Date.now() - 86400000,
    },
];

const mockCampaigns = [
    {
        id: '1',
        name: 'Chiến dịch mùa hè xanh 2025',
        description: 'Tham gia dọn dẹp bãi biển',
        startDate: Date.now() + 7 * 86400000,
        endDate: Date.now() + 14 * 86400000,
        status: 'ACTIVE',
        createdAt: Date.now(),
    },
    {
        id: '2',
        name: 'Hỗ trợ người cao tuổi',
        description: 'Thăm hỏi và hỗ trợ người cao tuổi cô đơn',
        startDate: Date.now() + 3 * 86400000,
        endDate: Date.now() + 10 * 86400000,
        status: 'ACTIVE',
        createdAt: Date.now() - 86400000,
    },
];

const mockActivities = [
    {
        id: '1',
        campaignId: '1',
        userId: '2',
        name: 'Dọn dẹp bãi biển',
        location: 'Biển Nha Trang',
        status: 'REGISTERED',
        createdAt: Date.now(),
    },
];

const handlers = [
    // ========================================
    // Auth APIs
    // ========================================
    http.get(`${apiUrl}/api/v1/auth/me`, async ({ request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (
            !authToken ||
            authToken === 'Bearer null' ||
            authToken === 'Bearer undefined'
        ) {
            return new HttpResponse(null, { status: 401 });
        }
        return HttpResponse.json({
            id: '1',
            username: 'admin',
            email: 'admin@sv.dut.udn.vn',
            firstName: 'Admin',
            lastName: 'User',
            role: 'ADMIN',
            createdAt: Date.now(),
        });
    }),

    http.post(`${apiUrl}/api/v1/auth/login`, async ({ request }) => {
        await delay(200);
        const body = (await request.json()) as {
            email?: string;
            password?: string;
        };

        // Demo credentials check
        if (
            body?.email?.includes('@sv.dut.udn.vn') &&
            body?.password?.length >= 6
        ) {
            return HttpResponse.json({
                user: mockUsers[0],
                accessToken: 'mock-login-token',
            });
        }

        return HttpResponse.json(
            { success: false, message: 'Email hoặc mật khẩu không đúng' },
            { status: 401 },
        );
    }),

    http.post(`${apiUrl}/api/v1/auth/signup`, async ({ request }) => {
        await delay(200);
        const body = (await request.json()) as {
            email?: string;
            username?: string;
        };

        // Check if email already exists (for demo)
        if (body?.email === 'admin@sv.dut.udn.vn') {
            return HttpResponse.json(
                { success: false, message: 'Email đã được sử dụng' },
                { status: 409 },
            );
        }

        return HttpResponse.json({
            user: {
                id: '3',
                username: body?.username || 'newuser',
                email: body?.email || 'new@sv.dut.udn.vn',
                firstName: 'New',
                lastName: 'User',
                role: 'USER',
                createdAt: Date.now(),
            },
            accessToken: 'mock-signup-token',
        });
    }),

    http.post(`${apiUrl}/api/v1/auth/logout`, async () => {
        await delay(100);
        return new HttpResponse(null, { status: 200 });
    }),

    http.post(`${apiUrl}/api/v1/auth/refresh`, async () => {
        await delay(100);
        return HttpResponse.json({
            success: true,
            data: {
                accessToken: 'mock-refreshed-token',
            },
        });
    }),

    // ========================================
    // Password APIs
    // ========================================
    http.post(
        `${apiUrl}/api/v1/password/forgot-password`,
        async ({ request }) => {
            await delay(200);
            const body = (await request.json()) as { email?: string };

            if (!body?.email) {
                return HttpResponse.json(
                    { success: false, message: 'Email là bắt buộc' },
                    { status: 400 },
                );
            }

            return HttpResponse.json({
                success: true,
                message: 'Email khôi phục mật khẩu đã được gửi.',
            });
        },
    ),

    http.post(
        `${apiUrl}/api/v1/password/reset-password/:token`,
        async ({ params }) => {
            await delay(200);
            const { token } = params;

            if (!token || token === 'invalid') {
                return HttpResponse.json(
                    {
                        success: false,
                        message: 'Token không hợp lệ hoặc đã hết hạn',
                    },
                    { status: 400 },
                );
            }

            return HttpResponse.json({
                success: true,
                message: 'Mật khẩu đã được đặt lại thành công.',
            });
        },
    ),

    // ========================================
    // Email Verification APIs
    // ========================================
    http.post(
        `${apiUrl}/api/v1/verify-email/send-verification-email`,
        async ({ request }) => {
            await delay(200);
            const body = (await request.json()) as { email?: string };

            if (!body?.email) {
                return HttpResponse.json(
                    { success: false, message: 'Email là bắt buộc' },
                    { status: 400 },
                );
            }

            return HttpResponse.json({
                success: true,
                message: 'Email xác minh đã được gửi.',
            });
        },
    ),

    http.get(`${apiUrl}/api/v1/verify-email/:token`, async ({ params }) => {
        await delay(200);
        const { token } = params;

        if (!token || token === 'invalid') {
            return HttpResponse.json(
                {
                    success: false,
                    message: 'Token không hợp lệ hoặc đã hết hạn',
                },
                { status: 400 },
            );
        }

        return HttpResponse.json({
            success: true,
            message: 'Email đã được xác minh thành công.',
        });
    }),

    // ========================================
    // User APIs (for future use)
    // ========================================
    http.get(`${apiUrl}/api/v1/users`, async ({ request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        return HttpResponse.json({
            success: true,
            data: mockUsers,
            meta: {
                page: 1,
                total: mockUsers.length,
                totalPages: 1,
            },
        });
    }),

    http.get(`${apiUrl}/api/v1/users/:id`, async ({ params, request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        const user = mockUsers.find((u) => u.id === params.id);
        if (!user) {
            return HttpResponse.json(
                { success: false, message: 'Không tìm thấy người dùng' },
                { status: 404 },
            );
        }

        return HttpResponse.json({
            success: true,
            data: user,
        });
    }),

    // ========================================
    // Campaign APIs (for future use)
    // ========================================
    http.get(`${apiUrl}/api/v1/campaigns`, async ({ request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        return HttpResponse.json({
            success: true,
            data: mockCampaigns,
            meta: {
                page: 1,
                total: mockCampaigns.length,
                totalPages: 1,
            },
        });
    }),

    http.get(`${apiUrl}/api/v1/campaigns/:id`, async ({ params, request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        const campaign = mockCampaigns.find((c) => c.id === params.id);
        if (!campaign) {
            return HttpResponse.json(
                { success: false, message: 'Không tìm thấy chiến dịch' },
                { status: 404 },
            );
        }

        return HttpResponse.json({
            success: true,
            data: campaign,
        });
    }),

    // ========================================
    // Activity APIs (for future use)
    // ========================================
    http.get(`${apiUrl}/api/v1/activities`, async ({ request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        return HttpResponse.json({
            success: true,
            data: mockActivities,
            meta: {
                page: 1,
                total: mockActivities.length,
                totalPages: 1,
            },
        });
    }),

    http.post(`${apiUrl}/api/v1/activities`, async ({ request }) => {
        await delay(200);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        const body = await request.json();

        return HttpResponse.json({
            success: true,
            data: {
                id: '3',
                ...body,
                status: 'REGISTERED',
                createdAt: Date.now(),
            },
        });
    }),

    // ========================================
    // Error Simulation Handlers
    // ========================================
    // 403 Forbidden - for testing authorization errors
    http.get(`${apiUrl}/api/v1/admin/users`, async ({ request }) => {
        await delay(100);
        const authToken = request.headers.get('Authorization');
        if (!authToken || authToken === 'Bearer null') {
            return new HttpResponse(null, { status: 401 });
        }

        return HttpResponse.json(
            { success: false, message: 'Bạn không có quyền truy cập' },
            { status: 403 },
        );
    }),

    // 500 Internal Server Error - for testing error handling
    http.get(`${apiUrl}/api/v1/health`, async () => {
        await delay(100);
        return HttpResponse.json(
            { success: false, message: 'Lỗi server nội bộ' },
            { status: 500 },
        );
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
