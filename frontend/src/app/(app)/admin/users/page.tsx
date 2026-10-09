import { getTranslations } from 'next-intl/server';
import { deleteUser } from '@/actions/users';
import { ActionButton } from '@/components/ui/ActionButton';
import { Badge } from '@/components/ui/Badge';
import { ButtonLink } from '@/components/ui/Button';
import { PlatformRoleBadge } from '@/components/ui/EnumBadges';
import { PageHeader } from '@/components/ui/PageHeader';
import { Pagination } from '@/components/ui/Pagination';
import { Table, Tbody, Td, Th } from '@/components/ui/Table';
import { apiRequest, unwrapPage } from '@/lib/api';
import { getCurrentUser } from '@/lib/auth';
import { canDeleteUser, canEditUser } from '@/lib/permissions';
import { pageParam } from '@/lib/search-params';
import type { User } from '@/types/api';

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
    const page = pageParam((await searchParams).page);
    const [currentUser, t, tc, result] = await Promise.all([
        getCurrentUser(),
        getTranslations('admin.users'),
        getTranslations('common'),
        apiRequest<User[]>(`/api/v1/admin/users?page=${page}`),
    ]);
    const { data: users, meta } = unwrapPage(result);

    return (
        <>
            <PageHeader title={t('title')} actions={<ButtonLink href="/admin/users/new">{t('new')}</ButtonLink>} />
            <Table>
                <thead>
                    <tr>
                        <Th>{t('fields.fullName')}</Th>
                        <Th>{t('fields.email')}</Th>
                        <Th>{t('fields.platformRole')}</Th>
                        <Th />
                    </tr>
                </thead>
                <Tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <Td className="font-medium">
                                <span className="mr-2">{user.full_name}</span>
                                {user.locked && <Badge tone="red">{t('locked')}</Badge>}
                            </Td>
                            <Td>{user.email}</Td>
                            <Td>{user.platform_role && <PlatformRoleBadge role={user.platform_role} />}</Td>
                            <Td>
                                <div className="flex items-center justify-end gap-2">
                                    {canEditUser(currentUser, user) && (
                                        <ButtonLink variant="ghost" href={`/admin/users/${user.id}/edit`}>
                                            {tc('edit')}
                                        </ButtonLink>
                                    )}
                                    {canDeleteUser(currentUser, user) && (
                                        <ActionButton
                                            action={deleteUser.bind(null, user.id)}
                                            label={tc('delete')}
                                            confirm={t('deleteConfirm')}
                                            variant="ghost"
                                        />
                                    )}
                                </div>
                            </Td>
                        </tr>
                    ))}
                </Tbody>
            </Table>
            {users.length === 0 && (
                <p className="mt-4 rounded-slip border border-dashed border-line px-6 py-8 text-mute">{t('empty')}</p>
            )}
            <Pagination meta={meta} basePath="/admin/users" />
        </>
    );
}
