import { twMerge } from 'tailwind-merge';

// Joins class names and lets later Tailwind classes win (`cn('w-full', 'w-44')` -> 'w-44').
export function cn(...classes: (string | false | null | undefined)[]): string {
    return twMerge(classes.filter(Boolean).join(' '));
}
