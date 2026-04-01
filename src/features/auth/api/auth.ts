import { api, ApiError } from '@/lib/fetch-client';
import type { AuthResponse, User, GeneralResponse } from '@/types/api';

import type {
    LoginInput,
    RegisterInput,
    ForgotPasswordInput,
    ResetPasswordInput,
} from '../types';
import { HttpStatus } from '@/types/http';

export const getUser = async (): Promise<User | null> => {
    try {
        return await api.get<User>('/auth/me');
    } catch (error) {
        if (
            error instanceof ApiError &&
            (error.status === HttpStatus.UNAUTHORIZED ||
                error.status === HttpStatus.NOT_FOUND)
        ) {
            return null;
        }
        throw error;
    }
};

export const logout = (): Promise<void> => {
    return api.post('/auth/logout');
};

export const loginWithEmailAndPassword = (
    data: LoginInput,
): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/login', data);
};

export const registerWithEmailAndPassword = (
    data: RegisterInput,
): Promise<AuthResponse> => {
    return api.post<AuthResponse>('/auth/signup', data);
};

export const forgotPassword = (
    data: ForgotPasswordInput,
): Promise<GeneralResponse> => {
    return api.post<GeneralResponse>('/password/forgot-password', data);
};

export const resetPassword = (
    token: string,
    data: ResetPasswordInput,
): Promise<GeneralResponse> => {
    return api.post<GeneralResponse>(`/password/reset-password/${token}`, data);
};

export const sendVerificationEmail = (
    email: string,
): Promise<GeneralResponse> => {
    return api.post<GeneralResponse>('/verify-email/send-verification-email', {
        email,
    });
};

export const verifyEmail = (token: string): Promise<GeneralResponse> => {
    return api.get<GeneralResponse>(`/verify-email/${token}`);
};
