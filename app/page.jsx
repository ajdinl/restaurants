import AuthForm from '@/components/AuthForm';

export default function Home() {
    return (
        <main className="flex items-center justify-center bg-gradient-to-br from-primary-50 via-neutral-50 to-primary-100 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 min-h-screen p-4">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-medium border border-neutral-200 dark:border-neutral-700 p-8 md:p-10 w-full max-w-md">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 bg-primary-600 dark:bg-primary-500 rounded-xl flex items-center justify-center mb-4 shadow-sm">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                        </svg>
                    </div>
                    <h1 className="text-neutral-900 dark:text-neutral-50 text-3xl font-bold mb-2 text-center">
                        Restaurant Pro
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 text-center">
                        Professional restaurant management platform
                    </p>
                </div>
                <AuthForm />
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                    <p className="text-center text-sm text-neutral-500 dark:text-neutral-400">
                        Manage menus, orders, tables, and reservations with ease
                    </p>
                </div>
            </div>
        </main>
    );
}
