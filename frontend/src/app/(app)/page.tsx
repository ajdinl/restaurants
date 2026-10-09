import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { RoleBadge, StatusBadge } from '@/components/ui/EnumBadges';
import { PageHeader } from '@/components/ui/PageHeader';
import { Ticket, TicketRail } from '@/components/ui/Ticket';
import { getCurrentUser } from '@/lib/auth';
import { isPlatformStaff } from '@/lib/permissions';

// Sends each user to the right place: admins to the admin area, single-restaurant staff straight in.
export default async function HomePage() {
    const user = await getCurrentUser();
    if (isPlatformStaff(user)) redirect('/admin');
    if (user.memberships.length === 1) redirect(`/r/${user.memberships[0].restaurant.slug}`);

    const t = await getTranslations('home');

    return (
        <>
            <PageHeader title={t('title')} description={user.memberships.length > 0 ? t('pick') : undefined} />
            {user.memberships.length === 0 ? (
                <p className="max-w-prose rounded-slip border border-dashed border-line px-6 py-8 text-mute">
                    {t('noAccess')}
                </p>
            ) : (
                <TicketRail label={t('title')}>
                    {user.memberships.map(({ id, role, restaurant }, index) => (
                        <Ticket
                            key={id}
                            order={index}
                            href={`/r/${restaurant.slug}`}
                            title={restaurant.name}
                            footer={<StatusBadge status={restaurant.status} />}
                        >
                            <RoleBadge role={role} />
                        </Ticket>
                    ))}
                </TicketRail>
            )}
        </>
    );
}
