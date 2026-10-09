'use server';

import { revalidatePath } from 'next/cache';
import { apiRequest } from '@/lib/api';
import type { FormState } from '@/lib/form';
import { checked, formValues } from '@/lib/form';
import type { Membership } from '@/types/api';

function membershipsPath(slug: string): string {
    return `/api/v1/admin/restaurants/${encodeURIComponent(slug)}/memberships`;
}

export async function addMember(slug: string, _state: FormState, formData: FormData): Promise<FormState> {
    const values = formValues(formData, ['email', 'role']);
    const result = await apiRequest<Membership>(membershipsPath(slug), {
        method: 'POST',
        body: { membership: values },
    });
    if (!result.ok) return { errors: result.errors, values };

    revalidatePath(`/admin/restaurants/${slug}`);
    return {};
}

export async function updateMember(
    slug: string,
    id: string,
    _state: FormState,
    formData: FormData
): Promise<FormState> {
    const result = await apiRequest<Membership>(`${membershipsPath(slug)}/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: { membership: { role: String(formData.get('role') ?? ''), active: checked(formData, 'active') } },
    });
    if (!result.ok) return { errors: result.errors };

    revalidatePath(`/admin/restaurants/${slug}`);
    return {};
}

export async function removeMember(slug: string, id: string): Promise<FormState> {
    const result = await apiRequest(`${membershipsPath(slug)}/${encodeURIComponent(id)}`, { method: 'DELETE' });
    if (!result.ok) return { errors: result.errors };

    revalidatePath(`/admin/restaurants/${slug}`);
    return {};
}
