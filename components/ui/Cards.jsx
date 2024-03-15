import { useRouter } from 'next/navigation'

function Card({ className, category, children }) {
  const router = useRouter()
  const handleRedirect = (query) => {
    if (query) router.push(`/dashboard?view=${query}`)
  }

  return (
    <div
      className={`border border-gray-600 rounded shadow-lg bg-white dark:bg-gray-800 p-4 ${className}`}
      onClick={() => handleRedirect(category)}
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
    <ul
      className={`p-4 w-72 mt-8 min-h-full max-h-96 overflow-y-auto bg-gray-200 dark:bg-gray-600 rounded ${className}`}
    >
      <div className={`flex ${subClassName ? 'flex-col' : 'flex-row'}`}>
        <p className='text-2xl'>{title}</p>
        {title !== 'Menu' && (
          <button
            className='mx-3 -mt-1 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
            onClick={() => openNewModal()}
          >
            +
          </button>
        )}
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
