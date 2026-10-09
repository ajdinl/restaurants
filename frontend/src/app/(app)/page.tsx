import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Card } from '@/components/ui/Card';
import { RoleBadge, StatusBadge } from '@/components/ui/EnumBadges';
import { PageHeader } from '@/components/ui/PageHeader';
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
            <PageHeader title={t('title')} />
            {user.memberships.length === 0 ? (
                <Card className="text-neutral-600 dark:text-neutral-400">{t('noAccess')}</Card>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {user.memberships.map(({ id, role, restaurant }) => (
                        <Link key={id} href={`/r/${restaurant.slug}`} className="block">
                            <Card className="h-full transition-shadow hover:shadow-medium">
                                <div className="flex items-start justify-between gap-2">
                                    <h2 className="font-semibold">{restaurant.name}</h2>
                                    <StatusBadge status={restaurant.status} />
                                </div>
                                <div className="mt-3">
                                    <RoleBadge role={role} />
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            )}
        </>
    );
}
