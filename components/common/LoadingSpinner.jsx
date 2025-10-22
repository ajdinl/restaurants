export const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className={`flex justify-center items-center ${className}`}>
            <div className={`${sizeClasses[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`}></div>
        </div>
    );
};
