import {
    CircleHelp,
    FolderKanban,
    IdCard,
    LayoutDashboard,
    QrCode,
    ScrollText,
    Settings,
    Users,
    type LucideIcon,
} from 'lucide-react';

import { paths } from '@/config/paths';
import { getScopeLabel, isManagerAccount, useUser } from '@/features/auth';
import { liveEventActive } from '@/features/lcd-club/data';
import type { User } from '@/types/api';

export type SideNavigationItem = {
    name: string;
    to: string;
    icon: LucideIcon;
    children?: string[];
};

export const useNavigationItems = () => {
    const user = useUser();
    const currentUser = user.data as User | null | undefined;

    if (!currentUser || currentUser.role === 'STUDENT') {
        return [
            {
                name: 'Hồ sơ sinh viên',
                to: paths.app.profile.getHref(),
                icon: IdCard,
                children: ['Thông tin cá nhân', 'Khoa', 'Lớp'],
            },
        ] satisfies SideNavigationItem[];
    }

    const scopeLabel = getScopeLabel(currentUser) || 'đơn vị';
    const dashboardLabel = isManagerAccount(currentUser)
        ? currentUser.roleType === 'DOANTRUONG_ADMIN'
            ? 'Tổng quan Đoàn trường'
            : currentUser.roleType === 'LCD_MANAGER'
              ? `Tổng quan LCĐ ${scopeLabel}`
              : `Tổng quan CLB ${scopeLabel}`
        : 'Tổng quan';
    const campaignChildren = isManagerAccount(currentUser)
        ? currentUser.roleType === 'DOANTRUONG_ADMIN'
            ? ['Theo dõi toàn trường', 'Phê duyệt/điều phối']
            : currentUser.roleType === 'LCD_MANAGER'
              ? ['Danh sách chiến dịch khoa', 'Tạo chiến dịch LCĐ']
              : ['Danh sách chiến dịch CLB', 'Tạo chiến dịch CLB']
        : ['Danh sách chiến dịch', 'Tạo chiến dịch mới'];

    return [
        {
            name: dashboardLabel,
            to: paths.app.dashboard.getHref(),
            icon: LayoutDashboard,
        },
        {
            name: 'Quản lý Chiến dịch',
            to: paths.app.campaigns.getHref(),
            icon: FolderKanban,
            children: campaignChildren,
        },
        {
            name: 'Quản lý Tình nguyện viên',
            to: paths.app.volunteers.getHref(),
            icon: Users,
            children: ['Danh sách chờ duyệt', 'Danh sách chính thức'],
        },
        ...(liveEventActive
            ? [
                  {
                      name: 'Tổ chức & Điểm danh',
                      to: paths.app.attendance.getHref(),
                      icon: QrCode,
                      children: ['Cổng quét QR động'],
                  },
              ]
            : []),
        {
            name: 'Chứng nhận & Đánh giá',
            to: paths.app.certificates.getHref(),
            icon: ScrollText,
            children: ['Cấu hình phôi GCN', 'Phản hồi của SV'],
        },
        {
            name: 'Hỗ trợ & Khiếu nại',
            to: paths.app.tickets.getHref(),
            icon: CircleHelp,
        },
        {
            name: 'Cài đặt',
            to: paths.app.settings.getHref(),
            icon: Settings,
            children: ['Đổi mật khẩu', 'Thông tin đơn vị'],
        },
    ] satisfies SideNavigationItem[];
};
