'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { Field, Input, Select } from '@/components/ui/Field';
import { FormErrors } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';
import type { FormState } from '@/lib/form';
import { MEMBERSHIP_ROLES } from '@/types/api';

export function AddMemberForm({ action }: { action: (state: FormState, formData: FormData) => Promise<FormState> }) {
    const t = useTranslations('admin.memberships');
    const tRoles = useTranslations('enums.roles');
    const [state, formAction] = useActionState(action, {});

    return (
        <form action={formAction} className="mt-4 space-y-3 rounded-slip border border-dashed border-line p-5">
            <FormErrors errors={state.errors} />
            <div className="flex flex-wrap items-end gap-3">
                <div className="grow">
                    <Field label={t('email')} htmlFor="member_email">
                        <Input
                            id="member_email"
                            name="email"
                            type="email"
                            required
                            defaultValue={state.values?.email}
                        />
                    </Field>
                </div>
                <Field label={t('role')} htmlFor="member_role">
                    <Select id="member_role" name="role" defaultValue={state.values?.role ?? 'waiter'}>
                        {MEMBERSHIP_ROLES.map((role) => (
                            <option key={role} value={role}>
                                {tRoles(role)}
                            </option>
                        ))}
                    </Select>
                </Field>
                <SubmitButton>{t('add')}</SubmitButton>
            </div>
        </form>
    );
}
