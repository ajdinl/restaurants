import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createUser } from '@/actions/users';
import { UserForm } from '@/components/admin/UserForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCurrentUser } from '@/lib/auth';
import { canAssignPlatformRole } from '@/lib/permissions';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('admin.users');
    return { title: t('newTitle') };
}

export default async function NewUserPage() {
    const [user, t] = await Promise.all([getCurrentUser(), getTranslations('admin.users')]);

    return (
        <>
            <PageHeader title={t('newTitle')} />
            <UserForm action={createUser} canAssignPlatformRole={canAssignPlatformRole(user)} />
        </>
    );
}
