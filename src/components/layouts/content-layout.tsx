import { Head } from '../seo';

type ContentLayoutProps = {
    children: React.ReactNode;
    title: string;
};

export const ContentLayout = ({ children, title }: ContentLayoutProps) => {
    return (
        <>
            <Head title={title} />
            <div className="py-2">
                <div className="mx-auto max-w-7xl px-1 sm:px-0">{children}</div>
            </div>
        </>
    );
};
