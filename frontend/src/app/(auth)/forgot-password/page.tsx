import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';
import { Card } from '@/components/ui/Card';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.forgot');
    return { title: t('title') };
}

export default async function ForgotPasswordPage() {
    const t = await getTranslations('auth.forgot');

    return (
        <>
            <h1 className="mb-6 text-center text-2xl font-semibold">{t('title')}</h1>
            <Card>
                <ForgotPasswordForm />
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
