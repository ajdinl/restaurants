export default function DashboardLayout({ children }) {
  return (
    <div className='flex flex-col w-full min-h-screen items-center justify-center'>
      <div>{children}</div>
    </div>
  )
}
