import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createRestaurant } from '@/actions/restaurants';
import { RestaurantForm } from '@/components/admin/RestaurantForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { timeZones } from '@/lib/time-zones';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('admin.restaurants');
    return { title: t('newTitle') };
}

export default async function NewRestaurantPage() {
    const t = await getTranslations('admin.restaurants');

    return (
        <>
            <PageHeader title={t('newTitle')} />
            <RestaurantForm action={createRestaurant} timeZones={timeZones()} cancelHref="/admin/restaurants" />
        </>
    );
}
