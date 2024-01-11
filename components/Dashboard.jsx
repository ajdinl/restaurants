'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
export default function DashboardComponent() {
  const [userId, setUserId] = useState(null)
  const [restaurant, setRestaurant] = useState(null)

  const getUser = async () => {
    try {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }

      const userId = data.user.id
      setUserId(userId)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchRestaurant = async () => {
    try {
      const { data, error } = await supabase
        .from('restaurant')
        .select('*, restaurant_menu(*)')
        .eq('user_id', userId)
        .single()

      if (error) {
        console.error('Error fetching restaurant:', error)
        return
      }

      setRestaurant(data)
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (userId) {
      fetchRestaurant()
    }
  }, [userId])

  return (
    <div className='flex flex-col items-center justify-center bg-white min-h-screen w-full'>
      <h1>Dashboard</h1>
      <div className='bg-gray-200 rounded-lg shadow-lg p-6 w-full max-w-lg text-center'>
        {restaurant && <h1 className='text-3xl'>{restaurant.name}</h1>}
        {restaurant &&
          restaurant?.restaurant_menu.map((menu) => (
            <div key={menu.id} className='my-4'>
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
