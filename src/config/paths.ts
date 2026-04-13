export const paths = {
    home: {
        path: '/',
        getHref: () => '/',
    },

    manager: {
        login: {
            path: '/manager/login',
            getHref: (redirectTo?: string | null | undefined) =>
                `/manager/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
        },
    },

    auth: {
        register: {
            path: '/auth/register',
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
        },
        login: {
            path: '/auth/login',
            getHref: (redirectTo?: string | null | undefined) =>
                `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ''}`,
        },
        forgotPassword: {
            path: '/auth/forgot-password',
            getHref: () => '/auth/forgot-password',
        },
        verifyCode: {
            path: '/auth/verify-code',
            getHref: () => '/auth/verify-code',
        },
        resetPassword: {
            path: '/auth/reset-password',
            getHref: () => '/auth/reset-password',
        },
        verifyEmail: {
            path: '/auth/verify-email',
            getHref: (token: string) => `/auth/verify-email?token=${token}`,
        },
    },

    app: {
        root: {
            path: '/app',
            getHref: () => '/app',
        },
        dashboard: {
            path: '',
            getHref: () => '/app',
        },
        campaigns: {
            path: 'campaigns',
            getHref: () => '/app/campaigns',
        },
        campaignCreate: {
            path: 'campaigns/new',
            getHref: () => '/app/campaigns/new',
        },
        volunteers: {
            path: 'volunteers',
            getHref: () => '/app/volunteers',
        },
        attendance: {
            path: 'attendance',
            getHref: () => '/app/attendance',
        },
        certificates: {
            path: 'certificates',
            getHref: () => '/app/certificates',
        },
        tickets: {
            path: 'tickets',
            getHref: () => '/app/tickets',
        },
        profile: {
            path: 'profile',
            getHref: () => '/app/profile',
        },
        settings: {
            path: 'settings',
            getHref: () => '/app/settings',
        },
    },
} as const;
