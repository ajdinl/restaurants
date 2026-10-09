import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Badge } from '@/components/ui/Badge';
import { RoleBadge } from '@/components/ui/EnumBadges';
import { FormErrors } from '@/components/ui/FormErrors';
import { PageHeader } from '@/components/ui/PageHeader';
import { Ticket, TicketRail } from '@/components/ui/Ticket';
import { apiRequest, unwrap } from '@/lib/api';
import type { WorkspaceDashboard } from '@/types/api';

const SECTIONS = ['menu', 'tables', 'reservations', 'orders', 'kitchen', 'staff'] as const;

type Props = { params: Promise<{ slug: string }> };

function dashboardPath(slug: string): string {
    return `/api/v1/restaurants/${encodeURIComponent(slug)}/dashboard`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const result = await apiRequest<WorkspaceDashboard>(dashboardPath((await params).slug));
    return { title: result.ok ? result.data.restaurant.name : undefined };
}

export default async function WorkspacePage({ params }: Props) {
    const { slug } = await params;
    const [t, tc, result] = await Promise.all([
        getTranslations('workspace'),
        getTranslations('common'),
        apiRequest<WorkspaceDashboard>(dashboardPath(slug)),
    ]);

    // A suspended restaurant answers 403 for its staff; show why instead of a generic error page.
    if (!result.ok && result.status === 403) {
        return <FormErrors errors={[{ field: null, message: t('suspended') }]} />;
    }
    const { restaurant, role } = unwrap(result);

    return (
        <>
            <PageHeader
                title={restaurant.name}
                badge={role ? <RoleBadge role={role} /> : <Badge tone="red">{t('supportView')}</Badge>}
                description={t('intro')}
            />
            <TicketRail label={t('sectionsLabel')}>
                {SECTIONS.map((section, index) => (
                    <Ticket key={section} order={index} title={t(`sections.${section}`)} footer={tc('comingSoon')}>
                        {t(`descriptions.${section}`)}
                    </Ticket>
                ))}
            </TicketRail>
        </>
    );
}
