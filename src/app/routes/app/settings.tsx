import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/features/auth';

export const SettingsRoute = () => {
    const user = useUser();

    if (!user.data) return null;

    return (
        <ContentLayout title="Settings">
            <h1 className="text-xl">Settings</h1>
            <p className="mt-4">Configure your application preferences.</p>
        </ContentLayout>
    );
};
