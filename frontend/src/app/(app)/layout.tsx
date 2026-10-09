import type { ReactNode } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { getCurrentUser } from '@/lib/auth';

export default async function AppLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser();

    return (
        <>
            <Navbar user={user} />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">{children}</main>
        </>
    );
}
