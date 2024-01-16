import Navbar from '@/components/Navbar'

export default function AdminDashboardLayout({ children }) {
  return (
    <div className='flex flex-col w-full min-h-screen'>
      <Navbar isAdmin={true} />
      <div>{children}</div>
    </div>
  )
}
