function Card({ className, children }) {
  return (
    <div
      className={`border rounded shadow-lg bg-white dark:bg-gray-800 p-4 ${className}`}
    >
      {children}
    </div>
  )
}

function CardHeader({ children }) {
  return <div className='flex flex-col gap-2'>{children}</div>
}

function CardTitle({ view, children }) {
  return (
    <h2
      className={`font-bold text-gray-800 dark:text-white ${
        view ? 'text-base sm:text-2xl mb-2' : 'text-xl'
      }`}
    >
      {children}
    </h2>
  )
}

function CardDescription({ view, children }) {
  return (
    <p
      className={`text-gray-600 dark:text-gray-400 ${
        view ? 'text-sm sm:text-xl mb-2' : 'text-md'
      }`}
    >
      {children}
    </p>
  )
}

function CardContent({ view, children }) {
  return (
    <div className={`mt-4 ${view ? 'text-base sm:text-xl' : 'text-md'} `}>
      {children}
    </div>
  )
}

function CardContentHeader({
  title,
  openNewModal,
  className,
  subClassName,
  children,
}) {
  return (
    <ul className={`md:border-l-2 border-gray-600 p-4 w-60 ${className}`}>
      <div className={`flex ${subClassName ? 'flex-col' : 'flex-row'}`}>
        <p className='text-2xl'>{title}</p>
        <button
          className='mx-3 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
          onClick={() => openNewModal}
        >
          +
        </button>
      </div>
      {children}
    </ul>
  )
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardContentHeader,
}
