import { useLocale, useTranslations } from 'next-intl';
import { setLocale } from '@/actions/locale';
import { locales } from '@/i18n/config';
import { cn } from '@/lib/cn';

export function LocaleSwitcher() {
    const t = useTranslations('locale');
    const current = useLocale();

    return (
        <div className="flex items-center gap-1 text-xs" role="group" aria-label={t('label')}>
            {locales.map((locale) => (
                <form key={locale} action={setLocale.bind(null, locale)}>
                    <button
                        type="submit"
                        title={t(`names.${locale}`)}
                        aria-pressed={locale === current}
                        className={cn(
                            'rounded px-2 py-1 font-medium',
                            locale === current
                                ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                                : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
                        )}
                    >
                        {t(locale)}
                    </button>
                </form>
            ))}
        </div>
    );
}
