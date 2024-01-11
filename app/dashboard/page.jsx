import DashboardComponent from '@/components/Dashboard'

export default function Dashboard() {
  return (
    <div className='flex flex-col items-end bg-white'>
      <form action='/auth/signout' method='post'>
        <button
          type='submit'
          className='bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 m-4'
        >
          Sign Out
        </button>
      </form>
      <DashboardComponent />
    </div>
  )
}
