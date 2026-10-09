'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { signIn } from '@/actions/auth';
import { Field, Input } from '@/components/ui/Field';
import { FormErrors } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';

export function LoginForm() {
    const t = useTranslations('auth.login');
    const [state, formAction] = useActionState(signIn, {});

    return (
        <form action={formAction} className="space-y-5">
            <FormErrors errors={state.errors} />
            <Field label={t('email')} htmlFor="email">
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
            <Field label={t('password')} htmlFor="password">
                <Input id="password" name="password" type="password" required autoComplete="current-password" />
            </Field>
            <SubmitButton className="w-full">{t('submit')}</SubmitButton>
            <p className="text-center">
                <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-primary-700 hover:underline dark:text-primary-400"
                >
                    {t('forgot')}
                </Link>
            </p>
        </form>
    );
}
