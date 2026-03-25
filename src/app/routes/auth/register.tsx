import { useNavigate } from 'react-router';
import { AuthLayout } from '@/components/layouts';
import { RegisterForm } from '@/features/auth/components/register-form';
import { paths } from '@/config/paths';

export const RegisterPage = () => {
    const navigate = useNavigate();

    return (
        <AuthLayout title="Create your account">
            <RegisterForm
                onSuccess={() => navigate(paths.auth.login.getHref())}
            />
        </AuthLayout>
    );
};
