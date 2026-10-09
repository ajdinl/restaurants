'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { LOCALE_COOKIE } from '@/i18n/config';
import { apiRequest } from '@/lib/api';
import type { FormState } from '@/lib/form';
import { formValues } from '@/lib/form';
import { clearSessionToken, setSessionToken } from '@/lib/session';
import type { CurrentUser } from '@/types/api';

export async function signIn(_state: FormState, formData: FormData): Promise<FormState> {
    const { email } = formValues(formData, ['email']);
    const result = await apiRequest<CurrentUser>('/api/v1/auth/sign_in', {
        method: 'POST',
        body: { user: { email, password: String(formData.get('password') ?? '') } },
        authenticated: false,
    });

    if (!result.ok) return { errors: result.errors, values: { email } };
    if (!result.token) {
        const t = await getTranslations('errors');
        return { errors: [{ field: null, message: t('unexpected') }], values: { email } };
    }

    await setSessionToken(result.token);
    if (result.data.locale) {
        (await cookies()).set(LOCALE_COOKIE, result.data.locale, {
            path: '/',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 365,
        });
    }
    redirect('/');
}

export async function signOut(): Promise<void> {
    // Revokes the token on the API side, so a copied token stops working too.
    await apiRequest('/api/v1/auth/sign_out', { method: 'DELETE' });
    await clearSessionToken();
    redirect('/login');
}

export async function requestPasswordReset(_state: FormState, formData: FormData): Promise<FormState> {
    const { email } = formValues(formData, ['email']);
    const result = await apiRequest<{ message: string }>('/api/v1/auth/password', {
        method: 'POST',
        body: { user: { email } },
        authenticated: false,
    });

    return result.ok ? { message: result.data.message } : { errors: result.errors, values: { email } };
}

export async function resetPassword(_state: FormState, formData: FormData): Promise<FormState> {
    const result = await apiRequest<{ message: string }>('/api/v1/auth/password', {
        method: 'PUT',
        body: {
            user: {
                reset_password_token: String(formData.get('token') ?? ''),
                password: String(formData.get('password') ?? ''),
                password_confirmation: String(formData.get('password_confirmation') ?? ''),
            },
        },
        authenticated: false,
    });

    return result.ok ? { message: result.data.message } : { errors: result.errors };
}
