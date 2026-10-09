import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type BadgeTone = 'green' | 'red' | 'gray' | 'blue';

const tones: Record<BadgeTone, string> = {
    green: 'text-go',
    red: 'text-hold',
    gray: 'text-mute',
    blue: 'text-pass',
};

// A status dot and a word: readable at a glance without a coloured block competing with the content.
export function Badge({ tone = 'gray', children }: { tone?: BadgeTone; children: ReactNode }) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border border-current/25 px-2.5 py-0.5 text-xs font-semibold',
                tones[tone]
            )}
        >
            <span aria-hidden className="size-1.5 rounded-full bg-current" />
            {children}
        </span>
    );
}
