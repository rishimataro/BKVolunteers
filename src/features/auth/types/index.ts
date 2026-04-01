import { z } from 'zod';

// Mã số sinh viên Đại học Bách Khoa Đà Nẵng (DUT)
// Format: 10[2-9][nnnnn] - 9 chữ số, bắt đầu bằng 1
// Ví dụ: 102230109, 112250001, etc.
// Email sinh viên: [mã số sinh viên]@sv1.dut.udn.vn
const STUDENT_ID_REGEX = /^1\d{8}$/;

/**
 * Validate email với domain của sinh viên DUT
 * Email phải có format: [mã số sinh viên]@sv1.dut.udn.vn
 * Ví dụ: 102230109@sv1.dut.udn.vn
 */
const dutStudentEmail = z
    .string()
    .min(1, 'Email là bắt buộc')
    .email('Email không hợp lệ')
    .refine(
        (email) => {
            const [username, domain] = email.split('@');
            if (domain !== 'sv1.dut.udn.vn') return false;
            return STUDENT_ID_REGEX.test(username);
        },
        {
            message:
                'Email phải có format: [mã số sinh viên]@sv1.dut.udn.vn (ví dụ: 102230109@sv1.dut.udn.vn)',
        },
    );

export const loginInputSchema = z.object({
    email: dutStudentEmail,
    password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

export type LoginInput = z.infer<typeof loginInputSchema>;

export const registerInputSchema = z
    .object({
        email: dutStudentEmail,
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
