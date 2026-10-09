import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiRequest, unwrap } from '@/lib/api';
import type { AdminDashboard } from '@/types/api';

export default async function AdminDashboardPage() {
    const t = await getTranslations('admin.dashboard');
    const stats = unwrap(await apiRequest<AdminDashboard>('/api/v1/admin/dashboard'));

    const counters = [
        { label: t('restaurants'), value: stats.restaurants.total },
        { label: t('active'), value: stats.restaurants.active },
        { label: t('suspended'), value: stats.restaurants.suspended },
        { label: t('users'), value: stats.users },
    ];

    return (
        <>
            <PageHeader
                title={t('title')}
                actions={
                    <>
                        <ButtonLink variant="secondary" href="/admin/users/new">
                            {t('newUser')}
                        </ButtonLink>
                        <ButtonLink href="/admin/restaurants/new">{t('newRestaurant')}</ButtonLink>
                    </>
                }
            />
            {/* One counter board rather than four cards: the numbers read as a single row of state. */}
            <dl className="grid grid-cols-2 overflow-hidden rounded-slip border border-line-soft bg-slip sm:grid-cols-4">
                {counters.map(({ label, value }) => (
                    <div
                        key={label}
                        className="border-line-soft px-6 py-6 not-last:border-b sm:not-last:border-r sm:not-last:border-b-0 max-sm:odd:border-r"
                    >
                        <dd className="font-display text-[3.25rem] leading-none font-bold tracking-[-0.03em] tabular-nums">
                            {value}
                        </dd>
                        <dt className="mt-2 text-sm text-mute">{label}</dt>
                    </div>
                ))}
            </dl>
        </>
    );
}
