export type BaseEntity = {
    id: string;
    createdAt: number;
};

export type Entity<T> = {
    [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
    page: number;
    total: number;
    totalPages: number;
};

export type User = Entity<{
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    role: 'ADMIN' | 'USER';
}>;

export type AuthResponse = {
    accessToken: string;
    user: User;
};

// Định nghĩa mã lỗi đặc thù để xử lý UI linh hoạt
export type ApiError = {
    message: string;
    statusCode: number;
    error?: string; // Ví dụ: "Conflict", "Unauthorized"
};

// Kiểu dữ liệu cho các phản hồi chung của Backend (như gửi mail thành công)
export type GeneralResponse = {
    message: string;
};
