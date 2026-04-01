import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';

import { RegisterForm } from '../components/register-form';
import { useNotifications } from '@/components/ui/notifications';

import { useRegister } from '../lib/auth-provider';

// Mock dependencies
vi.mock('../lib/auth-provider', () => ({
    useRegister: vi.fn(),
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

describe('RegisterForm', () => {
    const onSuccess = vi.fn();
    const mutate = vi.fn();
    const addNotification = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useRegister as vi.Mock).mockReturnValue({
            mutate,
            isPending: false,
        });
        (useNotifications as vi.Mock).mockReturnValue({
            addNotification,
        });
    });

    const renderForm = () => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <RegisterForm onSuccess={onSuccess} />
                </MemoryRouter>
            </QueryClientProvider>,
        );
    };

    it('renders correctly', () => {
        renderForm();

        expect(screen.getByLabelText('Tên')).toBeDefined();
        expect(screen.getByLabelText('Họ và tên đệm')).toBeDefined();
        expect(screen.getByLabelText('Tên đăng nhập')).toBeDefined();
        expect(screen.getByLabelText('Địa chỉ Email')).toBeDefined();
        expect(screen.getByLabelText('Mật khẩu')).toBeDefined();
        expect(screen.getByLabelText('Xác nhận mật khẩu')).toBeDefined();
        expect(screen.getByRole('button', { name: /đăng ký/i })).toBeDefined();
    });

    it('shows error if passwords do not match', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText('Tên'), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByLabelText('Họ và tên đệm'), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByLabelText('Tên đăng nhập'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText('Địa chỉ Email'), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText('Mật khẩu'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), {
            target: { value: 'password456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));

        await waitFor(() => {
            expect(screen.getByText(/mật khẩu không khớp/i)).toBeDefined();
        });
        expect(mutate).not.toHaveBeenCalled();
    });

    it('calls register.mutate with correct data', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText('Tên'), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByLabelText('Họ và tên đệm'), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByLabelText('Tên đăng nhập'), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText('Địa chỉ Email'), {
            target: { value: 'test@sv.dut.udn.vn' },
        });
        fireEvent.change(screen.getByLabelText('Mật khẩu'), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText('Xác nhận mật khẩu'), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /đăng ký/i }));

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                username: 'testuser',
                email: 'test@sv.dut.udn.vn',
                password: 'password123',
                passwordConfirmed: 'password123',
            });
        });
    });
});
