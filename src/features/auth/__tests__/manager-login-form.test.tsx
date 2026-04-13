import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';

import { ManagerLoginForm } from '../components/manager-login-form';

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
        useManagerLogin: vi.fn(() => ({
            mutate,
            isPending: false,
        })),
    };
});

describe('ManagerLoginForm', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderForm = () => {
        return render(
            <MemoryRouter>
                <ManagerLoginForm />
            </MemoryRouter>,
        );
    };

    it('shows validation errors when identifier and password are empty', () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/username hoặc email/i), {
            target: { value: '' },
        });
        fireEvent.change(screen.getByLabelText(/^mật khẩu$/i), {
            target: { value: '' },
        });
        fireEvent.click(
            screen.getByRole('button', { name: /đăng nhập quản trị/i }),
        );

        expect(
            screen.getByText(/vui lòng nhập username hoặc email\./i),
        ).toBeDefined();
        expect(screen.getByText(/vui lòng nhập mật khẩu\./i)).toBeDefined();
        expect(mutate).not.toHaveBeenCalled();
    });

    it('submits identifier and password to the manager login endpoint', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/username hoặc email/i), {
            target: { value: 'lcd_cntt' },
        });
        fireEvent.change(screen.getByLabelText(/^mật khẩu$/i), {
            target: { value: 'QL@123456' },
        });

        fireEvent.click(
            screen.getByRole('button', { name: /đăng nhập quản trị/i }),
        );

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith(
                {
                    identifier: 'lcd_cntt',
                    password: 'QL@123456',
                },
                expect.any(Object),
            );
        });
    });

    it('links back to the student login page', () => {
        renderForm();

        const studentLink = screen.getByRole('link', {
            name: /chuyển sang đăng nhập sinh viên/i,
        });

        expect(studentLink.getAttribute('href')).toBe('/auth/login');
    });
});
