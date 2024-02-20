'use client'

import { useState, useEffect } from 'react'
import { fetchRestaurant } from '@/utils/supabaseMethods'

export default function RestaurantComponent({ id }) {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(false)
  const { name, address, phone, menu } = restaurant?.data ?? {}

  useEffect(() => {
    setLoading(true)
    fetchRestaurant(id).then((data) => {
      setRestaurant(data)
      setLoading(false)
    })
  }, [id])

  return (
    <>
      {loading && (
        <div className='text-center text-xl font-bold mt-96 text-gray-500'>
          Loading...
        </div>
      )}
      {!loading && restaurant && (
        <div className='flex flex-col'>
          <div className='flex flex-row items-center justify-between p-4 h-12 font-bold text-gray-600 bg-gray-300'>
            <p className='text-sm sm:text-base'>
              <span className='text-gray-700 hidden sm:inline'>Address: </span>
              {address}
            </p>
            <h1 className='text-xl'>{name}</h1>
            <p className='text-sm sm:text-base'>
              <span className='text-gray-700 hidden sm:inline'>Phone: </span>
              {phone}
            </p>
          </div>
          <div className='flex flex-col items-center p-4 mt-36'>
            <p className='text-gray-600 text-xl font-bold'>Menu</p>
            <div className='flex flex-col gap-2 mt-4'>
              {menu[0].items.map((item, index) => (
                <p key={index}>{item}</p>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
