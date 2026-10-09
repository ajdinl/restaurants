import Image from 'next/image';
import { cn } from '@/lib/cn';

function initials(name: string): string {
    const parts = name.trim().split(/\s+/);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? (parts.at(-1)?.[0] ?? '') : '')).toUpperCase();
}

export function Avatar({
    name,
    url,
    size = 40,
    className,
}: {
    name: string;
    url: string | null;
    size?: number;
    className?: string;
}) {
    const style = { width: size, height: size };

    if (url) {
        return (
            // Served by the API (or its storage), already size-limited; no Next.js image optimisation needed.
            <Image
                src={url}
                alt=""
                width={size}
                height={size}
                unoptimized
                className={cn('shrink-0 rounded-full object-cover', className)}
                style={style}
            />
        );
    }

    return (
        <span
            aria-hidden
            className={cn(
                'inline-flex shrink-0 items-center justify-center rounded-full bg-signal font-display font-bold text-[#13202e]',
                className
            )}
            style={{ ...style, fontSize: size * 0.38 }}
        >
            {initials(name)}
        </span>
    );
}
