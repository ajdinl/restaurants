'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MenuIcon, Button } from '@/components'
import { useSearchParams } from 'next/navigation'
import { fetchUserData } from '@/utils/functions'
import { ThemeProvider } from 'next-themes'
import { useTheme } from 'next-themes'

export default function Navbar({ isAdmin }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const userName = data?.user?.user_metadata?.full_name

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      await fetchUserData(setData)
      setLoading(false)
    }
    fetchData()
  }, [])

  const handleUserMenu = () => {
    setShowUserMenu(!showUserMenu)
  }

  const ThemeButton = () => {
    const { systemTheme, theme, setTheme } = useTheme()
    const currentTheme = theme === 'system' ? systemTheme : theme

    return (
      <button
        onClick={() => (theme == 'dark' ? setTheme('light') : setTheme('dark'))}
        className='bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-500 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-100 px-4 py-2 text-base rounded absolute right-4 md:right-5 top-12'
      >
        Toggle
      </button>
    )
  }

  if (showUserMenu) {
    setTimeout(() => setShowUserMenu(false), 3000)
  }

  return (
    <ThemeProvider attribute='class'>
      <header className='flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-6 bg-white dark:bg-gray-900'>
        <nav className='flex flex-row items-center gap-2 md:gap-6 text-sm md:text-lg font-medium'>
          <Link
            href='/'
            className='flex items-center gap-2 text-lg font-semibold md:text-base'
          >
            <MenuIcon
              className={
                !view
                  ? 'h-7 w-7 dark:text-white'
                  : 'h-6 w-6 text-gray-500 dark:text-gray-400'
              }
            />
            <span className='sr-only'>Restaurant Dashboard</span>
          </Link>
          {!isAdmin && (
            <>
              <Link
                href='?view=menu'
                className={
                  view === 'menu'
                    ? 'font-bold dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                Menu
              </Link>
              <Link
                href='?view=tables'
                className={
                  view === 'tables'
                    ? 'font-bold dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                Tables
              </Link>
              <Link
                href='?view=orders'
                className={
                  view === 'orders'
                    ? 'font-bold dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                Orders
              </Link>
              <Link
                href='?view=reservations'
                className={
                  view === 'reservations'
                    ? 'font-bold dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                Reservations
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                href='?view=restaurants'
                className={
                  view === 'restaurants'
                    ? 'font-bold dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                Restaurants
              </Link>
              <Link
                href='?view=create'
                className={
                  view === 'create'
                    ? 'font-bold dark:text-white'
                    : 'text-gray-500 dark:text-gray-400'
                }
              >
                Create
              </Link>
            </>
          )}
          {/* <Link className='text-gray-500 dark:text-gray-400' href='#'>
          Reports
        </Link> */}
        </nav>
        {loading && (
          <p className='text-gray-500 dark:text-gray-300 text-sm md:text-lg'>
            Loading...
          </p>
        )}
        {data && !loading && (
          <div>
            <p
              className='font-bold text-gray-500 dark:text-gray-300 text-sm md:text-lg cursor-pointer'
              onClick={handleUserMenu}
            >
              {userName}
            </p>
            {showUserMenu && (
              <>
                <ThemeButton />
                <form action='/auth/signout' method='post'>
                  <Button
                    type='submit'
                    className='absolute w-28 right-4 md:right-5 top-24 text-sm md:text-base bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-500 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700'
                  >
                    Sign Out
                  </Button>
                </form>
              </>
            )}
          </div>
        )}
      </header>
    </ThemeProvider>
  )
}
