import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

// A plain white slip on the steel page. No shadow: hierarchy comes from spacing and type.
export function Card({ className, ...props }: ComponentProps<'div'>) {
    return <div className={cn('rounded-slip border border-line-soft bg-slip p-6', className)} {...props} />;
}
