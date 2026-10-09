'use client';

import { useActionState } from 'react';
import type { FormState } from '@/lib/form';
import type { ButtonVariant } from './Button';
import { FormErrors } from './FormErrors';
import { SubmitButton } from './SubmitButton';

interface ActionButtonProps {
    action: (state: FormState, formData: FormData) => Promise<FormState>;
    label: string;
    confirm?: string;
    variant?: ButtonVariant;
    className?: string;
}

// A one-click server action (suspend, delete, remove) with optional confirmation and inline API errors.
export function ActionButton({ action, label, confirm, variant = 'secondary', className }: ActionButtonProps) {
    const [state, formAction] = useActionState(action, {});

    return (
        <form
            action={formAction}
            className={className}
            onSubmit={(event) => {
                if (confirm && !window.confirm(confirm)) event.preventDefault();
            }}
        >
            <SubmitButton variant={variant}>{label}</SubmitButton>
            {state.errors && (
                <div className="mt-2">
                    <FormErrors errors={state.errors} />
                </div>
            )}
        </form>
    );
}
