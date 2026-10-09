import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/EnumBadges';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { Table, Tbody, Td, Th } from '@/components/ui/Table';
import { apiRequest, unwrapPage } from '@/lib/api';
import { pageParam } from '@/lib/search-params';
import type { Restaurant } from '@/types/api';

export default async function RestaurantsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const t = await getTranslations('admin.restaurants');
    const page = pageParam((await searchParams).page);
    const { data: restaurants, meta } = unwrapPage(
        await apiRequest<Restaurant[]>(`/api/v1/admin/restaurants?page=${page}`)
    );

    return (
        <>
            <PageHeader
                title={t('title')}
                actions={<ButtonLink href="/admin/restaurants/new">{t('new')}</ButtonLink>}
            />
            <Table>
                <thead>
                    <tr>
                        <Th>{t('fields.name')}</Th>
                        <Th>{t('fields.city')}</Th>
                        <Th>{t('fields.status')}</Th>
                    </tr>
                </thead>
                <Tbody>
                    {restaurants.map((restaurant) => (
                        <tr key={restaurant.id}>
                            <Td>
                                <Link
                                    href={`/admin/restaurants/${restaurant.slug}`}
                                    className="font-semibold text-ink underline-offset-4 hover:text-pass hover:underline"
                                >
                                    {restaurant.name}
                                </Link>
                            </Td>
                            <Td>{restaurant.city}</Td>
                            <Td>
                                <StatusBadge status={restaurant.status} />
                            </Td>
                        </tr>
                    ))}
                </Tbody>
            </Table>
            {restaurants.length === 0 && (
                <p className="mt-4 rounded-slip border border-dashed border-line px-6 py-8 text-mute">{t('empty')}</p>
            )}
            <Pagination meta={meta} basePath="/admin/restaurants" />
        </>
    );
}
