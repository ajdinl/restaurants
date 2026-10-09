'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { updateProfile } from '@/actions/profile';
import { Field, Input, Select } from '@/components/ui/Field';
import { FormErrors, FormMessage } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { locales } from '@/i18n/config';
import type { CurrentUser } from '@/types/api';

export function DetailsForm({ user }: { user: CurrentUser }) {
    const t = useTranslations('profile.details');
    const tc = useTranslations('common');
    const tLocale = useTranslations('locale.names');
    const [state, formAction] = useActionState(updateProfile, {});

    return (
        <form action={formAction} className="space-y-5">
            <FormErrors errors={state.errors} />
            <FormMessage message={state.message} />
            <Field label={t('fullName')} htmlFor="full_name">
                <Input
                    id="full_name"
                    name="full_name"
                    required
                    maxLength={120}
                    autoComplete="name"
                    defaultValue={state.values?.full_name ?? user.full_name}
                />
            </Field>
            <Field label={t('email')} htmlFor="email" hint={t('emailHint')}>
                <Input id="email" value={user.email} disabled readOnly className="bg-steel text-mute" />
            </Field>
            <Field label={t('language')} htmlFor="locale">
                <Select id="locale" name="locale" defaultValue={state.values?.locale ?? user.locale ?? ''}>
                    <option value="">{t('languageDefault')}</option>
                    {locales.map((locale) => (
                        <option key={locale} value={locale}>
                            {tLocale(locale)}
                        </option>
                    ))}
                </Select>
            </Field>
            <SubmitButton>{tc('save')}</SubmitButton>
        </form>
    );
}
