import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.forgot');
    return { title: t('title') };
}

export default async function ForgotPasswordPage() {
    const t = await getTranslations('auth.forgot');

    return (
        <>
            <h1 className="mb-8 text-[2.5rem] leading-none font-bold tracking-[-0.02em]">{t('title')}</h1>
            <ForgotPasswordForm />
            <p className="mt-6">
                <Link href="/login" className="text-sm font-semibold text-pass hover:underline">
                    {t('backToLogin')}
                </Link>
            </p>
        </>
    );
}
