import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';

// Tickets on the steel rail of the pass. Every ticket carries its own piece of rail reaching halfway
// into the gap, so each wrapped row gets one continuous rail that ends where the row ends.
export function TicketRail({ children, label }: { children: ReactNode; label: string }) {
    return (
        <section aria-label={label}>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-[repeat(auto-fill,minmax(11.5rem,1fr))]">
                {children}
            </ul>
        </section>
    );
}

const steel = 'bg-linear-to-b from-[#a9b8c7] to-[#617385] dark:from-[#3d4f63] dark:to-[#202e3d]';

export function Ticket({
    title,
    footer,
    order = 0,
    href,
    children,
}: {
    title: string;
    footer: ReactNode;
    // Position on the rail; staggers the hang-in so tickets land one after another.
    order?: number;
    // Makes the whole ticket a link, e.g. to open a restaurant.
    href?: string;
    children?: ReactNode;
}) {
    const style = { animationDelay: `${order * 70}ms` } as CSSProperties;
    const slip =
        'slip-perforated mt-2 flex min-h-44 flex-col border-x border-t border-line-soft bg-slip px-4 pt-6 pb-7 sm:min-h-52 sm:px-5';
    const content = (
        <>
            <h2 className="text-[1.3rem] leading-tight font-bold tracking-[-0.01em] sm:text-[1.6rem]">{title}</h2>
            {children && <div className="mt-2 text-sm leading-snug text-mute">{children}</div>}
            <div className="mt-auto border-t border-dashed border-line pt-3 text-xs font-semibold text-mute">
                {footer}
            </div>
        </>
    );

    return (
        <li className="relative pt-1">
            <span
                aria-hidden
                className={`absolute -inset-x-2 top-0 h-2.5 shadow-[inset_0_1px_0_rgb(255_255_255/0.5)] ${steel}`}
            />
            <div className="relative animate-hang" style={style}>
                {/* The clip that holds the ticket on the rail. */}
                <span
                    aria-hidden
                    className={`absolute -top-1.5 left-1/2 z-10 h-4 w-9 -translate-x-1/2 rounded-[3px] shadow-sm ${steel}`}
                />
                {href ? (
                    <Link href={href} className={`${slip} transition-transform hover:translate-y-0.5`}>
                        {content}
                    </Link>
                ) : (
                    <article className={slip}>{content}</article>
                )}
            </div>
        </li>
    );
}
