'use client';

import { useTranslations } from 'next-intl';
import { useActionState } from 'react';
import { ActionButton } from '@/components/ui/ActionButton';
import { Checkbox, Select } from '@/components/ui/Field';
import { FormErrors } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';
import { Td } from '@/components/ui/Table';
import type { FormState } from '@/lib/form';
import { MEMBERSHIP_ROLES, type Membership } from '@/types/api';

interface MembershipRowProps {
    membership: Membership;
    updateAction: (state: FormState, formData: FormData) => Promise<FormState>;
    removeAction: (state: FormState, formData: FormData) => Promise<FormState>;
}

export function MembershipRow({ membership, updateAction, removeAction }: MembershipRowProps) {
    const t = useTranslations('admin.memberships');
    const tc = useTranslations('common');
    const tRoles = useTranslations('enums.roles');
    const [state, formAction] = useActionState(updateAction, {});

    return (
        <tr>
            <Td>
                <p className="font-medium">{membership.user.full_name}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{membership.user.email}</p>
            </Td>
            <Td>
                <form action={formAction} className="flex flex-wrap items-center gap-3">
                    <Select name="role" defaultValue={membership.role} aria-label={t('role')} className="w-44">
                        {MEMBERSHIP_ROLES.map((role) => (
                            <option key={role} value={role}>
                                {tRoles(role)}
                            </option>
                        ))}
                    </Select>
                    <Checkbox name="active" label={t('active')} defaultChecked={membership.active} />
                    <SubmitButton variant="ghost">{tc('save')}</SubmitButton>
                </form>
                <FormErrors errors={state.errors} />
            </Td>
            <Td className="text-right">
                <ActionButton action={removeAction} label={t('remove')} confirm={t('removeConfirm')} variant="ghost" />
            </Td>
        </tr>
    );
}
