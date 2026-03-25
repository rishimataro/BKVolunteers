import { AuthLayout } from '@/components/layouts';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const ForgotPasswordPage = () => {
    return (
        <AuthLayout title="Forgot your password?">
            <ForgotPasswordForm />
        </AuthLayout>
    );
};
