'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { isLocale, LOCALE_COOKIE } from '@/i18n/config';
import { apiRequest } from '@/lib/api';
import { getSessionToken } from '@/lib/session';
import type { Locale } from '@/types/api';

export async function setLocale(locale: Locale): Promise<void> {
    if (!isLocale(locale)) return;

    (await cookies()).set(LOCALE_COOKIE, locale, { path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 365 });
    // Saved on the account too, so the choice follows the user to other devices.
    if (await getSessionToken()) {
        await apiRequest('/api/v1/me', { method: 'PATCH', body: { user: { locale } } });
    }
    revalidatePath('/', 'layout');
}
