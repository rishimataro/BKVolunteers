import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from 'next-themes';
import React, { useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';

import { MainErrorFallback } from '@/components/error/main';
import { Notifications } from '@/components/ui/notifications';
import { Spinner } from '@/components/ui/spinner';
import { AuthLoader } from '@/features/auth';

type AppProviderProps = {
    children: React.ReactNode;
};

export const AppProvider = ({ children }: AppProviderProps) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        retry: false,
                        refetchOnWindowFocus: false,
                        throwOnError: true,
                    },
                },
            }),
    );

    return (
        <React.Suspense
            fallback={
                <div className="flex h-screen w-screen items-center justify-center">
                    <Spinner size="lg" />
                </div>
            }
        >
            <ErrorBoundary FallbackComponent={MainErrorFallback}>
                <HelmetProvider>
                    <QueryClientProvider client={queryClient}>
                        <ThemeProvider
                            attribute="class"
                            defaultTheme="system"
                            enableSystem
                        >
                            {import.meta.env.DEV && <ReactQueryDevtools />}
                            <Notifications />
                            <AuthLoader
                                renderLoading={() => (
                                    <div className="flex h-screen w-screen items-center justify-center">
                                        <Spinner size="lg" />
                                    </div>
                                )}
                            >
                                {children}
                            </AuthLoader>
                        </ThemeProvider>
                    </QueryClientProvider>
                </HelmetProvider>
            </ErrorBoundary>
        </React.Suspense>
    );
};
