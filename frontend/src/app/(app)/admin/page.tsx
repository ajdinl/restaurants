import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiRequest, unwrap } from '@/lib/api';
import type { AdminDashboard } from '@/types/api';

export default async function AdminDashboardPage() {
    const t = await getTranslations('admin.dashboard');
    const stats = unwrap(await apiRequest<AdminDashboard>('/api/v1/admin/dashboard'));

    const cards = [
        { label: t('restaurants'), value: stats.restaurants.total },
        { label: t('active'), value: stats.restaurants.active },
        { label: t('suspended'), value: stats.restaurants.suspended },
        { label: t('users'), value: stats.users },
    ];

    return (
        <>
            <PageHeader title={t('title')} />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => (
                    <Card key={card.label}>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{card.label}</p>
                        <p className="mt-1 text-3xl font-semibold">{card.value}</p>
                    </Card>
                ))}
            </div>
        </>
    );
}
