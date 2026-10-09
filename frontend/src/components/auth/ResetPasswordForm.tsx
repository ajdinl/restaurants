'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { resetPassword } from '@/actions/auth';
import { Field, Input } from '@/components/ui/Field';
import { FormErrors, FormMessage } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';

const MIN_PASSWORD_LENGTH = 10;

export function ResetPasswordForm({ token }: { token: string }) {
    const t = useTranslations('auth');
    const [state, formAction] = useActionState(resetPassword, {});

    if (state.message) return <FormMessage message={state.message} />;

    return (
        <form action={formAction} className="space-y-5">
            <FormErrors errors={state.errors} />
            <input type="hidden" name="token" value={token} />
            <Field
                label={t('reset.password')}
                htmlFor="password"
                hint={t('minPasswordLength', { count: MIN_PASSWORD_LENGTH })}
            >
                <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                    autoFocus
                />
            </Field>
            <Field label={t('reset.passwordConfirmation')} htmlFor="password_confirmation">
                <Input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    autoComplete="new-password"
                />
            </Field>
            <SubmitButton className="w-full">{t('reset.submit')}</SubmitButton>
        </form>
    );
}
