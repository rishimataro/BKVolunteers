import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

import { LoginForm } from '../components/login-form';

const addNotification = vi.fn();
const mutate = vi.fn();

vi.mock('@/components/ui/notifications', () => ({
    useNotifications: vi.fn(() => ({
        addNotification,
    })),
}));

vi.mock('../lib/auth-provider', async () => {
    const actual = await vi.importActual('../lib/auth-provider');
    return {
        ...actual,
        useLogin: vi.fn(() => ({
            mutate,
            isPending: false,
        })),
    };
});

describe('LoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderForm = () => {
        return render(
            <MemoryRouter>
                <LoginForm />
            </MemoryRouter>,
        );
    };

    it('shows local validation errors when fields are empty', () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), {
            target: { value: '' },
        });
        fireEvent.change(
            screen.getByLabelText(/mật khẩu/i, { selector: 'input' }),
            {
                target: { value: '' },
            },
        );
        fireEvent.click(screen.getByRole('button', { name: /^đăng nhập$/i }));

        expect(
            screen.getByText(/vui lòng nhập tên đăng nhập\./i),
        ).toBeDefined();
        expect(screen.getByText(/vui lòng nhập mật khẩu\./i)).toBeDefined();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('submits username and password directly to auth login', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/tên đăng nhập/i), {
            target: { value: 'lcd_cntt' },
        });
        fireEvent.change(
            screen.getByLabelText(/mật khẩu/i, { selector: 'input' }),
            {
                target: { value: 'QL@123456' },
            },
        );

        fireEvent.click(screen.getByRole('button', { name: /^đăng nhập$/i }));

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith(
                {
                    username: 'lcd_cntt',
                    password: 'QL@123456',
                },
                expect.any(Object),
            );
        });
    });

    it('shows guidance for both student and organizer accounts on the same page', () => {
        renderForm();

        expect(
            screen.getByText(
                /một cổng đăng nhập chung cho sinh viên, đơn vị tổ chức và đoàn trường/i,
            ),
        ).toBeDefined();
        expect(screen.getByText(/đăng nhập bằng mssv/i)).toBeDefined();
        expect(
            screen.getByText(/dùng username hoặc email được cấp/i),
        ).toBeDefined();
        expect(
            screen.queryByRole('link', {
                name: /chuyển sang đăng nhập quản trị/i,
            }),
        ).toBeNull();
    });

    it('toggles the password field visibility', () => {
        renderForm();

        const passwordInput = screen.getByLabelText(/mật khẩu/i, {
            selector: 'input',
        });
        const toggleButton = screen.getByRole('button', {
            name: /hiện mật khẩu/i,
        });

        expect(passwordInput.getAttribute('type')).toBe('password');

        fireEvent.click(toggleButton);
        expect(passwordInput.getAttribute('type')).toBe('text');

        fireEvent.click(screen.getByRole('button', { name: /ẩn mật khẩu/i }));
        expect(passwordInput.getAttribute('type')).toBe('password');
    });
});
