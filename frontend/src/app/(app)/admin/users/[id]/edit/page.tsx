import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { updateUser } from '@/actions/users';
import { UserForm } from '@/components/admin/UserForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { apiRequest, unwrap } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { canAssignPlatformRole, canEditUser } from '@/lib/permissions';
import type { User } from '@/types/api';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('admin.users');
    return { title: t('editTitle') };
}

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const [currentUser, t, result] = await Promise.all([
        getCurrentUser(),
        getTranslations('admin.users'),
        apiRequest<User>(`/api/v1/admin/users/${encodeURIComponent(id)}`),
    ]);
    const user = unwrap(result);
    if (!canEditUser(currentUser, user)) notFound();

    return (
        <>
            <PageHeader title={t('editTitle')} />
            <UserForm
                action={updateUser.bind(null, user.id)}
                user={user}
                canAssignPlatformRole={canAssignPlatformRole(currentUser, user)}
            />
        </>
    );
}
