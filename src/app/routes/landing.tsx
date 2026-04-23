import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router';
import {
    ArrowRight,
    Bell,
    Calendar,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Heart,
    LogOut,
    ShieldCheck,
    User,
    Users,
    Zap,
} from 'lucide-react';

import { Head } from '@/components/seo';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { paths } from '@/config/paths';
import { useAuthStore } from '@/store/auth-store';

const featureCards = [
    {
        title: 'Quản lý sự kiện',
        description:
            'Lên kế hoạch, mở đăng ký và theo dõi tiến độ cho từng chiến dịch trong một trang điều phối duy nhất.',
        icon: Calendar,
    },
    {
        title: 'Kết nối thành viên',
        description:
            'Tập hợp tình nguyện viên theo đội, nhóm và vai trò để phối hợp nhanh hơn cho từng hoạt động.',
        icon: Users,
    },
    {
        title: 'Ghi nhận đóng góp',
        description:
            'Lưu vết giờ công, kết quả và điểm rèn luyện minh bạch với luồng phê duyệt rõ ràng.',
        icon: ShieldCheck,
    },
    {
        title: 'Lan tỏa giá trị',
        description:
            'Tổng hợp câu chuyện và kết quả tạo tác động để truyền cảm hứng cho cộng đồng sinh viên.',
        icon: Heart,
    },
];

const dashboardSignals = [
    { label: 'Chiến dịch đang mở', value: '14', icon: Zap },
    { label: 'Tình nguyện viên online', value: '286', icon: Users },
    { label: 'Giờ công tuần này', value: '1,248', icon: Clock3 },
];

const navGroups = [
    {
        label: 'Khám phá',
        items: [
            {
                label: 'Chiến dịch tình nguyện',
                href: paths.app.campaigns.getHref(),
            },
            {
                label: 'Đơn vị tổ chức',
                href: paths.app.users.getHref(),
            },
        ],
    },
    {
        label: 'Kết nối',
        items: [
            { label: 'Bản đồ tình nguyện', href: '#volunteer-map' },
            { label: 'Bảng tin', href: '#news-board' },
        ],
    },
    {
        label: 'Giới thiệu',
        items: [
            { label: 'Về BKVolunteers', href: '#about' },
            { label: 'Hỏi đáp', href: '#faq' },
            { label: 'Điều khoản', href: '#terms' },
            { label: 'Chính sách bảo mật', href: '#privacy' },
            { label: 'Liên hệ', href: '#contact' },
        ],
    },
];

const carouselSlides = [
    {
        src: '/landing/1.jpg',
        alt: 'Khoảnh khắc tình nguyện 1',
    },
    {
        src: '/landing/2.jpg',
        alt: 'Khoảnh khắc tình nguyện 2',
    },
    {
        src: '/landing/3.jpg',
        alt: 'Khoảnh khắc tình nguyện 3',
    },
    {
        src: '/landing/4.jpg',
        alt: 'Khoảnh khắc tình nguyện 4',
    },
    {
        src: '/landing/5.png',
        alt: 'Khoảnh khắc tình nguyện 5',
    },
];

export const LandingRoute = () => {
    const navigate = useNavigate();
    const authUser = useAuthStore((state) => state.user);
    const accessToken = useAuthStore((state) => state.accessToken);
    const clearAuth = useAuthStore((state) => state.clearAuth);
    const isLoggedIn = Boolean(authUser && accessToken);

    const [hoveredNavGroup, setHoveredNavGroup] = useState<string | null>(null);
    const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
    const [isCarouselPaused, setIsCarouselPaused] = useState(false);

    const avatarCloseTimeoutRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (avatarCloseTimeoutRef.current !== null) {
                window.clearTimeout(avatarCloseTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isCarouselPaused || carouselSlides.length < 2) return;

        const intervalId = window.setInterval(() => {
            setCurrentSlideIndex(
                (prevIndex) => (prevIndex + 1) % carouselSlides.length,
            );
        }, 3000);

        return () => window.clearInterval(intervalId);
    }, [isCarouselPaused]);

    const openAvatarMenu = () => {
        if (avatarCloseTimeoutRef.current !== null) {
            window.clearTimeout(avatarCloseTimeoutRef.current);
        }
        setAvatarMenuOpen(true);
    };

    const closeAvatarMenu = () => {
        avatarCloseTimeoutRef.current = window.setTimeout(() => {
            setAvatarMenuOpen(false);
        }, 120);
    };

    const handleGetStarted = () => {
        navigate(paths.auth.login.getHref());
    };

    const handleLogout = () => {
        clearAuth();
        navigate(paths.home.getHref());
    };

    const handleMenuNavigation = (href: string) => {
        if (href.startsWith('#')) {
            const sectionId = href.replace('#', '');
            const targetElement = document.getElementById(sectionId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
            return;
        }
        navigate(href);
    };

    const handlePreviousSlide = () => {
        setCurrentSlideIndex(
            (prevIndex) =>
                (prevIndex - 1 + carouselSlides.length) % carouselSlides.length,
        );
    };

    const handleNextSlide = () => {
        setCurrentSlideIndex(
            (prevIndex) => (prevIndex + 1) % carouselSlides.length,
        );
    };

    const handleSelectSlide = (index: number) => {
        setCurrentSlideIndex(index);
    };

    const userDisplayName = authUser
        ? `${authUser.firstName} ${authUser.lastName}`.trim()
        : '';

    const avatarInitials = authUser
        ? `${authUser.firstName?.[0] ?? authUser.username?.[0] ?? 'U'}${authUser.lastName?.[0] ?? ''}`.toUpperCase()
        : 'U';

    return (
        <>
            <Head title="Trang chủ | BK Volunteers" />
            <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#f8f7ff] text-slate-950">
                <div className="pointer-events-none absolute -left-20 -top-20 size-80 rounded-full bg-[#0065bd]/15 blur-3xl" />
                <div className="pointer-events-none absolute -right-20 top-40 size-72 rounded-full bg-[#7c3aed]/20 blur-3xl" />

                <header className="fixed inset-x-0 top-0 z-50 border-b border-[#c4b5fd]/50 bg-white/80 backdrop-blur-xl">
                    <div className="container mx-auto flex h-[73px] items-center gap-4 px-4 md:px-8">
                        <button
                            type="button"
                            onClick={() =>
                                handleMenuNavigation(paths.home.getHref())
                            }
                            className="flex cursor-pointer items-center gap-2 p-1"
                            aria-label="Về trang chủ"
                        >
                            <img
                                src="/logo_notext.svg"
                                alt="Logo BK Volunteers"
                                className="h-11 w-auto object-contain"
                            />
                            <img
                                src="/logo_text.svg"
                                alt="BK Volunteers"
                                className="h-6 w-auto object-contain"
                            />
                        </button>

                        <nav className="ml-auto hidden items-center gap-1 lg:flex">
                            <button
                                type="button"
                                onClick={() =>
                                    handleMenuNavigation(paths.home.getHref())
                                }
                                className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#ede9fe] hover:text-bk-blue"
                            >
                                Trang chủ
                            </button>

                            {navGroups.map((group) => (
                                <div
                                    key={group.label}
                                    className="relative"
                                    onMouseEnter={() =>
                                        setHoveredNavGroup(group.label)
                                    }
                                    onMouseLeave={() =>
                                        setHoveredNavGroup((current) =>
                                            current === group.label
                                                ? null
                                                : current,
                                        )
                                    }
                                >
                                    <button
                                        type="button"
                                        onFocus={() =>
                                            setHoveredNavGroup(group.label)
                                        }
                                        onBlur={() =>
                                            setHoveredNavGroup((current) =>
                                                current === group.label
                                                    ? null
                                                    : current,
                                            )
                                        }
                                        className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-[#ede9fe] hover:text-bk-blue"
                                    >
                                        {group.label}
                                        <ChevronDown className="size-4" />
                                    </button>

                                    <div
                                        className={`absolute left-0 top-full z-50 pt-2 transition-all duration-150 ease-out ${
                                            hoveredNavGroup === group.label
                                                ? 'pointer-events-auto visible translate-y-0 opacity-100'
                                                : 'pointer-events-none invisible -translate-y-1 opacity-0'
                                        }`}
                                    >
                                        <div className="w-64 rounded-xl border border-[#ddd6fe] bg-white p-1.5 shadow-xl shadow-[#7c3aed]/15">
                                            {group.items.map((item) => (
                                                <button
                                                    key={item.label}
                                                    type="button"
                                                    onClick={() =>
                                                        handleMenuNavigation(
                                                            item.href,
                                                        )
                                                    }
                                                    className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-[#ede9fe] hover:text-bk-blue"
                                                >
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </nav>

                        {!isLoggedIn ? (
                            <Button
                                size="sm"
                                className="border-none bg-[#7c3aed] px-4 text-white hover:bg-[#6d28d9]"
                                onClick={handleGetStarted}
                            >
                                Đăng nhập
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon-sm"
                                    className="rounded-full border-[#ddd6fe] bg-white text-[#7c3aed] hover:bg-[#ede9fe]"
                                    aria-label="Thông báo"
                                >
                                    <Bell className="size-4.5" />
                                </Button>

                                <DropdownMenu
                                    open={avatarMenuOpen}
                                    onOpenChange={setAvatarMenuOpen}
                                >
                                    <DropdownMenuTrigger
                                        onMouseEnter={openAvatarMenu}
                                        onMouseLeave={closeAvatarMenu}
                                        onFocus={openAvatarMenu}
                                        onBlur={closeAvatarMenu}
                                        className="flex items-center gap-2 rounded-full border border-[#ddd6fe] bg-white px-1.5 py-1 pr-3 transition-colors hover:bg-[#f5f3ff]"
                                    >
                                        <div className="flex size-8 items-center justify-center rounded-full bg-bk-blue text-xs font-bold text-white">
                                            {avatarInitials}
                                        </div>
                                        <span className="max-w-28 truncate text-xs font-semibold text-slate-700">
                                            {userDisplayName}
                                        </span>
                                    </DropdownMenuTrigger>

                                    <DropdownMenuContent
                                        align="end"
                                        sideOffset={8}
                                        onMouseEnter={openAvatarMenu}
                                        onMouseLeave={closeAvatarMenu}
                                        className="w-64 rounded-xl border border-[#ddd6fe] bg-white p-1.5 shadow-xl shadow-[#7c3aed]/15"
                                    >
                                        <DropdownMenuGroup>
                                            <DropdownMenuLabel className="px-3 py-2 text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                                Tài khoản
                                            </DropdownMenuLabel>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleMenuNavigation(
                                                        paths.app.profile.getHref(),
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium"
                                            >
                                                <User className="mr-2 size-4" />
                                                Trang cá nhân
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleMenuNavigation(
                                                        `${paths.app.profile.getHref()}?mode=edit`,
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium"
                                            >
                                                Chỉnh sửa trang cá nhân
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleMenuNavigation(
                                                        paths.app.settings.getHref(),
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium"
                                            >
                                                Cài đặt tài khoản
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() =>
                                                    handleMenuNavigation(
                                                        paths.app.dashboard.getHref(),
                                                    )
                                                }
                                                className="cursor-pointer rounded-lg px-3 py-2 text-sm font-medium"
                                            >
                                                Hoạt động của tôi
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            className="cursor-pointer rounded-lg px-3 py-2 text-sm font-semibold text-destructive focus:bg-destructive focus:text-destructive-foreground"
                                        >
                                            <LogOut className="mr-2 size-4" />
                                            Đăng xuất
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                    </div>
                </header>

                <main className="relative flex-1 pt-[73px]">
                    <section className="relative w-full">
                        <div
                            className="relative h-[58vh] min-h-[360px] overflow-hidden sm:min-h-[460px] lg:h-[72vh] lg:min-h-[560px]"
                            onMouseEnter={() => setIsCarouselPaused(true)}
                            onMouseLeave={() => setIsCarouselPaused(false)}
                        >
                            {carouselSlides.map((slide, index) => (
                                <div
                                    key={slide.src}
                                    className={`absolute inset-0 transition-opacity duration-700 ${
                                        index === currentSlideIndex
                                            ? 'opacity-100'
                                            : 'pointer-events-none opacity-0'
                                    }`}
                                >
                                    <img
                                        src={slide.src}
                                        alt={slide.alt}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                            ))}

                            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/15 to-black/30" />
                            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-black/80 via-black/45 to-transparent" />

                            <div className="absolute inset-x-0 bottom-10 z-20 px-6 text-center text-white md:bottom-14">
                                <h2 className="font-heading text-4xl font-extrabold tracking-tight drop-shadow-lg md:text-6xl">
                                    BK VOLUNTEERS
                                </h2>
                                <p className="mx-auto mt-3 max-w-4xl text-sm font-medium text-white/90 md:text-lg">
                                    Nền tảng số hóa giúp tối ưu hóa việc quản
                                    lý, kết nối và triển khai các chiến dịch
                                    tình nguyện tại Trường Đại học Bách Khoa -
                                    Đại học Đà Nẵng
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handlePreviousSlide}
                                aria-label="Ảnh trước"
                                className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/35 md:left-6 md:p-3"
                            >
                                <ChevronLeft className="size-5 md:size-6" />
                            </button>

                            <button
                                type="button"
                                onClick={handleNextSlide}
                                aria-label="Ảnh tiếp theo"
                                className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/35 md:right-6 md:p-3"
                            >
                                <ChevronRight className="size-5 md:size-6" />
                            </button>

                            <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-2 md:bottom-6">
                                {carouselSlides.map((slide, index) => (
                                    <button
                                        key={`dot-${slide.src}`}
                                        type="button"
                                        onClick={() => handleSelectSlide(index)}
                                        aria-label={`Chuyển đến ảnh ${index + 1}`}
                                        className={`size-2.5 rounded-full transition md:size-3 ${
                                            index === currentSlideIndex
                                                ? 'bg-white'
                                                : 'bg-white/45 hover:bg-white/80'
                                        }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </section>

                    <section className="w-full py-16 md:py-24">
                        <div className="container mx-auto grid gap-10 px-4 md:px-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center">
                            <div className="space-y-7">
                                <p className="inline-flex rounded-full border border-[#c4b5fd] bg-white/80 px-3 py-1 text-xs font-semibold tracking-wide text-[#6d28d9] uppercase">
                                    Nền tảng điều phối tình nguyện BK
                                </p>
                                <div className="space-y-5">
                                    <h1 className="font-heading text-4xl leading-[1.1] font-bold tracking-tight text-slate-900 md:text-5xl lg:text-6xl">
                                        Kết nối trái tim,
                                        <br />
                                        lan tỏa yêu thương
                                    </h1>
                                    <p className="max-w-xl text-base leading-7 text-slate-600 md:text-lg md:leading-8">
                                        Nền tảng quản lý tình nguyện dành cho
                                        sinh viên Bách Khoa, kết hợp quy trình
                                        nhanh, giao diện rõ ràng và dữ liệu minh
                                        bạch theo thời gian thực.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                    <Button
                                        size="lg"
                                        className="h-11 border-none bg-[#7c3aed] px-6 text-white shadow-lg shadow-[#7c3aed]/25 hover:bg-[#6d28d9]"
                                        onClick={handleGetStarted}
                                    >
                                        Bắt đầu ngay
                                        <ArrowRight className="size-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        className="h-11 border-[#c4b5fd] bg-white/80 px-6 text-[#6d28d9] hover:bg-[#ede9fe]"
                                        onClick={() =>
                                            navigate(
                                                paths.auth.register.getHref(),
                                            )
                                        }
                                    >
                                        Đăng ký tình nguyện viên
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-3xl border border-white/80 bg-white/80 p-5 shadow-xl shadow-[#7c3aed]/10 backdrop-blur-md md:p-7">
                                <div className="mb-6 flex items-center justify-between">
                                    <div>
                                        <p className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
                                            Bảng điều phối
                                        </p>
                                        <h2 className="font-heading text-xl font-semibold text-slate-900">
                                            Hoạt động hôm nay
                                        </h2>
                                    </div>
                                    <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                                        Đang hoạt động
                                    </span>
                                </div>
                                <div className="space-y-3">
                                    {dashboardSignals.map((signal) => (
                                        <div
                                            key={signal.label}
                                            className="flex items-center justify-between rounded-2xl border border-[#ddd6fe] bg-[#faf7ff] px-4 py-3"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="rounded-xl bg-[#ede9fe] p-2 text-[#7c3aed]">
                                                    <signal.icon className="size-4" />
                                                </div>
                                                <span className="text-sm text-slate-600">
                                                    {signal.label}
                                                </span>
                                            </div>
                                            <span className="font-mono text-sm font-semibold text-slate-900">
                                                {signal.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id="features" className="w-full py-16 md:py-20">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="mb-10 max-w-2xl space-y-3">
                                <p className="text-xs font-semibold tracking-wide text-[#6d28d9] uppercase">
                                    Bộ tính năng
                                </p>
                                <h2 className="font-heading text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
                                    Tính năng nổi bật
                                </h2>
                                <p className="leading-7 text-slate-600">
                                    Quy trình theo thẻ giúp bạn theo dõi sự
                                    kiện, thành viên và tác động cộng đồng ngay
                                    trên cùng một hệ thống.
                                </p>
                            </div>
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
                                {featureCards.map((feature) => (
                                    <article
                                        key={feature.title}
                                        className="group rounded-2xl border border-[#ddd6fe] bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-[#7c3aed]/10"
                                    >
                                        <div className="mb-4 inline-flex rounded-xl bg-[#ede9fe] p-2.5 text-[#7c3aed]">
                                            <feature.icon className="size-5" />
                                        </div>
                                        <h3 className="mb-2 font-heading text-lg font-semibold text-slate-900">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm leading-6 text-slate-600">
                                            {feature.description}
                                        </p>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </section>

                    <section id="about" className="w-full pb-16 md:pb-24">
                        <div className="container mx-auto px-4 md:px-8">
                            <div className="rounded-3xl border border-[#c4b5fd]/70 bg-gradient-to-r from-[#f5f3ff] to-white p-6 md:p-9">
                                <div className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
                                    <div className="space-y-4">
                                        <h2 className="font-heading text-2xl font-bold text-slate-900 md:text-3xl">
                                            Sẵn sàng tạo ra tác động thật sự?
                                        </h2>
                                        <p className="leading-7 text-slate-600">
                                            Đăng nhập để bắt đầu chiến dịch mới,
                                            điều phối tình nguyện viên và theo
                                            dõi kết quả theo thời gian thực.
                                        </p>
                                    </div>
                                    <div className="space-y-3">
                                        <Button
                                            size="lg"
                                            className="h-11 w-full border-none bg-[#7c3aed] text-white hover:bg-[#6d28d9]"
                                            onClick={handleGetStarted}
                                        >
                                            Tham gia ngay
                                        </Button>
                                        <p className="text-center text-xs text-slate-500">
                                            Miễn phí cho sinh viên và các tổ
                                            chức phi lợi nhuận.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div id="faq" className="sr-only" />
                    <div id="terms" className="sr-only" />
                    <div id="privacy" className="sr-only" />
                    <div id="contact" className="sr-only" />
                    <div id="volunteer-map" className="sr-only" />
                    <div id="news-board" className="sr-only" />
                </main>

                <footer className="border-t border-[#ddd6fe] bg-white/70">
                    <div className="container mx-auto flex flex-col gap-2 px-4 py-6 text-xs text-slate-500 md:flex-row md:items-center md:px-8">
                        <p>© 2026 BK Volunteers. Bảo lưu mọi quyền.</p>
                        <nav className="md:ml-auto">
                            <a
                                href="#"
                                className="transition-colors hover:text-[#7c3aed]"
                            >
                                Điều khoản và Chính sách bảo mật
                            </a>
                        </nav>
                    </div>
                </footer>
            </div>
        </>
    );
};
