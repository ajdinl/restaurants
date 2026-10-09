import type { ApiError } from '@/types/api';

export function FormErrors({ errors }: { errors?: ApiError[] }) {
    if (!errors?.length) return null;

    return (
        <div role="alert" className="rounded-control border-l-4 border-stop bg-stop/8 px-4 py-3 text-sm text-ink">
            <ul className="space-y-1">
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
        <div role="status" className="rounded-control border-l-4 border-go bg-go/8 px-4 py-3 text-sm text-ink">
            {message}
        </div>
    );
}
