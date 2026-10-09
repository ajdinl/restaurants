import Link from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

// 44px tall: these screens are tapped on tablets during service.
const base =
    'inline-flex min-h-11 items-center justify-center gap-2 rounded-control px-4 text-sm font-semibold ' +
    'transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const variants: Record<ButtonVariant, string> = {
    primary: 'bg-pass text-slip hover:bg-pass-strong',
    secondary: 'border border-line bg-slip text-ink hover:border-mute',
    danger: 'border border-stop/40 bg-slip text-stop hover:bg-stop hover:text-slip',
    ghost: 'text-mute hover:bg-line-soft hover:text-ink',
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
