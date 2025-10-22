import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ApiResponse } from './api-response';

export async function requireAuth() {
    const session = await getServerSession(authOptions);

    if (!session) {
        return { error: ApiResponse.unauthorized() };
    }

    return { session };
}

export async function requireAdmin() {
    const { session, error } = await requireAuth();

    if (error) return { error };

    if (!session.user.is_admin) {
        return { error: ApiResponse.forbidden('Admin access required') };
    }

    return { session };
}

export function isAdmin(session) {
    return session?.user?.is_admin === true;
}
