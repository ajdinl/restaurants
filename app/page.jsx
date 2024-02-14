import AuthForm from '@/components/AuthForm'

export default function Home() {
  return (
    <main className='flex items-center justify-center bg-white min-h-screen'>
      <div className='bg-gray-200 rounded shadow-lg p-6 w-10/12 md:w-full max-w-lg'>
        <h2 className='text-black text-2xl font-bold mb-4 text-center'>
          Welcome to Restaurants Application
        </h2>
        <p className='mb-6 text-lg text-gray-600 text-center'>
          Sign in to edit your restaurant menu or orders
        </p>
        <AuthForm />
      </div>
    </main>
  )
}
