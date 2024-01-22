'use client'

import { useState, useEffect } from 'react'
import { getUser, fetchRestaurants } from '@/utils/supabaseMethods'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/Cards'
import NewUserForm from '@/components/NewUserForm'
import NewRestaurantForm from '@/components/NewRestaurantForm'
import { Button } from '@/components/Button'

export default function DashboardComponent() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
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
    <div>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10'>
        {(!view || view === 'menu') && (
          <Card className={`${!view ? 'cursor-pointer' : ''}`}>
            <CardHeader>
              <CardTitle>Menu</CardTitle>
              <CardDescription>
                List of available dishes and beverages.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {data &&
                  restaurantMenu?.map((menu) => (
                    <li key={menu.id} className='flex flex-col space-y-2'>
                      {!view
                        ? menu.items
                            ?.slice(0, 5)
                            ?.map((item) => <div key={item}>{item}</div>)
                        : menu.items?.map((item) => (
                            <div key={item}>{item}</div>
                          ))}
                    </li>
                  ))}
              </ul>
              <Button className='mt-4 bg-green-500 hover:bg-green-600 text-white'>
                Add New Dish
              </Button>
            </CardContent>
          </Card>
        )}
        {(!view || view === 'orders') && (
          <Card className={`${!view ? 'cursor-pointer' : ''}`}>
            <CardHeader>
              <CardTitle>Orders</CardTitle>
              <CardDescription>List of current orders.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {data && !view
                  ? restaurantOrders?.slice(0, 5)?.map((order) => (
                      <li key={order.id}>
                        Order #{order.number}: {order.items?.join(', ')}
                      </li>
                    ))
                  : restaurantOrders?.map((order) => (
                      <li key={order.id}>
                        Order #{order.number}: {order.items?.join(', ')}
                      </li>
                    ))}
              </ul>
              <Button className='mt-4 bg-blue-500 hover:bg-blue-600 text-white'>
                Add New Order
              </Button>
            </CardContent>
          </Card>
        )}
        {(!view || view === 'tables') && (
          <Card className={`${!view ? 'cursor-pointer' : ''}`}>
            <CardHeader>
              <CardTitle>Tables</CardTitle>
              <CardDescription>List of table reservations.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className='space-y-2'>
                {data && !view
                  ? restaurantTables?.slice(0, 5)?.map((table) => (
                      <li key={table.id}>
                        Table #{table.number}: {table.status}
                      </li>
                    ))
                  : restaurantTables?.map((table) => (
                      <li key={table.id}>
                        Table #{table.number}: {table.status}
                      </li>
                    ))}
              </ul>
              <Button className='mt-4 bg-red-500 hover:bg-red-600 text-white'>
                Reserve a Table
              </Button>
            </CardContent>
          </Card>
        )}
        {view === 'restaurants' && isAdmin && (
          <Card>
            <CardHeader>
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>List of all restaurants.</CardDescription>
            </CardHeader>
            <CardContent>
              {isAdmin &&
                data.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className='flex flex-row justify-between space-x-20 border-b-2 border-gray-600'
                  >
                    <p className='text-4xl w-1/12'>{restaurant.name}</p>
                    <ul className='border-l-2 border-gray-600 p-4 w-1/12'>
                      <p className='text-2xl'>Menu</p>
                      {restaurant.restaurant_menu.map((menu) => (
                        <li key={menu.id}>
                          <p className='mb-2'>Menu #{menu.number}</p>
                          {menu.items.map((item, index) => (
                            <ul key={index}>
                              <li>{item}</li>
                            </ul>
                          ))}
                        </li>
                      ))}
                    </ul>
                    <ul className='border-l-2 border-gray-600 p-4 w-1/12'>
                      <p className='text-2xl'>Tables</p>
                      {restaurant.restaurant_tables.map((table) => (
                        <li key={table.id}>
                          <p>
                            Table #{table.number} - {table.status}
                          </p>
                        </li>
                      ))}
                    </ul>
                    <ul className='flex flex-1 border-l-2 border-gray-600 p-4'>
                      <p className='text-2xl mr-2'>Orders</p>
                      {restaurant.restaurant_orders.map((order) => (
                        <li key={order.id}>
                          <p className='ml-2'>Order #{order.number}:</p>
                          <ul className='mr-2 p-2'>
                            {order.items.map((item, index) => (
                              <li key={index}>{item}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
            </CardContent>
          </Card>
        )}
        {view === 'users' && isAdmin && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Add a new user.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewUserForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Restaurant</CardTitle>
                <CardDescription>Add a new restaurant.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewRestaurantForm />
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  )
}
