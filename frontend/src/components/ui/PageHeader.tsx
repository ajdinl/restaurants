import type { ReactNode } from 'react';

export function PageHeader({ title, badge, actions }: { title: string; badge?: ReactNode; actions?: ReactNode }) {
    return (
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">{title}</h1>
                {badge}
            </div>
            {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </div>
    );
}
