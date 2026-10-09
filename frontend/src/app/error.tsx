'use client';

import * as Sentry from '@sentry/nextjs';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { Button, ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    const t = useTranslations('errors');

    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <div className="flex min-h-[60vh] items-center justify-center px-4">
            <Card className="max-w-lg text-center">
                <h1 className="text-2xl font-semibold">{t('genericTitle')}</h1>
                <p className="mt-2 text-neutral-600 dark:text-neutral-400">{t('unexpected')}</p>
                <div className="mt-6 flex justify-center gap-3">
                    <Button onClick={reset}>{t('tryAgain')}</Button>
                    <ButtonLink variant="secondary" href="/">
                        {t('backHome')}
                    </ButtonLink>
                </div>
            </Card>
        </div>
    );
}
