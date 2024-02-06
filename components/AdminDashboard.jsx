'use client'

import { useState, useEffect } from 'react'
import {
  getUser,
  fetchRestaurants,
  deleteArrayItem,
  deleteItem,
} from '@/utils/supabaseMethods'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  NewUserForm,
  NewRestaurantForm,
  PencilIcon,
  EditModal,
  NewModal,
} from '@/components'

export default function AdminDashboardComponent() {
  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const searchParams = useSearchParams()
  const view = searchParams.get('view')

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
      const { data, error } = await fetchRestaurants()

      if (error) {
        console.error('Error fetching restaurant:', error)
        return
      }

      setRestaurants(data)
    } catch (error) {
      console.error('Error fetching restaurant:', error)
    }
  }

  const handleDeleteItem = async (category, selected, index) => {
    let selectedArray = selected.items
    let displayError
    const text = `Are you sure you want to delete this item?`

    if (index) {
      if (confirm(text) === true) {
        selectedArray = selectedArray.filter((_, i) => i !== index)
      } else {
        return
      }

      const { data, error } = await deleteArrayItem(
        category,
        selected.id,
        selectedArray
      )
      displayError = error
    }

    if (!index) {
      if (confirm(text) === true) {
        const { data, error } = await deleteItem(category, selected.id)
        displayError = error
      } else {
        return
      }
    }

    if (displayError) {
      console.error('Error deleting item:', displayError)
      return
    } else {
      fetchRestaurantsData()
    }
  }

  const setEditSelectedItem = (item) => {
    setSelected(item)
    setShowEditModal(true)
  }

  const openNewModal = (itemDetails) => {
    setShowNewModal(true)
    setSelected(itemDetails)
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
        {!view && (
          <div className='text-3xl text-center'>
            Welcome to the Admin Dashboard
          </div>
        )}
        {view === 'restaurants' && (
          <Card>
            <CardHeader>
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>List of all restaurants.</CardDescription>
            </CardHeader>
            <CardContent>
              {restaurants &&
                restaurants.map((restaurant) => (
                  <div
                    key={restaurant.id}
                    className='flex flex-row justify-between space-x-20 border-b-2 border-gray-600'
                  >
                    <p className='text-4xl w-44'>{restaurant.name}</p>
                    <ul className='border-l-2 border-gray-600 p-4 w-64'>
                      <div className='flex flex-row'>
                        <p className='text-2xl'>Menu</p>
                        <button
                          className='mx-3 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
                          onClick={() =>
                            openNewModal({
                              category: 'Menu',
                              restaurantId: restaurant.id,
                              menuNumber: restaurant.menu.length + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                      {restaurant.menu
                        .sort((a, b) => a.number - b.number)
                        .map((menu) => (
                          <li key={menu.id}>
                            <div className='flex flex-row'>
                              <p className='my-3'>Menu #{menu.number}</p>
                              <button
                                className='mx-3 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
                                onClick={() =>
                                  openNewModal({ category: 'Dish', menu })
                                }
                              >
                                +
                              </button>
                            </div>
                            <ul>
                              {menu.items?.map((item, index) => (
                                <li
                                  key={index}
                                  className='flex flex-row justify-between border-b border-gray-600 w-60'
                                >
                                  <p>{item}</p>
                                  <div className='flex flex-row items-center'>
                                    <PencilIcon
                                      className='h-4 w-4 text-gray-600 hover:fill-gray-300 cursor-pointer'
                                      onClick={() =>
                                        setEditSelectedItem({
                                          ...menu,
                                          category: 'menu',
                                          item,
                                          index,
                                        })
                                      }
                                    >
                                      Edit
                                    </PencilIcon>
                                    <button
                                      className='ml-2 cursor-pointer text-red-400 hover:text-red-500'
                                      onClick={() =>
                                        handleDeleteItem('menu', menu, index)
                                      }
                                    >
                                      X
                                    </button>
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                    </ul>
                    <ul className='border-l-2 border-gray-600 p-4 w-64'>
                      <div className='flex flex-row'>
                        <p className='text-2xl'>Tables</p>
                        <button
                          className='mx-3 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
                          onClick={() =>
                            openNewModal({
                              category: 'Reservation',
                              restaurantId: restaurant.id,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                      <p className='text-sm text-center py-1'>
                        Number - Status - Capacity
                      </p>
                      {restaurant.tables
                        .sort((a, b) => a.number - b.number)
                        .map((table) => (
                          <li
                            key={table.id}
                            className='flex flex-row justify-between border-b border-gray-600 w-60'
                          >
                            <p>
                              Table #{table.number} - Capacity -{' '}
                              {table.capacity}
                            </p>
                            <div className='flex flex-row items-center'>
                              <PencilIcon
                                className='h-4 w-4 text-gray-600 hover:fill-gray-300 cursor-pointer'
                                onClick={() =>
                                  setEditSelectedItem({
                                    ...table,
                                    category: 'tables',
                                  })
                                }
                              >
                                Edit
                              </PencilIcon>
                              <button
                                className='ml-2 cursor-pointer text-red-400 hover:text-red-500'
                                onClick={() =>
                                  handleDeleteItem('tables', table)
                                }
                              >
                                X
                              </button>
                            </div>
                          </li>
                        ))}
                    </ul>
                    <ul className='flex flex-1 border-l-2 border-gray-600 p-4'>
                      <div className='flex flex-col'>
                        <p className='text-2xl mr-2'>Orders</p>
                        <button
                          className='mx-3 text-green-400 hover:text-green-500 text-3xl font-semibold'
                          onClick={() =>
                            openNewModal({
                              category: 'Order',
                              restaurantId: restaurant.id,
                              orderNumber: restaurant.orders.length + 1,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                      {restaurant.orders
                        .sort((a, b) => a.number - b.number)
                        .map((order) => (
                          <li key={order.id}>
                            <div className='flex flex-row items-center'>
                              <p className='ml-2'>
                                Order #{order.number} - Table #
                                {order.table_number}:
                              </p>
                              <button
                                className='mx-3 text-green-400 hover:text-green-500 text-3xl font-semibold'
                                onClick={() =>
                                  openNewModal({ category: 'Order Dish' })
                                }
                              >
                                +
                              </button>
                            </div>
                            <ul className='mr-2 p-2'>
                              {order.items?.map((item, index) => (
                                <li
                                  key={index}
                                  className='flex flex-row justify-between border-b border-gray-600 w-60'
                                >
                                  <p>{item}</p>
                                  <div className='flex flex-row items-center'>
                                    <PencilIcon
                                      className='h-4 w-4 text-gray-600 hover:fill-gray-300 cursor-pointer'
                                      onClick={() =>
                                        setEditSelectedItem({
                                          ...order,
                                          category: 'orders',
                                          item,
                                          index,
                                        })
                                      }
                                    >
                                      Edit
                                    </PencilIcon>
                                    <button
                                      className='ml-2 cursor-pointer text-red-400 hover:text-red-500'
                                      onClick={() =>
                                        handleDeleteItem('orders', order, index)
                                      }
                                    >
                                      X
                                    </button>
                                  </div>
                                </li>
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
        {view === 'users' && (
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
      {showNewModal && (
        <NewModal
          setShowNewModal={setShowNewModal}
          selected={selected}
          isAdmin={true}
          fetchRestaurantsData={fetchRestaurantsData}
          restaurants={restaurants}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          selected={selected}
          fetchRestaurantsData={fetchRestaurantsData}
        />
      )}
    </div>
  )
}
