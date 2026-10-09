'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { requestPasswordReset } from '@/actions/auth';
import { Field, Input } from '@/components/ui/Field';
import { FormErrors, FormMessage } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';

export function ForgotPasswordForm() {
    const t = useTranslations('auth');
    const [state, formAction] = useActionState(requestPasswordReset, {});

    return (
        <form action={formAction} className="space-y-5">
            <p className="text-sm text-mute">{t('forgot.intro')}</p>
            <FormErrors errors={state.errors} />
            <FormMessage message={state.message} />
            <Field label={t('login.email')} htmlFor="email">
                <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    autoFocus
                    defaultValue={state.values?.email}
                />
            </Field>
            <SubmitButton className="w-full">{t('forgot.submit')}</SubmitButton>
        </form>
    );
}
