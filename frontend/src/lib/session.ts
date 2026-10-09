import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, SESSION_MAX_AGE } from './constants';

// The JWT lives only in this httpOnly cookie, so browser JavaScript can never read it.
export async function getSessionToken(): Promise<string | null> {
    return (await cookies()).get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string): Promise<void> {
    (await cookies()).set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: SESSION_MAX_AGE,
    });
}

export async function clearSessionToken(): Promise<void> {
    (await cookies()).delete(SESSION_COOKIE);
}
