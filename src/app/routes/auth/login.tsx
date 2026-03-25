import { useNavigate, useSearchParams } from 'react-router';

import { AuthLayout } from '@/components/layouts';
import { paths } from '@/config/paths';
import { LoginForm } from '@/features/auth';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo');

    return (
        <AuthLayout title="Đăng nhập">
            <LoginForm
                onSuccess={() =>
                    navigate(redirectTo || paths.app.dashboard.getHref(), {
                        replace: true,
                    })
                }
            />
        </AuthLayout>
    );
};
