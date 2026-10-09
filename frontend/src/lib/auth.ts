import 'server-only';
import { cache } from 'react';
import { redirect } from 'next/navigation';
import type { CurrentUser } from '@/types/api';
import { apiRequest, unwrap } from './api';
import { getSessionToken } from './session';

// One /me request per render, however many components ask for the user.
export const getCurrentUser = cache(async (): Promise<CurrentUser> => {
    if (!(await getSessionToken())) redirect('/login');

    return unwrap(await apiRequest<CurrentUser>('/api/v1/me'));
});
