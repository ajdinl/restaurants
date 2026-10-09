'use client';

import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/cn';

export function ThemeToggle({ onRail = false }: { onRail?: boolean }) {
    const t = useTranslations('theme');
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <button
            type="button"
            onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
            className={cn(
                'inline-flex size-11 items-center justify-center rounded-control transition-colors',
                onRail
                    ? 'text-rail-text hover:bg-white/8 hover:text-white'
                    : 'text-mute hover:bg-line-soft hover:text-ink'
            )}
            aria-label={t('toggle')}
            title={t('toggle')}
        >
            {/* Both icons render; CSS shows the right one, so server and client markup match. */}
            <svg className="size-5 dark:hidden" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
            <svg
                className="hidden size-5 dark:block"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
            >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
            </svg>
        </button>
    );
}
