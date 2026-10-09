import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

export default async function AuthLayout({ children }: { children: ReactNode }) {
    const t = await getTranslations('metadata');

    return (
        <div className="flex min-h-screen flex-col">
            <header className="flex items-center justify-between px-6 py-4">
                <span className="text-lg font-bold">{t('title')}</span>
                <div className="flex items-center gap-3">
                    <LocaleSwitcher />
                    <ThemeToggle />
                </div>
            </header>
            <main className="flex flex-1 items-start justify-center px-4 pt-12 pb-24 sm:pt-20">
                <div className="w-full max-w-sm">{children}</div>
            </main>
        </div>
    );
}
