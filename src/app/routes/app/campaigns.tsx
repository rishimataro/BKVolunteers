import { ContentLayout } from '@/components/layouts';
import { useUser } from '@/features/auth';

export const CampaignsRoute = () => {
    const user = useUser();

    if (!user.data) return null;

    return (
        <ContentLayout title="Campaigns">
            <h1 className="text-xl">Campaigns (Demo)</h1>
            <p className="mt-4">Explore and manage volunteer campaigns.</p>
        </ContentLayout>
    );
};
