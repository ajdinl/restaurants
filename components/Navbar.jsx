import Link from 'next/link'
import { MenuIcon } from '@/components/Icons'
import { SignOutButton } from '@/components/SignOutButton'

export default function Navbar({ isAdmin }) {
  return (
    <>
      <header className='flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-6'>
        <nav className='flex-col hidden gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 lg:gap-6'>
          <Link
            className='flex items-center gap-2 text-lg font-semibold md:text-base'
            href='#'
          >
            <MenuIcon className='w-6 h-6' />
            <span className='sr-only'>Restaurant Dashboard</span>
          </Link>
          <Link className='font-bold' href='#'>
            Menu
          </Link>
          <Link className='text-gray-500 dark:text-gray-400' href='#'>
            Orders
          </Link>
          <Link className='text-gray-500 dark:text-gray-400' href='#'>
            Tables
          </Link>
          {isAdmin && (
            <Link className='text-gray-500 dark:text-gray-400' href='#'>
              Restaurants
            </Link>
          )}
          {/* <Link className='text-gray-500 dark:text-gray-400' href='#'>
          Reservations
        </Link>
        <Link className='text-gray-500 dark:text-gray-400' href='#'>
          Reports
        </Link> */}
        </nav>
        <SignOutButton />
      </header>
    </>
  )
}
