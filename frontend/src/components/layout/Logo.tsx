import { cn } from '@/lib/cn';

// An order slip with a torn edge: the thing every restaurant runs on.
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg viewBox="0 0 24 28" aria-hidden className={cn('h-7 w-6', className)}>
            <path d="M3 2h18v21l-3 3-3-3-3 3-3-3-3 3-3-3z" fill="currentColor" className="text-signal" />
            <path d="M7 8h10M7 12h10M7 16h6" stroke="#13202e" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
    );
}

export function Logo({ name, className }: { name: string; className?: string }) {
    return (
        <span className={cn('inline-flex items-center gap-2.5', className)}>
            <LogoMark />
            <span className="font-display text-lg leading-none font-bold tracking-[-0.01em]">{name}</span>
        </span>
    );
}
