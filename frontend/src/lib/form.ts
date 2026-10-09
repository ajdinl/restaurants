import type { ApiError } from '@/types/api';

export interface FormState {
    errors?: ApiError[];
    message?: string;
    // Submitted values, so a form that failed validation keeps what the user typed.
    values?: Record<string, string>;
}

export function formValues(formData: FormData, fields: string[]): Record<string, string> {
    return Object.fromEntries(fields.map((field) => [field, String(formData.get(field) ?? '')]));
}

export function checked(formData: FormData, field: string): boolean {
    return formData.get(field) === 'on';
}
