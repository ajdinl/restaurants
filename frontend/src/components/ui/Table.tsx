import type { ComponentProps } from 'react';
import { cn } from '@/lib/cn';

export function Table({ className, ...props }: ComponentProps<'table'>) {
    return (
        <div className="overflow-x-auto rounded-slip border border-line-soft bg-slip">
            <table className={cn('min-w-full text-sm', className)} {...props} />
        </div>
    );
}

export function Th({ className, ...props }: ComponentProps<'th'>) {
    return (
        <th
            className={cn('border-b border-line-soft px-5 py-3 text-left text-xs font-semibold text-mute', className)}
            {...props}
        />
    );
}

export function Td({ className, ...props }: ComponentProps<'td'>) {
    return <td className={cn('px-5 py-3.5 align-middle', className)} {...props} />;
}

export function Tbody({ className, ...props }: ComponentProps<'tbody'>) {
    return <tbody className={cn('divide-y divide-line-soft', className)} {...props} />;
}
