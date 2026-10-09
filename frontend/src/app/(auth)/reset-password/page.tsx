import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
import { Card } from '@/components/ui/Card';
import { FormErrors } from '@/components/ui/FormErrors';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.reset');
    return { title: t('title') };
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
    const { token } = await searchParams;
    const t = await getTranslations('auth.reset');

    return (
        <>
            <h1 className="mb-6 text-center text-2xl font-semibold">{t('title')}</h1>
            <Card>
                {token ? (
                    <ResetPasswordForm token={token} />
                ) : (
                    <FormErrors errors={[{ field: null, message: t('missingToken') }]} />
                )}
            </Card>
            <p className="mt-4 text-center">
                <Link
                    href="/login"
                    className="text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
                >
                    {t('backToLogin')}
                </Link>
            </p>
        </>
    );
}
