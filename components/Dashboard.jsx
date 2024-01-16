'use client'

import { useState, useEffect } from 'react'
import { getUser, fetchRestaurants } from '@/utils/supabaseClient'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from './Cards'

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
      const { data, error } = await getUser()
      if (error) {
        console.error('Error fetching user:', error)
        return
      }
      setUser(data)
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchRestaurantsData = async () => {
    try {
      const { data, error } = await fetchRestaurants(isAdmin, userId)

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
      fetchRestaurantsData()
    }
  }, [user])

  return (
    // <div className='flex flex-col items-end bg-white'>
    //   <form action='/auth/signout' method='post'>
    //     <button
    //       type='submit'
    //       className='bg-gray-700 text-white font-bold py-2 px-4 rounded hover:bg-gray-500 m-4'
    //     >
    //       Sign Out
    //     </button>
    //   </form>
    //   <div className='flex flex-col items-center justify-center bg-white min-h-screen w-full'>
    //     <h1>Dashboard</h1>
    //     <div className='flex flex-row bg-gray-200 rounded-lg shadow-lg p-6 w-full max-w-lg text-center space-x-10'>
    //       {isAdmin &&
    //         data.map((restaurant) => (
    //           <div key={restaurant.id} className='space-y-4'>
    //             <p className='text-3xl'>{restaurant.name}</p>
    //             <ul>
    //               <p className='text-xl'>Menu</p>
    //               {restaurant.restaurant_menu.map((menu) => (
    //                 <li key={menu.id}>
    //                   {menu.items.map((item) => (
    //                     <ul key={item}>
    //                       <li>{item}</li>
    //                     </ul>
    //                   ))}
    //                 </li>
    //               ))}
    //             </ul>
    //             <ul>
    //               <p className='text-xl'>Tables</p>
    //               {restaurant.restaurant_tables.map((table) => (
    //                 <li key={table.id}>{table.number}</li>
    //               ))}
    //             </ul>
    //             <ul>
    //               <p className='text-xl'>Orders</p>
    //               {restaurant.restaurant_orders.map((order) => (
    //                 <li key={order.id}>
    //                   <ul className='mb-2'>
    //                     {order.order_items.map((item) => (
    //                       <li key={item}>{item}</li>
    //                     ))}
    //                   </ul>
    //                 </li>
    //               ))}
    //             </ul>
    //           </div>
    //         ))}
    //       <div className='flex flex-col mx-auto'>
    //         {data &&
    //           restaurantMenu?.map((menu) => (
    //             <div key={menu.id} className='my-4'>
    //               <h1 className='text-3xl mb-2'>{data.name}</h1>
    //               <ul>
    //                 {menu.items.map((item, index) => (
    //                   <li key={index}>{item}</li>
    //                 ))}
    //               </ul>
    //             </div>
    //           ))}
    //         {data &&
    //           restaurantTables?.map((table) => (
    //             <div key={table.id}>
    //               <p>{table.number}</p>
    //             </div>
    //           ))}
    //         {data &&
    //           restaurantOrders?.map((order) => (
    //             <div key={order}>
    //               <p>{order.order_items}</p>
    //             </div>
    //           ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10'>
        <Card>
          <CardHeader>
            <CardTitle>Menu</CardTitle>
            <CardDescription>
              List of available dishes and beverages.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li>Pasta Primavera</li>
              <li>Chicken Caesar Salad</li>
              <li>Beef Wellington</li>
              <li>Grilled Salmon</li>
              <li>Chocolate Lava Cake</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>List of current orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li>Order #123: Pasta Primavera</li>
              <li>Order #124: Chicken Caesar Salad</li>
              <li>Order #125: Beef Wellington</li>
              <li>Order #126: Grilled Salmon</li>
              <li>Order #127: Chocolate Lava Cake</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tables</CardTitle>
            <CardDescription>List of table reservations.</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className='space-y-2'>
              <li>Table #1: Reserved</li>
              <li>Table #2: Available</li>
              <li>Table #3: Reserved</li>
              <li>Table #4: Available</li>
              <li>Table #5: Reserved</li>
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
