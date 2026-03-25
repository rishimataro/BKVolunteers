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
            setAuth: (user, token) => set({ user, accessToken: token }),
            clearAuth: () => set({ user: null, accessToken: null }),
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
);
