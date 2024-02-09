'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { MenuIcon, Button } from '@/components'
import { useSearchParams } from 'next/navigation'
import { fetchUserData } from '@/components'

export default function Navbar({ isAdmin }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const userEmail = data?.user?.email

  useEffect(() => {
    setLoading(true)
    fetchUserData(setData)
    if (data) {
      setLoading(false)
    }
  }, [data])

  return (
    <>
      <header className='flex items-center justify-between h-16 px-4 border-b shrink-0 md:px-6'>
        <nav className='flex flex-row items-center gap-5 lg:gap-6 text-lg font-medium '>
          <Link
            className='flex items-center gap-2 text-lg font-semibold md:text-base'
            href='/'
          >
            <MenuIcon
              className={
                !view ? 'h-7 w-7' : 'h-6 w-6 text-gray-500 dark:text-gray-400'
              }
            />
            <span className='sr-only'>Restaurant Dashboard</span>
          </Link>
          {!isAdmin && (
            <>
              <Link
                className={
                  view === 'menu'
                    ? 'font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                }
                href='?view=menu'
              >
                Menu
              </Link>
              <Link
                className={
                  view === 'tables'
                    ? 'font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                }
                href='?view=tables'
              >
                Tables
              </Link>
              <Link
                className={
                  view === 'orders'
                    ? 'font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                }
                href='?view=orders'
              >
                Orders
              </Link>
            </>
          )}
          {isAdmin && (
            <>
              <Link
                className={
                  view === 'restaurants'
                    ? 'font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                }
                href='?view=restaurants'
              >
                Restaurants
              </Link>
              <Link
                className={
                  view === 'users'
                    ? 'font-bold'
                    : 'text-gray-500 dark:text-gray-400'
                }
                href='?view=users'
              >
                Create
              </Link>
            </>
          )}
          {/* <Link className='text-gray-500 dark:text-gray-400' href='#'>
            Reservations
          </Link> */}
          {/*  <Link className='text-gray-500 dark:text-gray-400' href='#'>
          Reports
        </Link> */}
        </nav>
        {loading && (
          <div className='flex flex-row items-center gap-4'>
            <div className='text-left text-gray-500'>Loading...</div>
          </div>
        )}
        {data && !loading && (
          <div className='flex flex-row items-center gap-4'>
            <p className='text-right text-gray-500 text-sm md:text-base'>
              Hello, {userEmail}
            </p>
            <form action='/auth/signout' method='post'>
              <Button
                type='submit'
                className='text-sm md:text-base bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-500 font-semibold hover:bg-gray-200 dark:hover:bg-gray-700'
              >
                Sign Out
              </Button>
            </form>
          </div>
        )}
      </header>
    </>
  )
}
