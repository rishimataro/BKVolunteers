import { useSearchParams, Navigate } from 'react-router';
import { AuthLayout } from '@/components/layouts';
import { VerifyEmail } from '@/features/auth/components/verify-email';
import { paths } from '@/config/paths';

export const VerifyEmailPage = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    if (!token) {
        return <Navigate to={paths.auth.login.getHref()} />;
    }

    return (
        <AuthLayout title="Verify your email">
            <VerifyEmail token={token} />
        </AuthLayout>
    );
};
