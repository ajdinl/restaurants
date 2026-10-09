import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

const base =
    'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-900 ' +
    'disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary-600 text-white shadow-soft hover:bg-primary-700 focus-visible:ring-primary-500',
    secondary:
        'border border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50 focus-visible:ring-neutral-400 ' +
        'dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-700',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500',
    ghost: 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white',
};

export function buttonClasses(variant: ButtonVariant = 'primary', className?: string): string {
    return cn(base, variants[variant], className);
}

export function Button({
    variant = 'primary',
    className,
    type = 'button',
    ...props
}: ComponentProps<'button'> & { variant?: ButtonVariant }) {
    return <button type={type} className={buttonClasses(variant, className)} {...props} />;
}

export function ButtonLink({
    variant = 'primary',
    className,
    ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
    return <Link className={buttonClasses(variant, className)} {...props} />;
}
