import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/features/auth';

export const UsersRoute = () => {
    const user = useUser();

    if (!user.data) return null;

    return (
        <ContentLayout title="Users">
            <h1 className="text-xl">Users (Authenticated)</h1>
            <p className="mt-4">Manage your team and user roles here.</p>
        </ContentLayout>
    );
};
