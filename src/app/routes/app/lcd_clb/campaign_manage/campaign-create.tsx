import * as React from 'react';
import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    CircleDot,
    Eye,
    FileText,
    Lock,
    MapPinned,
    Save,
    ShieldCheck,
    Sparkles,
    UploadCloud,
} from 'lucide-react';

import { ContentLayout } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link } from '@/components/ui/link';
import { useNotifications } from '@/components/ui/notifications';
import { paths } from '@/config/paths';
import { getScopeLabel, isManagerAccount, useUser } from '@/features/auth';
import { cn } from '@/lib/utils';
import type { User } from '@/types/api';

const cardClass =
    'rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-[0_30px_80px_-42px_rgba(46,80,119,0.34)] backdrop-blur-sm';
const fieldClass =
    'w-full rounded-[1.1rem] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.95)] transition-all duration-200 placeholder:text-slate-300 hover:border-[#79D7BE] focus:border-[#4DA1A9] focus:outline-none focus:ring-4 focus:ring-[#79D7BE]/25';

const steps = [
    'Khởi tạo bản nháp',
    'Hoàn thiện kế hoạch',
    'Xem trước và nộp duyệt',
] as const;
const campaignTypes = [
    'Tình nguyện cộng đồng',
    'Hỗ trợ học thuật',
    'Sự kiện gây quỹ',
    'Chương trình sức khỏe - nhân đạo',
] as const;
const tips = [
    'Tên chiến dịch nên phản ánh rõ mục tiêu phục vụ cộng đồng.',
    'Có thể lưu nháp trước rồi mới bổ sung dự trù, truyền thông và minh chứng.',
    'Phạm vi CLB/Khoa được gắn tự động theo tài khoản manager.',
] as const;

type DraftCampaignForm = {
    name: string;
    category: string;
    location: string;
    summary: string;
    registrationStart: string;
    registrationEnd: string;
    campaignStart: string;
    campaignEnd: string;
    attachments: File[];
};

const initialForm: DraftCampaignForm = {
    name: '',
    category: campaignTypes[0],
    location: '',
    summary: '',
    registrationStart: '',
    registrationEnd: '',
    campaignStart: '',
    campaignEnd: '',
    attachments: [],
};

const getContext = (user: User) => {
    if (user.roleType === 'CLB_MANAGER') {
        return {
            organizerType: 'CLB',
            scopeLabel: 'CLB phụ trách',
            scopeValue: user.clubName || user.scopeName || 'CLB đang quản lý',
            helper: 'Campaign draft được tự động khóa vào CLB của manager hiện tại.',
        };
    }
    if (user.roleType === 'LCD_MANAGER') {
        return {
            organizerType: 'LCD',
            scopeLabel: 'Khoa phụ trách',
            scopeValue:
                user.facultyName || user.scopeName || 'Khoa đang quản lý',
            helper: 'Phạm vi khoa được gắn tự động và không cho chọn thủ công.',
        };
    }
    return {
        organizerType: 'DOANTRUONG',
        scopeLabel: 'Phạm vi quản trị',
        scopeValue: user.scopeName || 'Đoàn trường',
        helper: 'Tài khoản Đoàn trường có thể khởi tạo draft ở cấp tổng.',
    };
};

const formatEditedAt = (value: Date) =>
    new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(value);

export const CampaignCreateRoute = () => {
    const user = useUser();
    const currentUser = user.data as User | null | undefined;
    const { addNotification } = useNotifications();
    const [form, setForm] = React.useState(initialForm);
    const [nameError, setNameError] = React.useState<string>();
    const [isDirty, setIsDirty] = React.useState(false);
    const [savedAt, setSavedAt] = React.useState(() => new Date());

    if (!currentUser || !isManagerAccount(currentUser)) return null;

    const context = getContext(currentUser);
    const scopeName = getScopeLabel(currentUser) || context.scopeValue;
    const completed = [
        form.name.trim(),
        form.location.trim(),
        form.summary.trim(),
        form.registrationStart,
        form.registrationEnd,
        form.campaignStart,
        form.campaignEnd,
        form.attachments.length > 0 ? 'uploaded' : '',
    ].filter(Boolean).length;

    const setField = <K extends keyof DraftCampaignForm>(
        key: K,
        value: DraftCampaignForm[K],
    ) => {
        setForm((current) => ({ ...current, [key]: value }));
        setIsDirty(true);
        if (key === 'name' && String(value).trim()) setNameError(undefined);
    };

    const onSave = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form.name.trim()) {
            setNameError('Vui lòng nhập tên chiến dịch để tạo bản nháp.');
            addNotification({
                type: 'warning',
                title: 'Thiếu thông tin tối thiểu',
                message:
                    'Tên chiến dịch là trường bắt buộc duy nhất ở bước tạo nháp theo PB-10.',
            });
            return;
        }
        setSavedAt(new Date());
        setIsDirty(false);
        addNotification({
            type: 'success',
            title: 'Đã lưu chiến dịch ở trạng thái nháp',
            message: `${form.name.trim()} hiện ở chế độ DRAFT / NOT_PUBLIC và có thể tiếp tục hoàn thiện sau.`,
        });
    };

    const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setField('attachments', Array.from(event.target.files ?? []));
    };

    return (
        <ContentLayout title="Tạo chiến dịch nháp">
            <form onSubmit={onSave} className="space-y-8 pb-28">
                <section className={cardClass}>
                    <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
                        <div className="max-w-3xl">
                            <nav className="flex items-center gap-2 mb-4 text-sm text-slate-500">
                                <Link
                                    to={paths.app.campaigns.getHref()}
                                    className="inline-flex items-center gap-2 font-medium text-slate-500 hover:text-[#2E5077]"
                                >
                                    <ArrowLeft className="size-4" />
                                    Campaigns
                                </Link>
                                <span>/</span>
                                <span className="font-semibold text-[#2E5077]">
                                    Tạo chiến dịch nháp
                                </span>
                            </nav>
                            <div className="flex flex-wrap gap-3 mb-5">
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#79D7BE]/70 bg-[#79D7BE]/18 px-3 py-1 text-xs font-semibold text-[#2E5077]">
                                    <ShieldCheck className="size-4" />
                                    DRAFT / NOT_PUBLIC
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-full border border-[#4DA1A9]/20 bg-[#4DA1A9]/10 px-3 py-1 text-xs font-semibold text-[#2E5077]">
                                    <Lock className="size-4" />
                                    Manager only
                                </span>
                                <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold bg-white border rounded-full border-slate-200 text-slate-500">
                                    <Sparkles className="size-4 text-[#4DA1A9]" />
                                    Scope: {scopeName}
                                </span>
                            </div>
                            <h1 className="text-3xl font-bold tracking-tight text-[#2E5077] sm:text-4xl">
                                Khởi tạo chiến dịch ở chế độ nháp
                            </h1>
                            <p className="max-w-2xl mt-3 text-sm leading-7 text-slate-500 sm:text-base">
                                Bám theo PB-10: manager có thể tạo campaign
                                draft với dữ liệu tối thiểu, không công khai và
                                vẫn giữ đúng context CLB/Khoa/Đoàn trường.
                            </p>
                        </div>

                        <div className="grid gap-3 sm:min-w-[320px]">
                            <div className="rounded-[24px] border border-white/70 bg-[linear-gradient(135deg,rgba(77,161,169,0.14),rgba(121,215,190,0.08),rgba(255,255,255,0.96))] p-4 shadow-[0_16px_40px_-30px_rgba(77,161,169,0.7)]">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4DA1A9]">
                                    Draft Progress
                                </p>
                                <div className="flex items-end justify-between gap-4 mt-3">
                                    <div>
                                        <p className="text-3xl font-bold text-[#2E5077]">
                                            {completed}/8
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Gợi ý đã điền
                                        </p>
                                    </div>
                                    <p className="max-w-[160px] text-right text-xs leading-5 text-slate-500">
                                        Chỉ tên chiến dịch là bắt buộc. Phần còn
                                        lại có thể bổ sung sau khi lưu nháp.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 xl:justify-end">
                                <Link
                                    to={paths.app.campaigns.getHref()}
                                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 hover:border-[#79D7BE] hover:text-[#2E5077]"
                                >
                                    Quay lại danh sách
                                </Link>
                                <Button
                                    type="submit"
                                    className="rounded-full bg-[#4DA1A9] px-5 text-white shadow-[0_20px_40px_-26px_rgba(77,161,169,0.92)] hover:bg-[#428f96]"
                                >
                                    <Save className="mr-2 size-4" />
                                    Lưu nháp
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                <section
                    className={cn(
                        cardClass,
                        'bg-[linear-gradient(135deg,rgba(255,255,255,0.92),rgba(238,249,251,0.95),rgba(255,255,255,0.98))]',
                    )}
                >
                    <div className="grid gap-3 md:grid-cols-3">
                        {steps.map((step, index) => (
                            <div
                                key={step}
                                className={cn(
                                    'rounded-[24px] border p-4',
                                    index === 0
                                        ? 'border-[#4DA1A9]/30 bg-white shadow-[0_18px_42px_-30px_rgba(77,161,169,0.75)]'
                                        : 'border-white/70 bg-white/70',
                                )}
                            >
                                <div
                                    className={cn(
                                        'inline-flex size-9 items-center justify-center rounded-full text-sm font-bold',
                                        index === 0
                                            ? 'bg-[#4DA1A9] text-white'
                                            : 'bg-slate-100 text-slate-400',
                                    )}
                                >
                                    {index + 1}
                                </div>
                                <h2 className="mt-4 text-base font-semibold text-slate-800">
                                    {step}
                                </h2>
                            </div>
                        ))}
                    </div>
                </section>

                <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_340px]">
                    <div className="space-y-8">
                        <section className={cardClass}>
                            <div className="mb-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4DA1A9]">
                                    Basic Identity
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#2E5077]">
                                    Thông tin tối thiểu để lưu nháp
                                </h2>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between gap-3">
                                        <Label
                                            htmlFor="campaign-name"
                                            className="text-sm font-semibold text-slate-700"
                                        >
                                            Tên chiến dịch
                                        </Label>
                                        <span className="rounded-full bg-[#4DA1A9]/10 px-2.5 py-1 text-[11px] font-semibold text-[#2E5077]">
                                            Bắt buộc
                                        </span>
                                    </div>
                                    <Input
                                        id="campaign-name"
                                        value={form.name}
                                        onChange={(event) =>
                                            setField('name', event.target.value)
                                        }
                                        placeholder="Ví dụ: Chiến dịch Mùa hè xanh 2026"
                                        error={nameError}
                                        className={fieldClass}
                                    />
                                </div>

                                <div className="grid gap-6 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Loại chiến dịch
                                        </Label>
                                        <select
                                            value={form.category}
                                            onChange={(event) =>
                                                setField(
                                                    'category',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        >
                                            {campaignTypes.map((option) => (
                                                <option
                                                    key={option}
                                                    value={option}
                                                >
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-sm font-semibold text-slate-700">
                                            Địa điểm dự kiến
                                        </Label>
                                        <div className="relative">
                                            <MapPinned className="absolute -translate-y-1/2 pointer-events-none left-4 top-1/2 size-4 text-slate-300" />
                                            <input
                                                value={form.location}
                                                onChange={(event) =>
                                                    setField(
                                                        'location',
                                                        event.target.value,
                                                    )
                                                }
                                                placeholder="Khu vực hoạt động hoặc địa bàn triển khai"
                                                className={cn(
                                                    fieldClass,
                                                    'pl-11',
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-slate-700">
                                        Mô tả ngắn / thông điệp chiến dịch
                                    </Label>
                                    <textarea
                                        rows={5}
                                        value={form.summary}
                                        onChange={(event) =>
                                            setField(
                                                'summary',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="Mô tả mục tiêu, nhóm thụ hưởng hoặc thông điệp chính để đội ngũ dễ quay lại hoàn thiện."
                                        className={cn(
                                            fieldClass,
                                            'min-h-[140px] resize-y',
                                        )}
                                    />
                                </div>
                            </div>
                        </section>

                        <section className={cardClass}>
                            <div className="mb-8">
                                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4DA1A9]">
                                    Planning Documents
                                </p>
                                <h2 className="mt-2 text-2xl font-bold text-[#2E5077]">
                                    Hồ sơ và tài liệu hỗ trợ
                                </h2>
                            </div>
                            <label
                                htmlFor="campaign-files"
                                className="group flex cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-[#79D7BE]/65 bg-[linear-gradient(180deg,rgba(238,249,251,0.6),rgba(255,255,255,0.95))] px-6 py-10 text-center hover:border-[#4DA1A9]"
                            >
                                <input
                                    id="campaign-files"
                                    type="file"
                                    multiple
                                    onChange={onFileChange}
                                    className="sr-only"
                                />
                                <div className="flex size-16 items-center justify-center rounded-full bg-[#4DA1A9]/12 text-[#4DA1A9]">
                                    <UploadCloud className="size-8" />
                                </div>
                                <p className="mt-4 text-base font-semibold text-slate-800">
                                    Kéo thả file hoặc chọn từ máy tính
                                </p>
                                <p className="max-w-xl mt-2 text-sm leading-6 text-slate-500">
                                    Upload là tùy chọn ở bước nháp. Có thể bổ
                                    sung sau mà không khóa thao tác lưu.
                                </p>
                            </label>
                            {form.attachments.length > 0 && (
                                <div className="mt-6 space-y-3">
                                    {form.attachments.map((file) => (
                                        <div
                                            key={`${file.name}-${file.size}`}
                                            className="flex items-center gap-4 rounded-[22px] border border-slate-100 bg-white p-4"
                                        >
                                            <div className="flex size-11 items-center justify-center rounded-2xl bg-[#4DA1A9]/10 text-[#4DA1A9]">
                                                <FileText className="size-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold truncate text-slate-800">
                                                    {file.name}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    <aside className="space-y-6">
                        <section className={cardClass}>
                            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#4DA1A9]">
                                Role Context
                            </p>
                            <h2 className="mt-2 text-xl font-bold text-[#2E5077]">
                                Ngữ cảnh được gắn tự động
                            </h2>
                            <div className="mt-6 space-y-4">
                                <div className="rounded-[22px] border border-slate-100 bg-slate-50/70 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Organizer Type
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-slate-800">
                                        {context.organizerType}
                                    </p>
                                </div>
                                <div className="rounded-[22px] border border-slate-100 bg-slate-50/70 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        {context.scopeLabel}
                                    </p>
                                    <p className="mt-2 text-base font-semibold text-slate-800">
                                        {context.scopeValue}
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                        {context.helper}
                                    </p>
                                </div>
                                <div className="rounded-[22px] border border-[#79D7BE]/55 bg-[#79D7BE]/14 p-4 text-xs leading-5 text-slate-600">
                                    Campaign mới luôn ở trạng thái nháp, chưa
                                    công khai và chưa đi vào luồng duyệt.
                                </div>
                            </div>
                        </section>

                        <section className={cardClass}>
                            <div className="flex items-center gap-3 mb-4">
                                <CalendarDays className="size-5 text-[#4DA1A9]" />
                                <h2 className="text-xl font-bold text-[#2E5077]">
                                    Timeline dự kiến
                                </h2>
                            </div>
                            <div className="space-y-4">
                                <div className="rounded-[22px] border border-slate-100 bg-slate-50/60 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Đăng ký / gây quỹ
                                    </p>
                                    <div className="grid gap-3 mt-3">
                                        <input
                                            type="date"
                                            value={form.registrationStart}
                                            onChange={(event) =>
                                                setField(
                                                    'registrationStart',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                        <input
                                            type="date"
                                            value={form.registrationEnd}
                                            onChange={(event) =>
                                                setField(
                                                    'registrationEnd',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                    </div>
                                </div>
                                <div className="rounded-[22px] border border-slate-100 bg-slate-50/60 p-4">
                                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                                        Triển khai chiến dịch
                                    </p>
                                    <div className="grid gap-3 mt-3">
                                        <input
                                            type="date"
                                            value={form.campaignStart}
                                            onChange={(event) =>
                                                setField(
                                                    'campaignStart',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                        <input
                                            type="date"
                                            value={form.campaignEnd}
                                            onChange={(event) =>
                                                setField(
                                                    'campaignEnd',
                                                    event.target.value,
                                                )
                                            }
                                            className={fieldClass}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section
                            className={cn(
                                cardClass,
                                'bg-[linear-gradient(180deg,rgba(121,215,190,0.18),rgba(255,255,255,0.96))]',
                            )}
                        >
                            <div className="flex items-center gap-3">
                                <CheckCircle2 className="size-5 text-[#4DA1A9]" />
                                <h2 className="text-xl font-bold text-[#2E5077]">
                                    Tips cho người tạo
                                </h2>
                            </div>
                            <ul className="mt-5 space-y-3">
                                {tips.map((tip) => (
                                    <li
                                        key={tip}
                                        className="flex items-start gap-3 rounded-[20px] bg-white/80 p-3 text-sm leading-6 text-slate-600"
                                    >
                                        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#4DA1A9]" />
                                        <span>{tip}</span>
                                    </li>
                                ))}
                            </ul>
                        </section>

                        <section
                            className={cn(cardClass, 'overflow-hidden p-0')}
                        >
                            <div className="bg-[radial-gradient(circle_at_top_left,rgba(121,215,190,0.45),rgba(77,161,169,0.9)_45%,rgba(46,80,119,0.95)_100%)] px-6 py-6 text-white">
                                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/75">
                                    Draft Preview
                                </p>
                                <h2 className="mt-3 text-2xl font-bold leading-tight">
                                    {form.name.trim() ||
                                        'Tên chiến dịch sẽ hiển thị ở đây'}
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-white/80">
                                    {form.summary.trim() ||
                                        'Bản nháp chỉ cần tên chiến dịch để được tạo. Các thông tin còn lại có thể hoàn thiện sau.'}
                                </p>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <CircleDot className="size-4 text-[#4DA1A9]" />
                                    <span>Trạng thái: DRAFT / NOT_PUBLIC</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <MapPinned className="size-4 text-[#4DA1A9]" />
                                    <span>
                                        {form.location.trim() ||
                                            context.scopeValue}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-slate-500">
                                    <ShieldCheck className="size-4 text-[#4DA1A9]" />
                                    <span>Tạo bởi {scopeName}</span>
                                </div>
                            </div>
                        </section>
                    </aside>
                </div>
                <div className="sticky z-20 bottom-4">
                    <div className="rounded-[28px] border border-white/75 bg-white/85 p-4 shadow-[0_24px_60px_-34px_rgba(46,80,119,0.35)] backdrop-blur-xl">
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
                                <div className="inline-flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-full bg-slate-100 text-slate-600">
                                    <span
                                        className={cn(
                                            'size-2 rounded-full',
                                            isDirty
                                                ? 'bg-amber-500'
                                                : 'bg-[#4DA1A9]',
                                        )}
                                    />
                                    {isDirty ? 'Đang chỉnh sửa' : 'Đã lưu nháp'}
                                </div>
                                <p className="text-xs text-slate-500">
                                    Tự động cập nhật lúc{' '}
                                    <span className="font-semibold text-slate-700">
                                        {formatEditedAt(savedAt)}
                                    </span>
                                </p>
                                <p className="text-xs text-slate-500">
                                    PB-10 yêu cầu campaign mới luôn ở trạng thái
                                    nháp và chưa công khai.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    className="px-5 rounded-full text-slate-600 hover:bg-slate-100"
                                    onClick={() =>
                                        addNotification({
                                            type: 'info',
                                            title: 'Bản xem trước đang ở chế độ nháp',
                                            message:
                                                'Campaign chưa công khai và chưa vào luồng duyệt cho đến khi hồ sơ được hoàn thiện.',
                                        })
                                    }
                                >
                                    <Eye className="mr-2 size-4" />
                                    Xem trước
                                </Button>
                                <Button
                                    type="button"
                                    disabled
                                    className="px-5 border rounded-full shadow-none border-slate-200 bg-slate-100 text-slate-400 hover:bg-slate-100"
                                >
                                    Gửi phê duyệt ở bước sau
                                </Button>
                                <Button
                                    type="submit"
                                    className="rounded-full bg-[#4DA1A9] px-6 text-white shadow-[0_22px_44px_-28px_rgba(77,161,169,0.92)] hover:bg-[#428f96]"
                                >
                                    <Save className="mr-2 size-4" />
                                    Lưu nháp và tiếp tục
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </ContentLayout>
    );
};
