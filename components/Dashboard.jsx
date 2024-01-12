'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
export default function DashboardComponent() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const isAdmin = user?.user?.user_metadata.is_admin
  const userId = user?.user?.id

  const fetchUserData = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      setUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchRestaurantData = async () => {
    try {
      let query = supabase
        .from('restaurant')
        .select(
          '*, restaurant_menu(*), restaurant_orders(*), restaurant_table(*)'
        )

      if (!isAdmin) {
        query = query.eq('user_id', userId).single()
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching restaurant:', error)
        return
      }

      setData(data)
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [])

  useEffect(() => {
    if (user) {
      fetchRestaurantData()
    }
  }, [user])

  return (
    <div className='flex flex-col items-center justify-center bg-white min-h-screen w-full'>
      <h1>Dashboard</h1>
      <div className='bg-gray-200 rounded-lg shadow-lg p-6 w-full max-w-lg text-center'>
        {isAdmin &&
          data.map((restaurant) => (
            <div key={restaurant.id}>
              <p>{restaurant.name}</p>
            </div>
          ))}
        {data &&
          data?.restaurant_menu?.map((menu) => (
            <div key={menu.id} className='my-4'>
              <h1 className='text-3xl mb-2'>{data.name}</h1>
              <ul>
                {menu.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
      </div>
    </div>
  )
}
