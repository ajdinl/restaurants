import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

const control =
    'block w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm ' +
    'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/30 ' +
    'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100';

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
            <label htmlFor={htmlFor} className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                {label}
            </label>
            {children}
            {hint && <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">{hint}</p>}
        </div>
    );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
    return <input className={cn(control, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
    return <select className={cn(control, className)} {...props} />;
}

export function Checkbox({ label, className, ...props }: ComponentProps<'input'> & { label: string }) {
    return (
        <label
            className={cn('inline-flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300', className)}
        >
            <input
                type="checkbox"
                className="size-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500 dark:border-neutral-600"
                {...props}
            />
            {label}
        </label>
    );
}
