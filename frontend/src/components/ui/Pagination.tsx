import { useTranslations } from 'next-intl';
import type { PageMeta } from '@/types/api';
import { ButtonLink } from './Button';

export function Pagination({ meta, basePath }: { meta?: PageMeta; basePath: string }) {
    const t = useTranslations('pagination');
    if (!meta || meta.total_pages <= 1) return null;

    return (
        <nav className="mt-4 flex items-center justify-between gap-4 text-sm text-mute">
            <span>{t('page', { page: meta.page, total: meta.total_pages })}</span>
            <div className="flex gap-2">
                {meta.page > 1 && (
                    <ButtonLink variant="secondary" href={`${basePath}?page=${meta.page - 1}`}>
                        {t('previous')}
                    </ButtonLink>
                )}
                {meta.page < meta.total_pages && (
                    <ButtonLink variant="secondary" href={`${basePath}?page=${meta.page + 1}`}>
                        {t('next')}
                    </ButtonLink>
                )}
            </div>
        </nav>
    );
}
