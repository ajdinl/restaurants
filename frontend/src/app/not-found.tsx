import { getTranslations } from 'next-intl/server';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default async function NotFound() {
    const t = await getTranslations('errors');

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="max-w-lg text-center">
                <h1 className="text-2xl font-semibold">{t('notFoundTitle')}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{t('notFoundText')}</p>
                <ButtonLink variant="secondary" href="/" className="mt-6">
                    {t('backHome')}
                </ButtonLink>
            </Card>
        </div>
    );
}
