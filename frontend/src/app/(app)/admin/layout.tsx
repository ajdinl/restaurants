import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { isPlatformStaff } from '@/lib/permissions';

// Same answer as the API (404), so the admin area does not reveal itself to restaurant staff.
export default async function AdminLayout({ children }: { children: ReactNode }) {
    const user = await getCurrentUser();
    if (!isPlatformStaff(user)) notFound();

    return children;
}
