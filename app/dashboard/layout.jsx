import Navbar from '@/components/Navbar'

export default function DashboardLayout({ children }) {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <Navbar />
      <div>{children}</div>
    </div>
  )
}
