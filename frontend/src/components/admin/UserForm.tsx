'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Field, Input, Select } from '@/components/ui/Field';
import { FormErrors } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { locales } from '@/i18n/config';
import type { FormState } from '@/lib/form';
import { PLATFORM_ROLES, type User } from '@/types/api';

const MIN_PASSWORD_LENGTH = 10;

interface UserFormProps {
    action: (state: FormState, formData: FormData) => Promise<FormState>;
    user?: User;
    canAssignPlatformRole: boolean;
}

export function UserForm({ action, user, canAssignPlatformRole }: UserFormProps) {
    const t = useTranslations('admin.users');
    const tc = useTranslations('common');
    const tAuth = useTranslations('auth');
    const tLocale = useTranslations('locale.names');
    const tRoles = useTranslations('enums.platformRoles');
    const [state, formAction] = useActionState(action, {});
    const value = (field: keyof User) => state.values?.[field] ?? String(user?.[field] ?? '');

    return (
        <Card>
            <form action={formAction} className="space-y-5">
                <FormErrors errors={state.errors} />

                <div className="grid gap-5 sm:grid-cols-2">
                    <Field label={t('fields.fullName')} htmlFor="full_name">
                        <Input
                            id="full_name"
                            name="full_name"
                            required
                            maxLength={120}
                            defaultValue={value('full_name')}
                            autoFocus
                        />
                    </Field>
                    <Field label={t('fields.email')} htmlFor="email">
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="off"
                            defaultValue={value('email')}
                        />
                    </Field>
                    {!user && (
                        <Field
                            label={t('fields.password')}
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
                    )}
                    <Field label={t('fields.locale')} htmlFor="locale">
                        <Select id="locale" name="locale" defaultValue={value('locale')}>
                            <option value="">{t('defaultLocale')}</option>
                            {locales.map((locale) => (
                                <option key={locale} value={locale}>
                                    {tLocale(locale)}
                                </option>
                            ))}
                        </Select>
                    </Field>
                    {canAssignPlatformRole && (
                        <Field label={t('fields.platformRole')} htmlFor="platform_role">
                            <Select id="platform_role" name="platform_role" defaultValue={value('platform_role')}>
                                <option value="">{t('noPlatformRole')}</option>
                                {PLATFORM_ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {tRoles(role)}
                                    </option>
                                ))}
                            </Select>
                        </Field>
                    )}
                </div>

                <div className="flex gap-3">
                    <SubmitButton>{tc('save')}</SubmitButton>
                    <ButtonLink variant="secondary" href="/admin/users">
                        {tc('cancel')}
                    </ButtonLink>
                </div>
            </form>
        </Card>
    );
}
