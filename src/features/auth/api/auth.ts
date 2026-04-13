import Axios from 'axios';

import { api } from '@/lib/api-clients';
import type { AuthResponse, GeneralResponse, User } from '@/types/api';
import { HttpStatus } from '@/types/http';

import type {
    ForgotPasswordInput,
    LoginInput,
    ManagerLoginInput,
    ResetPasswordInput,
} from '../types';

export const getUser = async (): Promise<User | null> => {
    try {
        return await api.get('/auth/me');
    } catch (error) {
        if (
            Axios.isAxiosError(error) &&
            (error.response?.status === HttpStatus.UNAUTHORIZED ||
                error.response?.status === HttpStatus.NOT_FOUND)
        ) {
            return null;
        }

        throw error;
    }
};

export const logout = (): Promise<void> => {
    return api.post('/auth/logout');
};

export const loginWithUsernameAndPassword = (
    data: LoginInput,
): Promise<AuthResponse> => {
    return api.post('/auth/login', data);
};

export const loginManagerWithIdentifierAndPassword = (
    data: ManagerLoginInput,
): Promise<AuthResponse> => {
    return api.post('/auth/manager/login', data);
};

export const forgotPassword = (
    data: ForgotPasswordInput,
): Promise<GeneralResponse> => {
    return api.post('/password/forgot-password', data);
};

export const resetPassword = (
    token: string,
    data: ResetPasswordInput,
): Promise<GeneralResponse> => {
    return api.post(`/password/reset-password/${token}`, data);
};

export const sendVerificationEmail = (
    email: string,
): Promise<GeneralResponse> => {
    return api.post('/verify-email/send-verification-email', { email });
};

export const verifyEmail = (token: string): Promise<GeneralResponse> => {
    return api.get(`/verify-email/${token}`);
};
