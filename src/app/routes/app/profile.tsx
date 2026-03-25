import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/features/auth';

export const ProfileRoute = () => {
    const user = useUser();

    if (!user.data) return null;

    return (
        <ContentLayout title="Profile">
            <h1 className="text-xl">Profile (Authenticated)</h1>
            <div className="mt-4 space-y-2">
                <p>
                    <b>Name:</b> {user.data.firstName} {user.data.lastName}
                </p>
                <p>
                    <b>Email:</b> {user.data.email}
                </p>
                <p>
                    <b>Role:</b> {user.data.role}
                </p>
            </div>
        </ContentLayout>
    );
};
