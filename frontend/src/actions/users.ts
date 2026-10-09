'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import type { FormState } from '@/lib/form';
import { formValues } from '@/lib/form';
import type { User } from '@/types/api';

const FIELDS = ['full_name', 'email', 'locale', 'platform_role'];

// Empty selects mean "none". Fields absent from the form (platform_role for moderators) are not sent,
// and the API ignores them anyway when the caller may not set them.
function userAttributes(formData: FormData): Record<string, string | null> {
    const attributes: Record<string, string | null> = {};
    for (const field of FIELDS) {
        if (!formData.has(field)) continue;
        const value = String(formData.get(field));
        attributes[field] = field === 'locale' || field === 'platform_role' ? value || null : value;
    }
    return attributes;
}

export async function createUser(_state: FormState, formData: FormData): Promise<FormState> {
    const result = await apiRequest<User>('/api/v1/admin/users', {
        method: 'POST',
        body: { user: { ...userAttributes(formData), password: String(formData.get('password') ?? '') } },
    });
    if (!result.ok) return { errors: result.errors, values: formValues(formData, FIELDS) };

    revalidatePath('/admin/users');
    redirect('/admin/users');
}

export async function updateUser(id: string, _state: FormState, formData: FormData): Promise<FormState> {
    const result = await apiRequest<User>(`/api/v1/admin/users/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: { user: userAttributes(formData) },
    });
    if (!result.ok) return { errors: result.errors, values: formValues(formData, FIELDS) };

    revalidatePath('/admin/users');
    redirect('/admin/users');
}

export async function deleteUser(id: string): Promise<FormState> {
    const result = await apiRequest(`/api/v1/admin/users/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!result.ok) return { errors: result.errors };

    revalidatePath('/admin/users');
    redirect('/admin/users');
}
