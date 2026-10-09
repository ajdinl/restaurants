import { useLocale, useTranslations } from 'next-intl';
import { setLocale } from '@/actions/locale';
import { locales } from '@/i18n/config';
import { cn } from '@/lib/cn';

export function LocaleSwitcher({ onRail = false }: { onRail?: boolean }) {
    const t = useTranslations('locale');
    const current = useLocale();

    return (
        <div
            className={cn(
                'flex items-center rounded-control border p-0.5 text-xs',
                onRail ? 'border-rail-line' : 'border-line'
            )}
            role="group"
            aria-label={t('label')}
        >
            {locales.map((locale) => (
                <form key={locale} action={setLocale.bind(null, locale)}>
                    <button
                        type="submit"
                        title={t(`names.${locale}`)}
                        aria-pressed={locale === current}
                        className={cn(
                            'min-h-9 min-w-10 rounded-[0.375rem] px-2 font-semibold transition-colors',
                            locale === current
                                ? onRail
                                    ? 'bg-white/12 text-white'
                                    : 'bg-ink text-steel'
                                : onRail
                                  ? 'text-rail-text hover:text-white'
                                  : 'text-mute hover:text-ink'
                        )}
                    >
                        {t(locale)}
                    </button>
                </form>
            ))}
        </div>
    );
}
