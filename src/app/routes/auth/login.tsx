import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { Head } from '@/components/seo';
import { LoginForm, getPostLoginPath, useUser } from '@/features/auth';
import type { User } from '@/types/api';

export const LoginPage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo');
    const user = useUser();
    const currentUser = user.data as User | null | undefined;

    useEffect(() => {
        if (currentUser) {
            navigate(getPostLoginPath(currentUser, redirectTo), {
                replace: true,
            });
        }
    }, [currentUser, navigate, redirectTo]);

    return (
        <>
            <Head title="Đăng nhập" />
            <main className="relative min-h-screen overflow-hidden bg-slate-100">
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{ backgroundImage: "url('/background.png')" }}
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.85),_rgba(236,254,255,0.28)_36%,_rgba(15,23,42,0.18)_100%)]"
                />
                <div
                    aria-hidden="true"
                    className="absolute inset-0 backdrop-blur-[7px]"
                />

                <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8 sm:px-6 lg:px-10">
                    <LoginForm />
                </div>
            </main>
        </>
    );
};
