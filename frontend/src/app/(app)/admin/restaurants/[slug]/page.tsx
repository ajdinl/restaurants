import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { activateRestaurant, deleteRestaurant, suspendRestaurant } from '@/actions/restaurants';
import { addMember, removeMember, updateMember } from '@/actions/memberships';
import { AddMemberForm } from '@/components/admin/AddMemberForm';
import { MembershipRow } from '@/components/admin/MembershipRow';
import { ActionButton } from '@/components/ui/ActionButton';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/EnumBadges';
import { PageHeader } from '@/components/ui/PageHeader';
import { Table, Tbody, Th } from '@/components/ui/Table';
import { apiRequest, unwrap } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { canDeleteRestaurant } from '@/lib/permissions';
import type { Membership, Restaurant } from '@/types/api';

type Props = { params: Promise<{ slug: string }> };

function restaurantPath(slug: string): string {
    return `/api/v1/admin/restaurants/${encodeURIComponent(slug)}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const result = await apiRequest<Restaurant>(restaurantPath((await params).slug));
    return { title: result.ok ? result.data.name : undefined };
}

export default async function RestaurantPage({ params }: Props) {
    const { slug } = await params;
    const [user, t, tc, restaurantResult, membershipsResult] = await Promise.all([
        getCurrentUser(),
        getTranslations('admin.restaurants'),
        getTranslations('common'),
        apiRequest<Restaurant>(restaurantPath(slug)),
        apiRequest<Membership[]>(`${restaurantPath(slug)}/memberships`),
    ]);
    const restaurant = unwrap(restaurantResult);
    const memberships = unwrap(membershipsResult);
    const tm = await getTranslations('admin.memberships');

    const details: { label: string; value: string | null }[] = [
        { label: t('fields.slug'), value: restaurant.slug },
        { label: t('fields.address'), value: restaurant.address },
        { label: t('fields.city'), value: restaurant.city },
        { label: t('fields.phone'), value: restaurant.phone },
        { label: t('fields.email'), value: restaurant.email },
        { label: t('fields.timeZone'), value: restaurant.time_zone },
        { label: t('fields.hasHost'), value: restaurant.has_host ? tc('yes') : tc('no') },
    ];

    return (
        <>
            <PageHeader
                title={restaurant.name}
                badge={<StatusBadge status={restaurant.status} />}
                actions={
                    <>
                        <ButtonLink variant="secondary" href={`/r/${restaurant.slug}`}>
                            {t('openWorkspace')}
                        </ButtonLink>
                        <ButtonLink variant="secondary" href={`/admin/restaurants/${restaurant.slug}/edit`}>
                            {tc('edit')}
                        </ButtonLink>
                        {restaurant.status === 'active' ? (
                            <ActionButton
                                action={suspendRestaurant.bind(null, restaurant.slug)}
                                label={t('suspend')}
                                confirm={t('suspendConfirm')}
                            />
                        ) : (
                            <ActionButton
                                action={activateRestaurant.bind(null, restaurant.slug)}
                                label={t('activate')}
                                variant="primary"
                            />
                        )}
                        {canDeleteRestaurant(user) && (
                            <ActionButton
                                action={deleteRestaurant.bind(null, restaurant.slug)}
                                label={tc('delete')}
                                confirm={t('deleteConfirm')}
                                variant="danger"
                            />
                        )}
                    </>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="space-y-3 text-sm">
                    {details.map((detail) => (
                        <div key={detail.label}>
                            <p className="text-neutral-500 dark:text-neutral-400">{detail.label}</p>
                            <p className="font-medium">{detail.value || tc('notSet')}</p>
                        </div>
                    ))}
                </Card>

                <Card className="lg:col-span-2">
                    <h2 className="mb-4 text-lg font-semibold">{tm('title')}</h2>
                    {memberships.length === 0 ? (
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{tm('empty')}</p>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <Th>{tm('person')}</Th>
                                    <Th>{tm('role')}</Th>
                                    <Th />
                                </tr>
                            </thead>
                            <Tbody>
                                {memberships.map((membership) => (
                                    <MembershipRow
                                        key={membership.id}
                                        membership={membership}
                                        updateAction={updateMember.bind(null, restaurant.slug, membership.id)}
                                        removeAction={removeMember.bind(null, restaurant.slug, membership.id)}
                                    />
                                ))}
                            </Tbody>
                        </Table>
                    )}
                    <AddMemberForm action={addMember.bind(null, restaurant.slug)} />
                </Card>
            </div>
        </>
    );
}
