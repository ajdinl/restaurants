import type { ReactNode } from 'react';

export function PageHeader({
    title,
    badge,
    actions,
    description,
}: {
    title: string;
    badge?: ReactNode;
    actions?: ReactNode;
    description?: string;
}) {
    return (
        <header className="mb-8 flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-[2.25rem] leading-[1.05] font-bold tracking-[-0.02em] sm:text-[2.75rem]">
                        {title}
                    </h1>
                    {badge}
                </div>
                {description && <p className="mt-2 max-w-prose text-mute">{description}</p>}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
    );
}
