import type messages from '../messages/bs.json';
import type { Locale } from '@/types/api';

// Typed translation keys: a typo in t('...') fails the type check.
declare module 'next-intl' {
    interface AppConfig {
        Locale: Locale;
        Messages: typeof messages;
    }
}
