import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';

import { LoginForm } from '../components/login-form';
import { useLogin } from '../lib/auth-provider';
import { loginInputSchema } from '../types';

// Mock dependencies
vi.mock('../lib/auth-provider', () => ({
    useLogin: vi.fn(),
}));

vi.mock('../api/auth', () => ({
    sendVerificationEmail: vi.fn(),
}));

vi.mock('@/components/ui/notifications', () => ({
    useNotifications: vi.fn(() => ({
        addNotification: vi.fn(),
    })),
}));

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
        },
    },
});

describe('LoginForm', () => {
    const onSuccess = vi.fn();
    const mutateAsync = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useLogin as vi.Mock).mockReturnValue({
            mutateAsync,
            isPending: false,
        });
    });

    const renderForm = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <LoginForm onSuccess={onSuccess} />
                </MemoryRouter>
            </QueryClientProvider>,
        );
    };

    it('renders correctly', () => {
        renderForm();

        expect(
            screen.getByLabelText(/mã số sinh viên \(email\)/i),
        ).toBeDefined();
        expect(screen.getByLabelText(/mật khẩu/i)).toBeDefined();
        expect(
            screen.getByRole('button', { name: /^đăng nhập$/i }),
        ).toBeDefined();
    });

    it('shows validation errors for empty fields', async () => {
        renderForm();

        fireEvent.click(screen.getByRole('button', { name: /^đăng nhập$/i }));

        await waitFor(() => {
            expect(screen.getByText(/email là bắt buộc/i)).toBeDefined();
            expect(
                screen.getByText(/mật khẩu phải có ít nhất 6 ký tự/i),
            ).toBeDefined();
        });
    });

    it('calls login.mutateAsync with correct data', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/mã số sinh viên \(email\)/i), {
            target: { value: '102230109@sv1.dut.udn.vn' },
        });
        fireEvent.change(screen.getByLabelText(/mật khẩu/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /^đăng nhập$/i }));

        await waitFor(() => {
            expect(mutateAsync).toHaveBeenCalledWith({
                email: '102230109@sv1.dut.udn.vn',
                password: 'password123',
            });
        });
    });
});

describe('loginInputSchema - Mã số sinh viên DUT validation', () => {
    const validEmails = [
        '102230109@sv1.dut.udn.vn',
        '112250001@sv1.dut.udn.vn',
        '192299999@sv1.dut.udn.vn',
    ];

    const invalidEmails = [
        { email: 'invalid@sv1.dut.udn.vn', error: 'phải có format' },
        { email: '123@sv1.dut.udn.vn', error: 'phải có format' }, // too short
        { email: 'abcdefgh@sv1.dut.udn.vn', error: 'phải có format' }, // regex check fails
        { email: '102230109@dut.udn.vn', error: 'phải có format' }, // wrong domain
        { email: '102230109@sv.dut.udn.vn', error: 'phải có format' }, // wrong domain
    ];

    it.each(validEmails)('accepts valid student email: %s', (email) => {
        const result = loginInputSchema.safeParse({
            email,
            password: 'password123',
        });
        expect(result.success).toBe(true);
    });

    it.each(invalidEmails.map((i) => i.email))(
        'rejects invalid email: %s',
        (email) => {
            const result = loginInputSchema.safeParse({
                email,
                password: 'password123',
            });
            expect(result.success).toBe(false);
        },
    );

    it.each(invalidEmails.map((i) => ({ email: i.email, error: i.error })))(
        'shows correct error message for: %s',
        ({ email, error }) => {
            const result = loginInputSchema.safeParse({
                email,
                password: 'password123',
            });
            expect(result.success).toBe(false);
            if (!result.success) {
                const errorMessage = result.error.issues[0]?.message || '';
                expect(errorMessage).toContain(error);
            }
        },
    );
});
