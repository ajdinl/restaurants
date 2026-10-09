import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getTranslations } from 'next-intl/server';
import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/layout/ThemeProvider';
import './globals.css';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('metadata');
    return { title: { default: t('title'), template: `%s · ${t('title')}` }, description: t('description') };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
    const locale = await getLocale();

    return (
        // next-themes sets the class before hydration, which React would otherwise flag.
        <html lang={locale} suppressHydrationWarning>
            <body className="min-h-screen">
                <NextIntlClientProvider>
                    <ThemeProvider>{children}</ThemeProvider>
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
