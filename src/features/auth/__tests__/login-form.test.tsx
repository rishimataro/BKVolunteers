import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router';

import { LoginForm } from '../components/login-form';
import { useLogin } from '../lib/auth-provider';

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
    const mutate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useLogin as vi.Mock).mockReturnValue({
            mutate,
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

        expect(screen.getByLabelText(/email address/i)).toBeDefined();
        expect(screen.getByLabelText(/password/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /log in/i })).toBeDefined();
    });

    it('shows validation errors for empty fields', async () => {
        renderForm();

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeDefined();
            expect(
                screen.getByText(/password must be at least 6 characters/i),
            ).toBeDefined();
        });
    });

    it('calls login.mutate with correct data', async () => {
        renderForm();

        fireEvent.change(screen.getByLabelText(/email address/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });

        fireEvent.click(screen.getByRole('button', { name: /log in/i }));

        await waitFor(() => {
            expect(mutate).toHaveBeenCalledWith(
                { email: 'test@example.com', password: 'password123' },
                expect.any(Object),
            );
        });
    });
});
