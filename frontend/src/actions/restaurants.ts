'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import type { FormState } from '@/lib/form';
import { checked, formValues } from '@/lib/form';
import type { Restaurant } from '@/types/api';

const FIELDS = ['name', 'slug', 'address', 'city', 'phone', 'email', 'latitude', 'longitude', 'time_zone'];

function restaurantBody(formData: FormData) {
    return { restaurant: { ...formValues(formData, FIELDS), has_host: checked(formData, 'has_host') } };
}

function restaurantPath(slug: string): string {
    return `/api/v1/admin/restaurants/${encodeURIComponent(slug)}`;
}

export async function createRestaurant(_state: FormState, formData: FormData): Promise<FormState> {
    const result = await apiRequest<Restaurant>('/api/v1/admin/restaurants', {
        method: 'POST',
        body: restaurantBody(formData),
    });
    if (!result.ok) return { errors: result.errors, values: formValues(formData, [...FIELDS, 'has_host']) };

    redirect(`/admin/restaurants/${result.data.slug}`);
}

export async function updateRestaurant(slug: string, _state: FormState, formData: FormData): Promise<FormState> {
    const result = await apiRequest<Restaurant>(restaurantPath(slug), {
        method: 'PATCH',
        body: restaurantBody(formData),
    });
    if (!result.ok) return { errors: result.errors, values: formValues(formData, [...FIELDS, 'has_host']) };

    revalidatePath('/admin/restaurants');
    redirect(`/admin/restaurants/${result.data.slug}`);
}

export async function suspendRestaurant(slug: string): Promise<FormState> {
    return changeStatus(slug, 'suspend');
}

export async function activateRestaurant(slug: string): Promise<FormState> {
    return changeStatus(slug, 'activate');
}

async function changeStatus(slug: string, action: 'suspend' | 'activate'): Promise<FormState> {
    const result = await apiRequest<Restaurant>(`${restaurantPath(slug)}/${action}`, { method: 'PATCH' });
    if (!result.ok) return { errors: result.errors };

    revalidatePath(`/admin/restaurants/${slug}`);
    return {};
}

export async function deleteRestaurant(slug: string): Promise<FormState> {
    const result = await apiRequest(restaurantPath(slug), { method: 'DELETE' });
    if (!result.ok) return { errors: result.errors };

    revalidatePath('/admin/restaurants');
    redirect('/admin/restaurants');
}
