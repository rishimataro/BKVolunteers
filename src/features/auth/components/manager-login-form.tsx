import * as React from 'react';
import { Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';

import { useManagerLogin } from '../lib/auth-provider';

type ManagerLoginFormErrors = {
    identifier?: string;
    password?: string;
};

export const ManagerLoginForm = () => {
    const { addNotification } = useNotifications();
    const login = useManagerLogin();
    const [identifier, setIdentifier] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [errors, setErrors] = React.useState<ManagerLoginFormErrors>({});

    const validateField = (
        field: keyof ManagerLoginFormErrors,
        value: string,
    ) => {
        if (!value.trim()) {
            setErrors((current) => ({
                ...current,
                [field]:
                    field === 'identifier'
                        ? 'Vui lòng nhập username hoặc email.'
                        : 'Vui lòng nhập mật khẩu.',
            }));
            return false;
        }

        setErrors((current) => ({
            ...current,
            [field]: undefined,
        }));

        return true;
    };

    const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const normalizedIdentifier = identifier.trim();
        const normalizedPassword = password.trim();
        const isIdentifierValid = validateField(
            'identifier',
            normalizedIdentifier,
        );
        const isPasswordValid = validateField('password', normalizedPassword);

        if (!isIdentifierValid || !isPasswordValid) {
            return;
        }

        login.mutate(
            {
                identifier: normalizedIdentifier,
                password: normalizedPassword,
            },
            {
                onSuccess: () => {
                    addNotification({
                        type: 'success',
                        title: 'Đăng nhập quản trị thành công',
                        message:
                            'Hệ thống đã nạp đúng vai trò và phạm vi quản trị.',
                    });
                },
                onError: () => {
                    addNotification({
                        type: 'error',
                        title: 'Không thể đăng nhập quản trị',
                        message:
                            'Kiểm tra lại username/email, mật khẩu hoặc trạng thái tài khoản.',
                    });
                },
            },
        );
    };

    return (
        <section className="relative mx-auto w-full max-w-[1200px] animate-fade-in-up px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_32px_90px_-38px_rgba(15,23,42,0.45)]">
                <div className="grid min-h-[640px] lg:grid-cols-[minmax(0,0.54fr)_minmax(360px,0.46fr)]">
                    <div className="relative overflow-hidden bg-[linear-gradient(160deg,#123b56_0%,#0f6580_45%,#56a9b7_100%)] px-8 py-10 text-white sm:px-10 lg:px-12">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.28),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.18),transparent_30%)]" />
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold uppercase tracking-[0.18em] text-white/90">
                                    <ShieldCheck className="size-4" />
                                    Manager Access
                                </div>
                                <h1 className="mt-8 max-w-lg text-4xl font-black leading-tight sm:text-5xl">
                                    Cổng đăng nhập riêng cho tài khoản quản trị
                                </h1>
                                <p className="mt-5 max-w-xl text-base leading-7 text-white/82 sm:text-lg">
                                    Dành cho BCH LCĐ, BCN CLB và Đoàn trường.
                                    Sau khi xác thực, phiên làm việc sẽ mang
                                    đúng `roleType`, `facultyId` hoặc `clubId`
                                    để nạp giao diện quản trị tương ứng.
                                </p>
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                {[
                                    {
                                        title: 'CLB_MANAGER',
                                        description:
                                            'Làm việc trong phạm vi CLB, nạp dashboard CLB.',
                                    },
                                    {
                                        title: 'LCD_MANAGER',
                                        description:
                                            'Quản lý theo khoa/LCĐ, nạp dashboard LCĐ.',
                                    },
                                    {
                                        title: 'DOANTRUONG_ADMIN',
                                        description:
                                            'Theo dõi và điều phối dashboard tổng của Đoàn trường.',
                                    },
                                    {
                                        title: 'Sai luồng cần tránh',
                                        description:
                                            'Không dùng endpoint sinh viên cho tài khoản quản trị.',
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="rounded-[1.5rem] border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Sparkles className="size-5 text-white/80" />
                                            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white/90">
                                                {item.title}
                                            </p>
                                        </div>
                                        <p className="mt-3 text-sm leading-6 text-white/78">
                                            {item.description}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center px-6 py-10 sm:px-10">
                        <div className="mx-auto w-full max-w-md">
                            <img
                                src="/logo_nobg.svg"
                                alt="BK Volunteers"
                                className="mb-7 h-16 w-auto"
                            />

                            <div className="mb-8">
                                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0f6d84]">
                                    Manager Login
                                </p>
                                <h2 className="mt-3 text-3xl font-black text-slate-900">
                                    Đăng nhập khu quản trị
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-600">
                                    Nhập username hoặc email được cấp, kèm mật
                                    khẩu nội bộ của tài khoản quản trị.
                                </p>
                            </div>

                            <form
                                onSubmit={onSubmit}
                                className="space-y-6"
                                noValidate
                            >
                                <div>
                                    <Label
                                        htmlFor="identifier"
                                        className="mb-2 block text-base font-semibold text-slate-700"
                                    >
                                        Username hoặc email
                                    </Label>
                                    <Input
                                        id="identifier"
                                        value={identifier}
                                        onChange={(event) => {
                                            setIdentifier(event.target.value);
                                            validateField(
                                                'identifier',
                                                event.target.value,
                                            );
                                        }}
                                        placeholder="Ví dụ: lcd_cntt hoặc lcd.cntt@dut.udn.vn"
                                        error={errors.identifier}
                                        className="h-12 rounded-[1rem] border border-slate-300 bg-white px-5 text-base text-slate-700 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.8)] transition-all duration-200 placeholder:text-slate-300 hover:border-[#71bfca] focus-visible:border-[#58aeb6] focus-visible:ring-4 focus-visible:ring-[#8fe5e2]/35"
                                    />
                                </div>

                                <div>
                                    <Label
                                        htmlFor="manager-password"
                                        className="mb-2 block text-base font-semibold text-slate-700"
                                    >
                                        Mật khẩu
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            id="manager-password"
                                            value={password}
                                            onChange={(event) => {
                                                setPassword(event.target.value);
                                                validateField(
                                                    'password',
                                                    event.target.value,
                                                );
                                            }}
                                            type={
                                                showPassword
                                                    ? 'text'
                                                    : 'password'
                                            }
                                            placeholder="Nhập mật khẩu nội bộ"
                                            error={errors.password}
                                            className="h-12 rounded-[1rem] border border-slate-300 bg-white px-5 pr-14 text-base text-slate-700 shadow-[0_10px_30px_-26px_rgba(15,23,42,0.8)] transition-all duration-200 placeholder:text-slate-300 hover:border-[#71bfca] focus-visible:border-[#58aeb6] focus-visible:ring-4 focus-visible:ring-[#8fe5e2]/35"
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
                                            className="absolute right-4 top-[0.95rem] inline-flex h-6 w-6 items-center justify-center text-slate-300 transition-all duration-200 hover:scale-110 hover:text-[#59abb7] active:scale-95"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={login.isPending}
                                    className="inline-flex h-12 w-full items-center justify-center rounded-full bg-[#0f6d84] px-4 text-[1.02rem] font-semibold text-white shadow-[0_22px_36px_-26px_rgba(15,109,132,0.9)] transition-all duration-200 hover:bg-[#0d6074] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#8fe5e2]/50"
                                >
                                    {login.isPending
                                        ? 'Đang đăng nhập quản trị...'
                                        : 'Đăng nhập quản trị'}
                                </button>
                            </form>

                            <div className="mt-6 rounded-[1.4rem] border border-slate-200 bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                                Sinh viên và tài khoản thường dùng trang đăng
                                nhập khác.
                                <Link
                                    to={paths.auth.login.getHref()}
                                    className="ml-1 font-semibold text-[#0f6d84] hover:text-[#0d6074]"
                                >
                                    Chuyển sang đăng nhập sinh viên
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
