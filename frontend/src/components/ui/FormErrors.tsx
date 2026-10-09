import type { ApiError } from '@/types/api';

export function FormErrors({ errors }: { errors?: ApiError[] }) {
    if (!errors?.length) return null;

    return (
        <div
            role="alert"
            className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-300"
        >
            <ul className="list-inside list-disc space-y-1">
                {errors.map((error, index) => (
                    <li key={`${error.field}-${index}`}>{error.message}</li>
                ))}
            </ul>
        </div>
    );
}

export function FormMessage({ message }: { message?: string }) {
    if (!message) return null;

    return (
        <div
            role="status"
            className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300"
        >
            {message}
        </div>
    );
}
