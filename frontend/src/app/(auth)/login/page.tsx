import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/auth/LoginForm';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('auth.login');
    return { title: t('title') };
}

export default async function LoginPage() {
    const t = await getTranslations('auth.login');

    return (
        <>
            <h1 className="mb-8 text-[2.5rem] leading-none font-bold tracking-[-0.02em]">{t('title')}</h1>
            <LoginForm />
        </>
    );
}
