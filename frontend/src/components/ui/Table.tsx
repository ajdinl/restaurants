import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Table({ className, ...props }: ComponentProps<'table'>) {
    return (
        <div className="overflow-x-auto">
            <table
                className={cn('min-w-full divide-y divide-neutral-200 text-sm dark:divide-neutral-800', className)}
                {...props}
            />
        </div>
    );
}

export function Th({ className, ...props }: ComponentProps<'th'>) {
    return (
        <th
            className={cn('px-4 py-3 text-left font-medium text-neutral-500 dark:text-neutral-400', className)}
            {...props}
        />
    );
}

export function Td({ className, ...props }: ComponentProps<'td'>) {
    return <td className={cn('px-4 py-3 text-neutral-800 dark:text-neutral-200', className)} {...props} />;
}

export function Tbody({ className, ...props }: ComponentProps<'tbody'>) {
    return <tbody className={cn('divide-y divide-neutral-100 dark:divide-neutral-800', className)} {...props} />;
}
