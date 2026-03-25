import { useSearchParams, Navigate } from 'react-router';
import { AuthLayout } from '@/components/layouts';
import { ResetPasswordForm } from '@/features/auth/components/reset-password-form';
import { paths } from '@/config/paths';

export const ResetPasswordPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        return <Navigate to={paths.auth.login.getHref()} />;
    }

    return (
        <AuthLayout title="Reset your password">
            <ResetPasswordForm token={token} />
        </AuthLayout>
    );
};
