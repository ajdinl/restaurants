import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { getTranslations } from 'next-intl/server';
import { AvatarForm } from '@/components/profile/AvatarForm';
import { DetailsForm } from '@/components/profile/DetailsForm';
import { PasswordForm } from '@/components/profile/PasswordForm';
import { PageHeader } from '@/components/ui/PageHeader';
import { getCurrentUser } from '@/lib/auth';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('profile');
    return { title: t('title') };
}

export default async function ProfilePage() {
    const [user, t] = await Promise.all([getCurrentUser(), getTranslations('profile')]);

    return (
        <>
            <PageHeader title={t('title')} description={t('description')} />
            <div className="max-w-3xl divide-y divide-line-soft rounded-slip border border-line-soft bg-slip">
                <Section title={t('avatar.title')}>
                    <AvatarForm user={user} />
                </Section>
                <Section title={t('details.title')}>
                    <DetailsForm user={user} />
                </Section>
                <Section title={t('password.title')}>
                    <PasswordForm />
                </Section>
            </div>
        </>
    );
}

// Heading on the left, form on the right on wide screens; stacked on phones.
function Section({ title, children }: { title: string; children: ReactNode }) {
    return (
        <section className="grid gap-4 p-6 sm:p-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-8">
            <h2 className="text-xl font-bold tracking-[-0.01em]">{title}</h2>
            <div className="max-w-md">{children}</div>
        </section>
    );
}
