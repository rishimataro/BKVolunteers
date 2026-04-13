import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import type { User } from '@/types/api';

interface AuthState {
    user: User | null;
    accessToken: string | null;
    setAuth: (user: User | null, token: string | null) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            accessToken: null,
            // Ghi user + accessToken vào store để dùng ngay sau khi đăng nhập
            // và để middleware persist đồng bộ xuống localStorage.
            setAuth: (user, token) => set({ user, accessToken: token }),
            // Xóa toàn bộ dữ liệu phiên khi logout hoặc khi token không còn hợp lệ.
            clearAuth: () => set({ user: null, accessToken: null }),
        }),
        {
            // Session đăng nhập được lưu dưới key này trong localStorage,
            // nên khi tải lại trang app vẫn có thể khôi phục trạng thái đăng nhập.
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
