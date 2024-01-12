'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
export default function DashboardComponent() {
  const [user, setUser] = useState(null)
  const [restaurant, setRestaurant] = useState(null)
  const [restaurants, setRestaurants] = useState([])

  const isAdmin = user?.user?.user_metadata.is_admin
  const userId = user?.user?.id

  const getUser = async () => {
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

  const fetchRestaurant = async () => {
    try {
      if (isAdmin) {
        const { data, error } = await supabase
          .from('restaurant')
          .select(
            '*, restaurant_menu(*), restaurant_orders(*), restaurant_table(*)'
          )
        if (error) {
          console.error('Error fetching restaurant:', error)
          return
        }
        setRestaurants(data)
        return
      }

      const { data, error } = await supabase
        .from('restaurant')
        .select(
          '*, restaurant_menu(*), restaurant_orders(*), restaurant_table(*)'
        )
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
    if (user) {
      fetchRestaurant()
    }
  }, [user])

  return (
    <div className='flex flex-col items-center justify-center bg-white min-h-screen w-full'>
      <h1>Dashboard</h1>
      <div className='bg-gray-200 rounded-lg shadow-lg p-6 w-full max-w-lg text-center'>
        {isAdmin &&
          restaurants.map((restaurant) => (
            <div key={restaurant.id}>
              <h1 className='text-3xl'>{restaurant.name}</h1>
              <p>{restaurant.name}</p>
            </div>
          ))}
        {restaurant &&
          restaurant?.restaurant_menu.map((menu) => (
            <div key={menu.id} className='my-4'>
              {restaurant && <h1 className='text-3xl'>{restaurant.name}</h1>}
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
