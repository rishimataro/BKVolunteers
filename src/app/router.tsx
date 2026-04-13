import {
    createBrowserRouter,
    RouterProvider,
    Navigate,
    Outlet,
} from 'react-router';

import { DashboardLayout } from '@/components/layouts';
import { paths } from '@/config/paths';
import { ManagerOnlyRoute, ProtectedRoute } from '@/features/auth';

export const AppRouter = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            lazy: async () => {
                const { LandingRoute } = await import('./routes/landing');
                return { Component: LandingRoute };
            },
        },
        {
            path: paths.auth.login.path,
            lazy: async () => {
                const { LoginPage } = await import('./routes/auth/login');
                return { Component: LoginPage };
            },
        },
        {
            path: paths.manager.login.path,
            lazy: async () => {
                const { ManagerLoginPage } =
                    await import('./routes/auth/manager-login');
                return { Component: ManagerLoginPage };
            },
        },
        {
            path: paths.auth.forgotPassword.path,
            lazy: async () => {
                const { ForgotPasswordPage } =
                    await import('./routes/auth/forgot-password');
                return { Component: ForgotPasswordPage };
            },
        },
        {
            path: paths.auth.verifyCode.path,
            lazy: async () => {
                const { VerifyCodePage } =
                    await import('./routes/auth/verify-code');
                return { Component: VerifyCodePage };
            },
        },
        {
            path: paths.auth.resetPassword.path,
            lazy: async () => {
                const { ResetPasswordPage } =
                    await import('./routes/auth/reset-password');
                return { Component: ResetPasswordPage };
            },
        },
        {
            path: paths.app.root.path,
            element: (
                <ProtectedRoute>
                    <DashboardLayout>
                        <Outlet />
                    </DashboardLayout>
                </ProtectedRoute>
            ),
            children: [
                {
                    element: (
                        <ManagerOnlyRoute>
                            <Outlet />
                        </ManagerOnlyRoute>
                    ),
                    children: [
                        {
                            path: paths.app.campaignCreate.path,
                            lazy: () =>
                                import('@/app/routes/app/lcd_clb/campaign_manage/campaign-create').then(
                                    (m) => ({
                                        Component: m.CampaignCreateRoute,
                                    }),
                                ),
                        },
                    ],
                },
            ],
        },
        {
            path: '*',
            element: <Navigate to="/" />,
        },
    ]);

    return <RouterProvider router={router} />;
};
