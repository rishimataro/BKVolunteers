export type BaseEntity = {
    id: string;
    createdAt: number | string;
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
    role: 'ADMIN' | 'USER' | 'STUDENT';
    accountType?: 'user' | 'student' | 'manager';
    fullName?: string;
    mssv?: string;
    className?: string | null;
    facultyName?: string | null;
    facultyCode?: string | null;
    facultyId?: number | null;
    clubId?: string | null;
    clubName?: string | null;
    scopeName?: string | null;
    dashboardType?: 'club' | 'faculty' | 'school';
    roleType?: 'CLB_MANAGER' | 'LCD_MANAGER' | 'DOANTRUONG_ADMIN';
    status?: 'ACTIVE' | 'LOCKED' | 'INACTIVE';
}>;

export type AuthResponse = {
    accessToken: string;
    user: User;
};

export type ApiError = {
    message: string;
    statusCode: number;
    error?: string;
    errors?: {
        code?: string;
        [key: string]: unknown;
    } | null;
};

export type GeneralResponse = {
    message: string;
};
