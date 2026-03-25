import { z } from 'zod';

export const loginInputSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email')
        .endsWith('dut.udn.vn'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z
    .object({
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        firstName: z.string().min(1, 'First name is required'),
        lastName: z.string().min(1, 'Last name is required'),
        username: z.string().min(3, 'Username must be at least 3 characters'),
        password: z.string().min(6, 'Password must be at least 6 characters'),
        passwordConfirmed: z.string().min(1, 'Confirm password is required'),
    })
    .refine((data) => data.password === data.passwordConfirmed, {
        message: "Passwords don't match",
        path: ['passwordConfirmed'],
    });

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const forgotPasswordInputSchema = z.object({
    email: z.string().min(1, 'Email is required').email('Invalid email'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const resetPasswordInputSchema = z.object({
    newPassword: z
        .string()
        .min(6, 'New password must be at least 6 characters'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
