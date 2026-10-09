'use client';

import { useTranslations } from 'next-intl';
import { useActionState, useEffect, useRef, useState } from 'react';
import { removeAvatar, uploadAvatar } from '@/actions/profile';
import { Avatar } from '@/components/ui/Avatar';
import { Button, buttonClasses } from '@/components/ui/Button';
import { FormErrors, FormMessage } from '@/components/ui/FormErrors';
import { SubmitButton } from '@/components/ui/SubmitButton';
import type { FormState } from '@/lib/form';
import type { CurrentUser } from '@/types/api';

const MAX_BYTES = 2 * 1024 * 1024;
const TYPES = ['image/png', 'image/jpeg', 'image/webp'];

export function AvatarForm({ user }: { user: CurrentUser }) {
    const t = useTranslations('profile.avatar');
    const [removeState, removeAction] = useActionState(removeAvatar, {});
    const [preview, setPreview] = useState<string | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [clientError, setClientError] = useState<string | null>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    // After a successful upload the saved photo comes back from the server; drop the local preview.
    const [state, formAction] = useActionState(async (previous: FormState, formData: FormData) => {
        const result = await uploadAvatar(previous, formData);
        if (result.message) {
            setPreview(null);
            setFileName(null);
            formRef.current?.reset();
        }
        return result;
    }, {});

    // Checked here only for quick feedback; the API validates the real file content.
    function onSelect(file: File | undefined) {
        setClientError(null);
        setPreview(null);
        setFileName(file?.name ?? null);
        if (!file) return;
        if (!TYPES.includes(file.type)) return setClientError(t('wrongType'));
        if (file.size > MAX_BYTES) return setClientError(t('tooBig'));
        setPreview(URL.createObjectURL(file));
    }

    const errors = clientError ? [{ field: 'avatar', message: clientError }] : (state.errors ?? removeState.errors);

    return (
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
            <Avatar name={user.full_name} url={preview ?? user.avatar_url} size={112} />
            <div className="min-w-0 flex-1 space-y-4">
                <FormErrors errors={errors} />
                {!preview && <FormMessage message={state.message} />}
                <form ref={formRef} action={formAction} className="space-y-4">
                    {/* The native file input reads "Choose File" in the browser's language; this label replaces it. */}
                    <label className="flex flex-wrap items-center gap-3">
                        <input
                            type="file"
                            name="avatar"
                            accept={TYPES.join(',')}
                            onChange={(event) => onSelect(event.target.files?.[0])}
                            className="peer sr-only"
                        />
                        <span
                            className={buttonClasses(
                                'secondary',
                                'cursor-pointer peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-signal'
                            )}
                        >
                            {t('choose')}
                        </span>
                        {fileName && <span className="truncate text-sm text-mute">{fileName}</span>}
                    </label>
                    <p className="text-xs text-mute">{t('hint')}</p>
                    <div className="flex flex-wrap gap-2">
                        <SubmitButton disabled={!preview}>{t('upload')}</SubmitButton>
                    </div>
                </form>
                {user.avatar_url && !preview && (
                    <form action={removeAction}>
                        <Button type="submit" variant="ghost">
                            {t('remove')}
                        </Button>
                    </form>
                )}
            </div>
        </div>
    );
}
