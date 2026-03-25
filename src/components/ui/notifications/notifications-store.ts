import { nanoid } from 'nanoid';
import { create } from 'zustand';

export type Notification = {
    id: string;
    type: 'info' | 'warning' | 'success' | 'error';
    title: string;
    message?: string;
    duration?: number;
};

type NotificationsStore = {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => void;
    dismissNotification: (id: string) => void;
};

export const useNotifications = create<NotificationsStore>()((set, get) => ({
    notifications: [],

    addNotification: (notification) => {
        const id = nanoid();

        // Cấu hình thời gian chờ mặc định (ví dụ: 5000ms = 5 giây)
        // Nếu là lỗi (error), có thể để lâu hơn (8000ms)
        const defaultDuration = notification.type === 'error' ? 8000 : 5000;
        const duration = notification.duration ?? defaultDuration;

        set((state) => ({
            notifications: [...state.notifications, { id, ...notification }],
        }));

        if (duration !== Infinity) {
            setTimeout(() => {
                get().dismissNotification(id);
            }, duration);
        }
    },

    dismissNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter(
                (notification) => notification.id !== id,
            ),
        })),
}));
