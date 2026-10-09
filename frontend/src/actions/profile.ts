'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { getTranslations } from 'next-intl/server';
import { isLocale, LOCALE_COOKIE } from '@/i18n/config';
import { apiRequest } from '@/lib/api';
import type { FormState } from '@/lib/form';
import { formValues } from '@/lib/form';
import { setSessionToken } from '@/lib/session';
import type { CurrentUser } from '@/types/api';

export async function updateProfile(_state: FormState, formData: FormData): Promise<FormState> {
    const values = formValues(formData, ['full_name', 'locale']);
    const result = await apiRequest<CurrentUser>('/api/v1/me', {
        method: 'PATCH',
        body: { user: { full_name: values.full_name, locale: values.locale || null } },
    });
    if (!result.ok) return { errors: result.errors, values };

    if (isLocale(values.locale)) {
        (await cookies()).set(LOCALE_COOKIE, values.locale, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
    }
    revalidatePath('/', 'layout');
    const t = await getTranslations('profile');
    return { message: t('details.saved') };
}

export async function changePassword(_state: FormState, formData: FormData): Promise<FormState> {
    const result = await apiRequest('/api/v1/me/password', {
        method: 'PATCH',
        body: {
            user: {
                current_password: String(formData.get('current_password') ?? ''),
                password: String(formData.get('password') ?? ''),
                password_confirmation: String(formData.get('password_confirmation') ?? ''),
            },
        },
    });
    if (!result.ok) return { errors: result.errors };

    // The API revoked every old token (other devices are signed out) and issued this device a new one.
    if (result.token) await setSessionToken(result.token);
    const t = await getTranslations('profile');
    return { message: t('password.changed') };
}

export async function uploadAvatar(_state: FormState, formData: FormData): Promise<FormState> {
    const file = formData.get('avatar');
    if (!(file instanceof File) || file.size === 0) {
        const t = await getTranslations('profile');
        return { errors: [{ field: 'avatar', message: t('avatar.missing') }] };
    }

    const body = new FormData();
    body.append('avatar', file);
    const result = await apiRequest<CurrentUser>('/api/v1/me/avatar', { method: 'PATCH', body });
    if (!result.ok) return { errors: result.errors };

    revalidatePath('/', 'layout');
    const t = await getTranslations('profile');
    return { message: t('avatar.uploaded') };
}

export async function removeAvatar(): Promise<FormState> {
    const result = await apiRequest('/api/v1/me/avatar', { method: 'DELETE' });
    if (!result.ok) return { errors: result.errors };

    revalidatePath('/', 'layout');
    return {};
}
