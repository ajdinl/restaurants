import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { LocaleSwitcher } from '@/components/layout/LocaleSwitcher';
import { Logo } from '@/components/layout/Logo';
import { ThemeToggle } from '@/components/layout/ThemeToggle';

const CALLS = [
    { table: 5, key: 'call' },
    { table: 12, key: 'bill' },
    { table: 3, key: 'ready' },
] as const;

export default async function AuthLayout({ children }: { children: ReactNode }) {
    const t = await getTranslations();

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
            {/* The pass during service: what the app does, shown rather than described. */}
            <aside className="hidden flex-col justify-between bg-rail p-12 text-white lg:flex">
                <Logo name={t('metadata.title')} />
                <div>
                    <p className="font-display max-w-md text-[2.75rem] leading-[1.05] font-bold tracking-[-0.02em] [font-variation-settings:'wdth'_88]">
                        {t('auth.panel.headline')}
                    </p>
                    <ul aria-hidden className="mt-12 flex gap-4">
                        {CALLS.map(({ table, key }, index) => (
                            <li
                                key={table}
                                className="slip-perforated w-36 animate-hang bg-white px-4 pt-4 pb-6 text-[#13202e]"
                                style={{ animationDelay: `${200 + index * 120}ms` }}
                            >
                                <p className="font-display text-3xl font-bold">{t('auth.panel.table', { table })}</p>
                                <p className="mt-1 text-sm leading-snug text-[#5e6f80]">{t(`auth.panel.${key}`)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
                <p className="text-sm text-rail-text">{t('auth.panel.footer')}</p>
            </aside>

            <div className="flex min-h-screen flex-col">
                <header className="flex items-center justify-between px-6 py-5 sm:px-10">
                    <span className="lg:invisible">
                        <Logo name={t('metadata.title')} />
                    </span>
                    <div className="flex items-center gap-2">
                        <LocaleSwitcher />
                        <ThemeToggle />
                    </div>
                </header>
                <main className="flex flex-1 items-start justify-center px-6 pt-10 pb-20 sm:pt-20 lg:items-center lg:pt-0">
                    <div className="w-full max-w-sm">{children}</div>
                </main>
            </div>
        </div>
    );
}
