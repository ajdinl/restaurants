import { useRouter } from 'next/navigation';

function Card({ className, category, children }) {
    const router = useRouter();
    const handleRedirect = (query) => {
        if (query) router.push(`/dashboard?view=${query}`);
    };

    return (
        <div
            className={`border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-soft bg-white dark:bg-neutral-800 p-6 hover:shadow-medium transition-all duration-200 ${className}`}
            onClick={() => handleRedirect(category)}
        >
            {children}
        </div>
    );
}

function CardHeader({ children }) {
    return <div className="flex flex-col gap-3">{children}</div>;
}

function CardTitle({ view, children }) {
    return (
        <h2
            className={`font-semibold text-neutral-900 dark:text-neutral-50 ${
                view ? 'text-lg sm:text-2xl mb-2' : 'text-xl'
            }`}
        >
            {children}
        </h2>
    );
}

function CardDescription({ view, children }) {
    return (
        <p className={`text-neutral-600 dark:text-neutral-400 ${view ? 'text-sm sm:text-base mb-2' : 'text-sm'}`}>
            {children}
        </p>
    );
}

function CardContent({ view, children }) {
    return <div className={`mt-4 ${view ? 'text-base' : 'text-sm'} `}>{children}</div>;
}

function CardContentHeader({ title, openNewModal, className, subClassName, children }) {
    return (
        <div
            className={`p-4 w-full min-h-full max-h-96 overflow-y-auto bg-neutral-100 dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 ${className}`}
        >
            <div className={`flex items-center justify-between mb-4 ${subClassName ? 'flex-col gap-2' : 'flex-row'}`}>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50">{title}</h3>
                {title !== 'Menu' && (
                    <button
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md flex-shrink-0"
                        onClick={() => openNewModal()}
                    >
                        +
                    </button>
                )}
            </div>
            <ul className="space-y-2">{children}</ul>
        </div>
    );
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardContentHeader };
