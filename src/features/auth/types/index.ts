import { z } from 'zod';

export const loginInputSchema = z.object({
    username: z.string().min(1, 'Tên đăng nhập là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const managerLoginInputSchema = z.object({
    identifier: z.string().min(1, 'Username hoặc email là bắt buộc'),
    password: z.string().min(1, 'Mật khẩu là bắt buộc'),
});

export type ManagerLoginInput = z.infer<typeof managerLoginInputSchema>;

export const registerInputSchema = z
    .object({
        email: z
            .string()
            .min(1, 'Email là bắt buộc')
            .email('Email không hợp lệ')
            .endsWith(
                'dut.udn.vn',
                'Email phải kết thúc bằng @sv[số].dut.udn.vn',
            ),
        firstName: z.string().min(1, 'Tên là bắt buộc'),
        lastName: z.string().min(1, 'Họ là bắt buộc'),
        username: z.string().min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự'),
        password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        passwordConfirmed: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
    })
    .refine((data) => data.password === data.passwordConfirmed, {
        message: 'Mật khẩu không khớp',
        path: ['passwordConfirmed'],
    });

export type RegisterInput = z.infer<typeof registerInputSchema>;

export const forgotPasswordInputSchema = z.object({
    email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordInputSchema>;

export const resetPasswordInputSchema = z.object({
    newPassword: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
});

export type ResetPasswordInput = z.infer<typeof resetPasswordInputSchema>;
