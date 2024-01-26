function Card({ className, children }) {
  return (
    <div
      className={`border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4 ${className}`}
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
        view ? 'text-4xl mb-2' : 'text-xl'
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
        view ? 'text-2xl mb-2' : 'text-md'
      }`}
    >
      {children}
    </p>
  )
}

function CardContent({ view, children }) {
  return (
    <div className={`mt-4 ${view ? 'text-2xl' : 'text-md'}`}>{children}</div>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
