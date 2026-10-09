import type { Metadata } from 'next';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';
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
            <h1 className="mb-8 text-[2.5rem] leading-none font-bold tracking-[-0.02em]">{t('title')}</h1>
            {token ? (
                <ResetPasswordForm token={token} />
            ) : (
                <FormErrors errors={[{ field: null, message: t('missingToken') }]} />
            )}
            <p className="mt-6">
                <Link href="/login" className="text-sm font-semibold text-pass hover:underline">
                    {t('backToLogin')}
                </Link>
            </p>
        </>
    );
}
