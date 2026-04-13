import * as React from 'react';
import { Eye, EyeOff, Globe, HandHeart, Heart, Sparkles } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';

import { useLogin } from '../lib/auth-provider';

type LoginFormErrors = {
    username?: string;
    password?: string;
};

const decorativeIcons = [
    {
        Icon: Heart,
        className:
            'right-[40%] top-[28%] text-[#4fa7b5] shadow-[0_24px_48px_-30px_rgba(79,167,181,0.9)]',
    },
    {
        Icon: Globe,
        className:
            'right-[150%] top-[44%] text-[#62a9b8] shadow-[0_18px_40px_-28px_rgba(98,169,184,0.85)]',
    },
    {
        Icon: HandHeart,
        className:
            'right-[140%] top-[66%] text-[#55a8a9] shadow-[0_24px_54px_-32px_rgba(85,168,169,0.9)]',
    },
    {
        Icon: Sparkles,
        className:
            'right-[30%] bottom-[30%] text-[#86d6d3] shadow-[0_24px_54px_-34px_rgba(134,214,211,0.8)]',
    },
];

export const LoginForm = () => {
    const { addNotification } = useNotifications();
    const login = useLogin();
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<LoginFormErrors>({});

    const validateField = (
        field: keyof LoginFormErrors,
        value: string,
    ): boolean => {
        if (!value.trim()) {
            setErrors((current) => ({
                ...current,
                [field]:
                    field === 'username'
                        ? 'Vui lòng nhập tên đăng nhập.'
                        : 'Vui lòng nhập mật khẩu.',
            }));
            return false;
        }

        setErrors((current) => {
            if (!current[field]) return current;

            return {
                ...current,
                [field]: undefined,
            };
        });

        return true;
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedUsername = username.trim();
        const normalizedPassword = password.trim();
        const isUsernameValid = validateField('username', normalizedUsername);
        const isPasswordValid = validateField('password', normalizedPassword);

        if (!isUsernameValid || !isPasswordValid) {
            return;
        }

        login.mutate(
            {
                username: normalizedUsername,
                password: normalizedPassword,
            },
            {
                onSuccess: () => {
                    addNotification({
                        type: 'success',
                        title: 'Đăng nhập thành công',
                        message:
                            'Phiên làm việc đã được tạo. Hệ thống đang chuyển trang.',
                    });
                },
                onError: () => {
                    addNotification({
                        type: 'error',
                        title: 'Đăng nhập thất bại',
                        message:
                            'Kiểm tra lại MSSV hoặc username/email và mật khẩu đã được cấp.',
                    });
                },
            },
        );
    };

    return (
        <section className="relative mx-auto w-full max-w-[1376px] animate-fade-in-up px-4 sm:px-6 lg:px-8">
            <div className="group relative overflow-hidden rounded-2xl border border-white bg-white shadow-[0_30px_80px_-32px_rgba(28,74,97,0.55)] backdrop-blur-md transition-transform duration-500 sm:rounded-[2rem]">
                <div className="grid min-h-[620px] md:min-h-[680px] lg:min-h-[720px] lg:grid-cols-[minmax(0,0.68fr)_minmax(320px,0.32fr)]">
                    <div className="relative z-10 flex items-center px-4 py-8 sm:px-8 sm:py-10 lg:px-0 lg:pl-20">
                        <div className="w-full max-w-[26rem] sm:max-w-[30rem]">
                            <img
                                src="/logo_nobg.svg"
                                alt="BK Volunteers"
                                className="w-auto h-20 mb-7"
                            />

                            <div className="mb-8">
                                <h1 className="text-4xl font-bold tracking-tight uppercase text-slate-700 sm:text-4xl lg:text-5xl">
                                    Đăng nhập
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Một cổng đăng nhập chung cho sinh viên, đơn
                                    vị tổ chức và Đoàn trường.
                                </p>
                            </div>

                            <form
                                onSubmit={onSubmit}
                                className="space-y-7"
                                noValidate
                            >
                                <div>
                                    <Label
                                        htmlFor="username"
                                        className="block mb-2 text-base font-semibold text-slate-600 sm:text-lg"
                                    >
                                        Tên đăng nhập:
                                    </Label>
                                    <Input
                                        id="username"
                                        value={username}
                                        onChange={(e) => {
                                            setUsername(e.target.value);
                                            validateField(
                                                'username',
                                                e.target.value,
                                            );
                                        }}
                                        placeholder="Nhập MSSV, username hoặc email"
                                        error={errors.username}
                                        className="h-12 rounded-[1rem] border border-slate-300 bg-white px-5 text-base text-slate-700 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.8)] transition-all duration-200 placeholder:text-slate-300 hover:border-[#71bfca] focus-visible:border-[#58aeb6] focus-visible:ring-4 focus-visible:ring-[#8fe5e2]/35 sm:h-14"
                                    />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <Label
                                            htmlFor="password"
                                            className="text-base font-semibold text-slate-600 sm:text-lg"
                                        >
                                            Mật khẩu:
                                        </Label>
                                        <Link
                                            to={paths.auth.forgotPassword.getHref()}
                                            className="text-sm font-medium text-[#3a6da0] transition-colors duration-200 hover:text-[#235987] hover:underline"
                                        >
                                            Quên mật khẩu?
                                        </Link>
                                    </div>

                                    <div className="relative">
                                        <Input
                                            id="password"
                                            value={password}
                                            onChange={(e) => {
                                                setPassword(e.target.value);
                                                validateField(
                                                    'password',
                                                    e.target.value,
                                                );
                                            }}
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Nhập mật khẩu hoặc MSSV"
                                            error={errors.password}
                                            className="h-12 rounded-[1rem] border border-slate-300 bg-white px-5 pr-14 text-base text-slate-700 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.8)] transition-all duration-200 placeholder:text-slate-300 hover:border-[#71bfca] focus-visible:border-[#58aeb6] focus-visible:ring-4 focus-visible:ring-[#8fe5e2]/35 sm:h-14"
                                        />
                                        <button
                                            type="button"
                                            aria-label={
                                                showPassword
                                                    ? 'Ẩn mật khẩu'
                                                    : 'Hiện mật khẩu'
                                            }
                                            aria-pressed={showPassword}
                                            onClick={() =>
                                                setShowPassword(
                                                    (current) => !current,
                                                )
                                            }
                                            className="absolute right-4 top-[1.05rem] inline-flex h-6 w-6 items-center justify-center text-slate-300 transition-all duration-200 hover:scale-110 hover:text-[#59abb7] active:scale-95"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-5 h-5" />
                                            ) : (
                                                <Eye className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={login.isPending}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#58aab3] px-4 text-[1.05rem] font-semibold text-white shadow-[5px_20px_20px_-24px_rgba(54,131,140,0.9)] transition-all duration-200 hover:bg-[#4a9ea9] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8fe5e2]/50 active:translate-y-0 active:scale-[0.985] sm:h-14 sm:px-6"
                                >
                                    {login.isPending
                                        ? 'Đang đăng nhập...'
                                        : 'Đăng nhập'}
                                </button>
                            </form>
                        </div>
                    </div>

                    <div className="absolute inset-0 z-20 hidden pointer-events-none xl:block">
                        <div className="absolute right-0 top-0 h-full w-[32%] bg-[#e8f4fb]/88">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(255,255,255,0.95),rgba(232,244,251,0.58)_42%,rgba(185,223,236,0.8)_100%)]" />

                            {decorativeIcons.map(({ Icon, className }) => (
                                <div
                                    key={className}
                                    className={`absolute flex h-14 w-14 animate-float items-center justify-center rounded-full ${className}`}
                                >
                                    <Icon className="w-20 h-20" />
                                </div>
                            ))}

                            <img
                                src="/linhvat.svg"
                                className="absolute bottom-0 -left-[50%] z-30 h-[95%] max-h-[720px] w-auto scale-150 drop-shadow-[0_30px_40px_rgba(0,0,0,0.15)]"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
