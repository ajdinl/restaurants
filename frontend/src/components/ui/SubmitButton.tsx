'use client';

import type { ComponentProps } from 'react';
import { useFormStatus } from 'react-dom';
import { Button } from './Button';

// Disables itself while the surrounding form's server action runs, so double clicks do not submit twice.
export function SubmitButton({ disabled, ...props }: ComponentProps<typeof Button>) {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending || disabled} aria-busy={pending} {...props} />;
}
