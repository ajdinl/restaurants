function Card({ children }) {
  return (
    <div className='border rounded-lg shadow-lg bg-white dark:bg-gray-800 p-4'>
      {children}
    </div>
  )
}

function CardHeader({ children }) {
  return <div className='flex flex-col gap-2'>{children}</div>
}

function CardTitle({ children }) {
  return (
    <h2 className='text-xl font-bold text-gray-800 dark:text-white'>
      {children}
    </h2>
  )
}

function CardDescription({ children }) {
  return <p className='text-gray-600 dark:text-gray-400'>{children}</p>
}

function CardContent({ children }) {
  return <div className='mt-4'>{children}</div>
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent }
