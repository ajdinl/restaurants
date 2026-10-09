'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { changePassword } from '@/actions/profile';
import { Field, Input } from '@/components/ui/Field';
import { FormErrors, FormMessage } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';

const MIN_PASSWORD_LENGTH = 10;

export function PasswordForm() {
    const t = useTranslations('profile.password');
    const tAuth = useTranslations('auth');
    const [state, formAction] = useActionState(changePassword, {});

    return (
        // Remounting on success clears the three password fields.
        <form key={state.message} action={formAction} className="space-y-5">
            <p className="text-sm text-mute">{t('intro')}</p>
            <FormErrors errors={state.errors} />
            <FormMessage message={state.message} />
            <Field label={t('current')} htmlFor="current_password">
                <Input
                    id="current_password"
                    name="current_password"
                    type="password"
                    required
                    autoComplete="current-password"
                />
            </Field>
            <Field
                label={t('new')}
                htmlFor="password"
                hint={tAuth('minPasswordLength', { count: MIN_PASSWORD_LENGTH })}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                />
            </Field>
            <Field label={t('confirm')} htmlFor="password_confirmation">
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                />
            </Field>
            <SubmitButton>{t('submit')}</SubmitButton>
        </form>
    );
}
