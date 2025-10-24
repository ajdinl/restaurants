export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div
                className={`${sizeClasses[size]} border-neutral-200 dark:border-neutral-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin`}
            ></div>
        </div>
    );
};
