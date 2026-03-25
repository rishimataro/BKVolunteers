import { zodResolver } from '@hookform/resolvers/zod';
import * as React from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';

import { useRegister } from '../lib/auth-provider';
import { registerInputSchema, type RegisterInput } from '../types';

type RegisterFormProps = {
    onSuccess: () => void;
};

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
    const { addNotification } = useNotifications();
    const register = useRegister({
        onSuccess: () => {
            addNotification({
                type: 'success',
                title: 'Success',
                message: 'Account created successfully',
            });
            onSuccess();
        },
    });

    const {
        register: registerField,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerInputSchema),
    });

    const onSubmit = (data: RegisterInput) => {
        register.mutate(data);
    };

    return (
        <div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="mt-1">
                        <Input
                            id="firstName"
                            type="text"
                            {...registerField('firstName')}
                        />
                        {errors.firstName && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.firstName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <div className="mt-1">
                        <Input
                            id="lastName"
                            type="text"
                            {...registerField('lastName')}
                        />
                        {errors.lastName && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.lastName.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="username">Username</Label>
                    <div className="mt-1">
                        <Input
                            id="username"
                            type="text"
                            autoComplete="username"
                            {...registerField('username')}
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="email">Email Address</Label>
                    <div className="mt-1">
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            {...registerField('email')}
                        />
                        {errors.email && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="password">Password</Label>
                    <div className="mt-1">
                        <Input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            {...registerField('password')}
                        />
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Label htmlFor="passwordConfirmed">Confirm Password</Label>
                    <div className="mt-1">
                        <Input
                            id="passwordConfirmed"
                            type="password"
                            autoComplete="new-password"
                            {...registerField('passwordConfirmed')}
                        />
                        {errors.passwordConfirmed && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.passwordConfirmed.message}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <Button
                        type="submit"
                        className="w-full"
                        disabled={register.isPending}
                    >
                        {register.isPending
                            ? 'Creating Account...'
                            : 'Register'}
                    </Button>
                </div>
            </form>

            <div className="mt-6">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="bg-white px-2 text-gray-500">
                            Already have an account?
                        </span>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <Link to={paths.auth.login.getHref()}>Log in</Link>
                </div>
            </div>
        </div>
    );
};
