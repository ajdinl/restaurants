'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

// Exact match for section roots (/admin), prefix match for everything else (/admin/restaurants/...).
export function RailLink({ href, exact = false, children }: { href: string; exact?: boolean; children: ReactNode }) {
    const pathname = usePathname();
    const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

    return (
        <Link
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
                'relative flex min-h-11 shrink-0 items-center rounded-control px-3 text-sm font-medium transition-colors',
                active ? 'bg-white/8 text-white' : 'text-rail-text hover:bg-white/5 hover:text-white',
                // The signal-blue marker is the "you are here" cue, like the active ticket on the rail.
                'before:absolute before:inset-y-2 before:left-0 before:w-[3px] before:rounded-full',
                active ? 'before:bg-signal' : 'before:bg-transparent'
            )}
        >
            {children}
        </Link>
    );
}
