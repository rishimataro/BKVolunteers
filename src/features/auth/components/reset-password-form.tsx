import * as React from 'react';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';

import { resetPassword } from '../api/auth';

type ResetPasswordFormProps = {
    token: string;
};

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const { addNotification } = useNotifications();
    const navigate = useNavigate();

    const mutation = useMutation({
        mutationFn: (data: { newPassword: string }) =>
            resetPassword(token, data),
        onSuccess: (data) => {
            addNotification({
                type: 'success',
                title: 'Success',
                message: data.message || 'Password reset successfully',
            });
            navigate(paths.auth.login.getHref());
        },
    });

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        if (newPassword !== confirmPassword) {
            addNotification({
                type: 'error',
                title: 'Error',
                message: "Passwords don't match",
            });
            return;
        }

        mutation.mutate({ newPassword });
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Label htmlFor="newPassword">New Password</Label>
                    <div className="mt-1">
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            required
                        />
                    </div>
                </div>

                <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <div className="mt-1">
                        <Input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                        />
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={mutation.isPending}
                    >
                        {mutation.isPending ? 'Resetting...' : 'Reset Password'}
                    </Button>
                </div>
            </form>

            <div className="mt-6 text-center">
                <Link to={paths.auth.login.getHref()}>Back to login</Link>
            </div>
        </div>
    );
};
