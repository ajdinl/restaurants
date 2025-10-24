export const Button = ({ type, className, onClick, disabled, children }) => {
    const baseStyles =
        'px-4 py-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center';

    return (
        <button type={type || 'button'} className={`${baseStyles} ${className}`} onClick={onClick} disabled={disabled}>
            {children}
        </button>
    );
};
