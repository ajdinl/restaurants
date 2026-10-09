import { useTranslations } from 'next-intl';
import type { MembershipRole, PlatformRole, RestaurantStatus } from '@/types/api';
import { Badge } from './Badge';

export function StatusBadge({ status }: { status: RestaurantStatus }) {
    const t = useTranslations('enums.statuses');
    return <Badge tone={status === 'active' ? 'green' : 'red'}>{t(status)}</Badge>;
}

export function RoleBadge({ role }: { role: MembershipRole }) {
    const t = useTranslations('enums.roles');
    return <Badge tone="blue">{t(role)}</Badge>;
}

export function PlatformRoleBadge({ role }: { role: PlatformRole }) {
    const t = useTranslations('enums.platformRoles');
    return <Badge tone="blue">{t(role)}</Badge>;
}
