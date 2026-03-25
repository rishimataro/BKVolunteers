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

        expect(screen.getByLabelText(/first name/i)).toBeDefined();
        expect(screen.getByLabelText(/last name/i)).toBeDefined();
        expect(screen.getByLabelText(/username/i)).toBeDefined();
        expect(screen.getByLabelText(/email address/i)).toBeDefined();
        expect(screen.getByLabelText(/^password$/i)).toBeDefined();
        expect(screen.getByLabelText(/confirm password/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /register/i })).toBeDefined();
    });

    it('shows error if passwords do not match', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/first name/i), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByLabelText(/last name/i), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'password456' },
        });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(screen.getByText(/passwords don't match/i)).toBeDefined();
        });
        expect(mutate).not.toHaveBeenCalled();
    });

    it('calls register.mutate with correct data', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/first name/i), {
            target: { value: 'John' },
        });
        fireEvent.change(screen.getByLabelText(/last name/i), {
            target: { value: 'Doe' },
        });
        fireEvent.change(screen.getByLabelText(/username/i), {
            target: { value: 'testuser' },
        });
        fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/^password$/i), {
            target: { value: 'password123' },
        });
        fireEvent.change(screen.getByLabelText(/confirm password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith({
                firstName: 'John',
                lastName: 'Doe',
                username: 'testuser',
                email: 'test@example.com',
                password: 'password123',
                passwordConfirmed: 'password123',
            });
        });
    });
});
