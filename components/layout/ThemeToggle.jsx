'use client';

import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
    const { isDark, toggleTheme, mounted } = useTheme();

    if (!mounted) return null;

    return (
        <button
            onClick={toggleTheme}
            className="bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-500 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-100 px-4 py-2 text-base rounded absolute right-4 md:right-5 top-12"
        >
            {isDark ? 'Light' : 'Dark'}
        </button>
    );
};
