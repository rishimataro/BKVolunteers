import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { Loader2, Mail, Lock, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { HttpStatus } from '@/types/http';

import { sendVerificationEmail } from '../api/auth';
import { useLogin } from '../lib/auth-provider';
import { loginInputSchema, type LoginInput } from '../types';
import { MicrosoftIcon } from '@/components/ui/icon';

type LoginFormProps = {
    onSuccess: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
    const { addNotification } = useNotifications();
    const login = useLogin({
        onSuccess,
    });

    const [isEmailUnverified, setIsEmailUnverified] = React.useState(false);
    const [unverifiedEmail, setUnverifiedEmail] = React.useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginInput>({
        resolver: zodResolver(loginInputSchema),
    });

    const resendVerification = useMutation({
        mutationFn: () => sendVerificationEmail(unverifiedEmail),
        onSuccess: (data) => {
            addNotification({
                type: 'success',
                title: 'Success',
                message: data.message || 'Verification email sent',
            });
            setIsEmailUnverified(false);
        },
    });

    const onSubmit = async (data: LoginInput) => {
        try {
            await login.mutateAsync(data);
        } catch (error) {
            const axiosError = error as AxiosError;
            const apiData = axiosError.response?.data as {
                message?: string;
                error?: string;
            };

            const msg =
                apiData?.message ||
                'Đăng nhập thất bại. Vui lòng kiểm tra lại.';

            addNotification({
                type: 'error',
                title: 'Đăng nhập thất bại',
                message: msg,
            });

            if (
                axiosError.response?.status === HttpStatus.UNAUTHORIZED &&
                (apiData?.message?.includes('verified') ||
                    apiData?.error === 'EmailNotVerified')
            ) {
                setIsEmailUnverified(true);
                setUnverifiedEmail(data.email);
            }
        }
    };

    return (
        <div className="w-full max-w-md animate-fade-in-up">
            <div className="mb-10 text-center sm:text-left">
                <img
                    src="/logo-bkvolunteers.png"
                    alt="Logo"
                    className="h-14 mb-6 mx-auto sm:mx-0"
                />
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Đăng nhập
                </h1>
                <p className="text-gray-500 mt-2 text-sm">
                    Quản lý hoạt động kỹ thuật số. Kết nối sinh viên và hỗ trợ
                    quá trình hoạt động Đoàn - Hội.
                </p>
            </div>

            {isEmailUnverified && (
                <div className="mb-6 flex items-start p-4 rounded-xl border bg-yellow-50 border-yellow-200 text-sm shadow-sm">
                    <AlertCircle className="w-5 h-5 mr-3 shrink-0 mt-0.5 text-yellow-600" />
                    <div className="flex-1">
                        <h3 className="font-semibold text-yellow-800">
                            Email not verified
                        </h3>
                        <p className="text-yellow-700 mt-1">
                            Your email address is not verified. Please check
                            your inbox or click below to resend.
                        </p>
                        <Button
                            size="sm"
                            variant="outline"
                            className="mt-3 bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-100"
                            onClick={() => resendVerification.mutate()}
                            disabled={resendVerification.isPending}
                        >
                            {resendVerification.isPending
                                ? 'Sending...'
                                : 'Resend Verification'}
                        </Button>
                    </div>
                </div>
            )}

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                noValidate
            >
                <div>
                    <Label
                        className="block text-gray-700 text-sm font-bold mb-1.5"
                        htmlFor="email"
                    >
                        Tên đăng nhập (Email)
                    </Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="email"
                            type="email"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-bk-blue focus:border-bk-blue transition-all"
                            placeholder="admin@dut.udn.vn"
                            {...register('email')}
                            disabled={login.isPending}
                        />
                    </div>
                    {errors.email && (
                        <p className="mt-1 text-sm text-bk-red font-medium italic">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                <div className="pb-2">
                    <div className="flex items-center justify-between mb-1.5">
                        <Label
                            className="block text-gray-700 text-sm font-bold"
                            htmlFor="password"
                        >
                            Mật khẩu
                        </Label>
                        <Link
                            to={paths.auth.forgotPassword.getHref()}
                            className="text-xs font-medium text-bk-blue hover:underline"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-gray-400" />
                        </div>
                        <Input
                            id="password"
                            type="password"
                            className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-800 placeholder:text-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-bk-blue focus:border-bk-blue transition-all"
                            placeholder="••••••••"
                            {...register('password')}
                            disabled={login.isPending}
                        />
                    </div>
                    {errors.password && (
                        <p className="mt-1 text-sm text-bk-red font-medium italic">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full flex items-center justify-center bg-bk-blue hover:bg-bk-blue/90 text-white font-bold h-[56px] rounded-lg transition duration-200 shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={login.isPending}
                >
                    {login.isPending && (
                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                    )}
                    <span>Đăng nhập</span>
                </button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                </div>
                <span className="relative z-10 bg-white px-4 text-sm font-bold text-gray-400 uppercase tracking-widest">
                    Hoặc
                </span>
            </div>

            <div className="mt-8 space-y-4">
                <button
                    type="button"
                    className="w-full flex items-center justify-center space-x-3 bg-white hover:bg-gray-50 text-gray-800 font-bold py-3.5 px-4 border border-gray-300 rounded-lg shadow-sm transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onClick={() =>
                        addNotification({
                            type: 'info',
                            title: 'SSO',
                            message: 'Tính năng này đang được phát triển.',
                        })
                    }
                >
                    <MicrosoftIcon />
                    <span>Đăng nhập qua Microsoft</span>
                </button>
            </div>

            <p className="mt-8 text-center text-sm text-gray-600 font-medium">
                Chưa có tài khoản?{' '}
                <Link
                    to={paths.auth.register.getHref()}
                    className="font-bold text-bk-blue hover:underline"
                >
                    Đăng ký ngay
                </Link>
            </p>
        </div>
    );
};
