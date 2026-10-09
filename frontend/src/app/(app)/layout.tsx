import type { ReactNode } from 'react';
import { Rail } from '@/components/layout/Rail';
import { getCurrentUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser();

    return (
        <div className="min-h-screen lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
            <Rail user={user} />
            <main className="px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
                <div className="mx-auto max-w-5xl lg:mx-0">{children}</div>
            </main>
        </div>
    );
}
