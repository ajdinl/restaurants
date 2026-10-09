import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const control =
    'block min-h-11 w-full rounded-control border border-line bg-slip px-3 text-[0.9375rem] text-ink ' +
    'placeholder:text-mute/70 hover:border-mute focus:border-pass focus:outline-none focus:ring-3 focus:ring-signal/25';

export function Field({
    label,
    htmlFor,
    hint,
    children,
}: {
    label: string;
    htmlFor: string;
    hint?: string;
    children: ReactNode;
}) {
    return (
        <div>
            <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1.5 text-xs text-mute">{hint}</p>}
        </div>
    );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
    return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
    return <select className={cn(control, 'pr-8', className)} {...props} />;
}

export function Checkbox({ label, className, ...props }: ComponentProps<'input'> & { label: string }) {
    return (
        <label className={cn('inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-ink', className)}>
            <input type="checkbox" className="size-5 rounded accent-pass" {...props} />
            {label}
        </label>
    );
}
