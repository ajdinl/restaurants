import 'server-only';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ApiError, PageMeta } from '@/types/api';
import { getSessionToken } from './session';

const API_URL = process.env.API_URL ?? 'http://localhost:3001';

type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: Method;
    // FormData is sent as multipart (file uploads); anything else as JSON.
    body?: unknown;
    // Sign-in and password reset run without a session.
    authenticated?: boolean;
}

export type ApiResult<T> =
    | { ok: true; status: number; data: T; meta?: PageMeta; token: string | null }
    | { ok: false; status: number; errors: ApiError[] };

export async function apiRequest<T>(
    path: string,
    { method = 'GET', body, authenticated = true }: RequestOptions = {}
): Promise<ApiResult<T>> {
    const token = authenticated ? await getSessionToken() : null;
    const isMultipart = body instanceof FormData;
    const requestHeaders: Record<string, string> = {
        Accept: 'application/json',
        'Accept-Language': await getLocale(),
    };
    // For FormData, fetch sets the multipart Content-Type with its boundary itself.
    if (!isMultipart) requestHeaders['Content-Type'] = 'application/json';
    if (token) requestHeaders.Authorization = `Bearer ${token}`;

    // Rails rate-limits per client IP; without this every user would share the Next.js server's IP.
    const forwardedFor = (await headers()).get('x-forwarded-for');
    if (forwardedFor) requestHeaders['X-Forwarded-For'] = forwardedFor;

    let response: Response;
    try {
        response = await fetch(`${API_URL}${path}`, {
            method,
            headers: requestHeaders,
            body: body === undefined ? undefined : isMultipart ? body : JSON.stringify(body),
            cache: 'no-store',
        });
    } catch {
        const t = await getTranslations('errors');
        return { ok: false, status: 503, errors: [{ field: null, message: t('apiUnavailable') }] };
    }

    // An expired or revoked token: drop the cookie and start over at the login page.
    if (response.status === 401 && token) redirect('/session/expired');

    const payload = response.status === 204 ? null : await response.json().catch(() => null);

    if (!response.ok) {
        const t = await getTranslations('errors');
        const errors: ApiError[] = payload?.errors ?? [{ field: null, message: t('unexpected') }];
        return { ok: false, status: response.status, errors };
    }

    const authorization = response.headers.get('authorization');
    return {
        ok: true,
        status: response.status,
        data: payload?.data as T,
        meta: payload?.meta,
        token: authorization?.startsWith('Bearer ') ? authorization.slice('Bearer '.length) : null,
    };
}

// For page loads: returns the data, shows the 404 page for missing records, and lets the
// error boundary handle anything else.
export function unwrap<T>(result: ApiResult<T>): T {
    return unwrapPage(result).data;
}

export function unwrapPage<T>(result: ApiResult<T>): { data: T; meta?: PageMeta } {
    if (result.ok) return { data: result.data, meta: result.meta };
    if (result.status === 404) notFound();
    throw new Error(result.errors.map((error) => error.message).join(' '));
}
