export const ErrorMessage = ({ error, className = '' }) => {
    if (!error) return null;

    return (
        <div
            className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 ${className}`}
        >
            <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
    );
};
