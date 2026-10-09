import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { signOut } from '@/actions/auth';
import { isPlatformStaff } from '@/lib/permissions';
import type { CurrentUser } from '@/types/api';
import { Avatar } from '@/components/ui/Avatar';
import { LocaleSwitcher } from './LocaleSwitcher';
import { Logo } from './Logo';
import { RailLink } from './RailLink';
import { ThemeToggle } from './ThemeToggle';

// The steel pass: dark in both themes. A column on desktop and tablet landscape, a top bar on phones.
export async function Rail({ user }: { user: CurrentUser }) {
    const t = await getTranslations();

    return (
        <aside className="bg-rail text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col">
            <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-6 lg:py-7">
                <Link href="/" className="rounded-control">
                    <Logo name={t('metadata.title')} />
                </Link>
                <div className="flex items-center gap-1 lg:hidden">
                    <LocaleSwitcher onRail />
                    <ThemeToggle onRail />
                </div>
            </div>

            <nav
                aria-label={t('nav.label')}
                className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3 lg:pb-0"
            >
                {isPlatformStaff(user) ? (
                    <>
                        <RailLink href="/admin" exact>
                            {t('nav.dashboard')}
                        </RailLink>
                        <RailLink href="/admin/restaurants">{t('nav.restaurants')}</RailLink>
                        <RailLink href="/admin/users">{t('nav.users')}</RailLink>
                    </>
                ) : (
                    user.memberships.map(({ id, restaurant }) => (
                        <RailLink key={id} href={`/r/${restaurant.slug}`}>
                            {restaurant.name}
                        </RailLink>
                    ))
                )}
            </nav>

            <div className="hidden border-t border-rail-line px-6 py-5 lg:block">
                <Link
                    href="/profile"
                    title={t('nav.profile')}
                    className="-mx-2 flex items-center gap-3 rounded-control px-2 py-1.5 transition-colors hover:bg-white/5"
                >
                    <Avatar name={user.full_name} url={user.avatar_url} size={36} />
                    <span className="min-w-0">
                        <span className="block truncate text-sm font-semibold">{user.full_name}</span>
                        <span className="block truncate text-xs text-rail-text">{user.email}</span>
                    </span>
                </Link>
                <div className="mt-4 flex items-center justify-between">
                    <LocaleSwitcher onRail />
                    <ThemeToggle onRail />
                </div>
                <form action={signOut} className="mt-3">
                    <button
                        type="submit"
                        className="min-h-11 w-full rounded-control border border-rail-line text-sm font-semibold text-rail-text transition-colors hover:border-rail-text hover:text-white"
                    >
                        {t('nav.signOut')}
                    </button>
                </form>
            </div>

            <div className="flex items-center justify-between gap-4 border-t border-rail-line px-5 py-2 lg:hidden">
                <Link href="/profile" className="flex min-h-11 items-center gap-2.5 text-sm font-semibold">
                    <Avatar name={user.full_name} url={user.avatar_url} size={28} />
                    {t('nav.profile')}
                </Link>
                <form action={signOut}>
                    <button type="submit" className="min-h-11 text-sm font-semibold text-rail-text hover:text-white">
                        {t('nav.signOut')}
                    </button>
                </form>
            </div>
        </aside>
    );
}
