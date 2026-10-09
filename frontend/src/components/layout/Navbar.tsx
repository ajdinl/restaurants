import Link from 'next/link';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { signOut } from '@/actions/auth';
import { isPlatformStaff } from '@/lib/permissions';
import type { CurrentUser } from '@/types/api';
import { LocaleSwitcher } from './LocaleSwitcher';
import { ThemeToggle } from './ThemeToggle';

export async function Navbar({ user }: { user: CurrentUser }) {
    const t = await getTranslations();

    return (
        <header className="border-b border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
                <nav className="flex flex-wrap items-center gap-6 text-sm font-medium">
                    <Link href="/" className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                        {t('metadata.title')}
                    </Link>
                    {isPlatformStaff(user) && (
                        <>
                            <NavLink href="/admin">{t('nav.dashboard')}</NavLink>
                            <NavLink href="/admin/restaurants">{t('nav.restaurants')}</NavLink>
                            <NavLink href="/admin/users">{t('nav.users')}</NavLink>
                        </>
                    )}
                </nav>

                <div className="flex items-center gap-3">
                    <LocaleSwitcher />
                    <ThemeToggle />
                    <span className="hidden text-sm text-neutral-600 sm:inline dark:text-neutral-400">
                        {user.full_name}
                    </span>
                    <form action={signOut}>
                        <button
                            type="submit"
                            className="text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
                        >
                            {t('nav.signOut')}
                        </button>
                    </form>
                </div>
            </div>
        </header>
    );
}

function NavLink({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="text-neutral-600 transition-colors hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-50"
        >
            {children}
        </Link>
    );
}
