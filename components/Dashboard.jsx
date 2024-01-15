'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/utils/supabaseClient'
export default function DashboardComponent() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const isAdmin = user?.user?.user_metadata.is_admin
  const userId = user?.user?.id
  const restaurantMenu = data?.restaurant_menu
  const restaurantTables = data?.restaurant_tables
  const restaurantOrders = data?.restaurant_orders

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
        .from('restaurants')
        .select(
          '*, restaurant_menu(*), restaurant_orders(*), restaurant_tables(*)'
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
      <div className='flex flex-row bg-gray-200 rounded-lg shadow-lg p-6 w-full max-w-lg text-center space-x-10'>
        {isAdmin &&
          data.map((restaurant) => (
            <div key={restaurant.id} className='space-y-4'>
              <p className='text-3xl'>{restaurant.name}</p>
              <ul>
                <p className='text-xl'>Menu</p>
                {restaurant.restaurant_menu.map((menu) => (
                  <li key={menu.id}>
                    {menu.items.map((item) => (
                      <ul key={item}>
                        <li>{item}</li>
                      </ul>
                    ))}
                  </li>
                ))}
              </ul>
              <ul>
                <p className='text-xl'>Tables</p>
                {restaurant.restaurant_tables.map((table) => (
                  <li key={table.id}>{table.number}</li>
                ))}
              </ul>
              <ul>
                <p className='text-xl'>Orders</p>
                {restaurant.restaurant_orders.map((order) => (
                  <li key={order.id}>
                    <ul className='mb-2'>
                      {order.order_items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        <div className='flex flex-col mx-auto'>
          {data &&
            restaurantMenu?.map((menu) => (
              <div key={menu.id} className='my-4'>
                <h1 className='text-3xl mb-2'>{data.name}</h1>
                <ul>
                  {menu.items.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          {data &&
            restaurantTables?.map((table) => (
              <div key={table.id}>
                <p>{table.number}</p>
              </div>
            ))}
          {data &&
            restaurantOrders?.map((order) => (
              <div key={order}>
                <p>{order.order_items}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
