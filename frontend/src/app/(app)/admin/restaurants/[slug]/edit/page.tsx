import { getTranslations } from 'next-intl/server';
import { updateRestaurant } from '@/actions/restaurants';
import { RestaurantForm } from '@/components/admin/RestaurantForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiRequest, unwrap } from '@/lib/api';
import { timeZones } from '@/lib/time-zones';
import type { Restaurant } from '@/types/api';

export default async function EditRestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const t = await getTranslations('admin.restaurants');
    const restaurant = unwrap(await apiRequest<Restaurant>(`/api/v1/admin/restaurants/${encodeURIComponent(slug)}`));

    return (
        <>
            <PageHeader title={t('editTitle')} />
            <RestaurantForm
                action={updateRestaurant.bind(null, restaurant.slug)}
                restaurant={restaurant}
                timeZones={timeZones()}
                cancelHref={`/admin/restaurants/${restaurant.slug}`}
            />
        </>
    );
}
