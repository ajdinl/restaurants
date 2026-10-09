import type { Locale } from '@/types/api';

export const locales: Locale[] = ['bs', 'en'];
export const defaultLocale: Locale = 'bs';
export const LOCALE_COOKIE = 'NEXT_LOCALE';

// Croatian and Serbian browsers read Bosnian without trouble.
const aliases: Record<string, Locale> = { hr: 'bs', sr: 'bs', sh: 'bs' };

export function isLocale(value: unknown): value is Locale {
    return typeof value === 'string' && (locales as string[]).includes(value);
}

export function localeFromAcceptLanguage(header: string | null): Locale | undefined {
    if (!header) return undefined;

    for (const part of header.split(',')) {
        const code = part.split(';')[0].trim().split('-')[0].toLowerCase();
        const locale = aliases[code] ?? code;
        if (isLocale(locale)) return locale;
    }
    return undefined;
}
