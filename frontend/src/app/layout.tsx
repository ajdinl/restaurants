import type { Metadata } from 'next';
import { Bricolage_Grotesque, Instrument_Sans } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import './globals.css';

const display = Bricolage_Grotesque({
    subsets: ['latin', 'latin-ext'],
    axes: ['opsz', 'wdth'],
    variable: '--font-bricolage',
});

const sans = Instrument_Sans({
    subsets: ['latin', 'latin-ext'],
    axes: ['wdth'],
    variable: '--font-instrument',
});

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('metadata');
    return { title: { default: t('title'), template: `%s · ${t('title')}` }, description: t('description') };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale();

    return (
        // next-themes sets the class before hydration, which React would otherwise flag.
        <html lang={locale} className={`${display.variable} ${sans.variable}`} suppressHydrationWarning>
            <body className="min-h-screen">
                <NextIntlClientProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
