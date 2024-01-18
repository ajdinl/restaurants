export const Button = ({ type, className, onClick, children }) => {
  return (
    <button
      type={type || 'button'}
      className={`px-4 py-2 rounded-md ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
