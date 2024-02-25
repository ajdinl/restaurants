'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardContentHeader,
  NewUserForm,
  NewRestaurantForm,
  EditModal,
  NewModal,
  EditIcon,
  DeleteIcon,
  DeleteModal,
} from '@/components'
import { fetchUserData, fetchRestaurantsData } from '@/utils/functions'

export default function AdminDashboardComponent() {
  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const searchParams = useSearchParams()
  const view = searchParams.get('view')

  const getRestaurantsData = async () => {
    fetchRestaurantsData({
      setLoading: () => {},
      setData: setRestaurants,
      userId: null,
    })
  }

  const setEditSelectedItem = (item) => {
    setSelected(item)
    setShowEditModal(true)
  }

  const setDeleteSelectedItem = (item) => {
    setSelected(item)
    setShowDeleteModal(true)
  }

  const openNewModal = (itemDetails) => {
    setShowNewModal(true)
    setSelected(itemDetails)
  }

  useEffect(() => {
    fetchUserData(setUser)
  }, [])

  useEffect(() => {
    if (user) {
      getRestaurantsData()
    }
  }, [user])

  return (
    <div>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 bg-white dark:bg-gray-900 text-black dark:text-white'>
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
                    className='flex flex-col md:flex-row md:space-x-5 flex-wrap mb-5'
                  >
                    <p className='absolute text-2xl w-10/12 lg:w-11/12 text-center'>
                      {restaurant.name}
                    </p>
                    <CardContentHeader
                      title='Menu'
                      openNewModal={() => {
                        openNewModal({
                          category: 'Menu',
                          restaurantId: restaurant.id,
                          menuNumber:
                            restaurant.menu.map((menu) => menu.number).pop() +
                            1,
                        })
                      }}
                    >
                      {restaurant.menu
                        .sort((a, b) => a.number - b.number)
                        .map((menu) => (
                          <li key={menu.id}>
                            <div className='flex flex-row'>
                              <p className='my-3'>List of dishes</p>
                              <button
                                className='mx-2 -mt-1 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
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
                                  className='flex flex-col justify-between w-60 mb-3'
                                >
                                  <div className='flex flex-row'>
                                    <p className='text-lg'>{item.name}</p>
                                    <div className='flex flex-row items-center ml-auto'>
                                      <EditIcon
                                        action={() =>
                                          setEditSelectedItem({
                                            ...menu,
                                            category: 'menu',
                                            item,
                                            index,
                                          })
                                        }
                                        className='ml-2'
                                      />
                                      <DeleteIcon
                                        action={() =>
                                          setDeleteSelectedItem({
                                            category: 'menu',
                                            data: menu,
                                            index,
                                          })
                                        }
                                        className='ml-2'
                                      />
                                    </div>
                                  </div>
                                  <p className='text-sm'>
                                    {item.ingredients?.join(', ')}
                                  </p>
                                  <span className='text-sm font-bold mt-1'>
                                    ${item.price}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                    </CardContentHeader>
                    <CardContentHeader
                      title='Tables'
                      openNewModal={() =>
                        openNewModal({
                          category: 'Table',
                          restaurantId: restaurant.id,
                        })
                      }
                    >
                      {restaurant.tables
                        .sort((a, b) => a.number - b.number)
                        .map((table) => (
                          <li
                            key={table.id}
                            className='flex flex-row justify-between mb-1 w-60'
                          >
                            <p>
                              Table #{table.number} - Capacity: {table.capacity}
                            </p>
                            <div className='flex flex-row items-center'>
                              <EditIcon
                                action={() =>
                                  setEditSelectedItem({
                                    ...table,
                                    category: 'tables',
                                  })
                                }
                              />
                              <DeleteIcon
                                action={() =>
                                  setDeleteSelectedItem({
                                    category: 'tables',
                                    data: table,
                                  })
                                }
                                className='ml-2'
                              />
                            </div>
                          </li>
                        ))}
                    </CardContentHeader>
                    <CardContentHeader
                      title='Reservations'
                      openNewModal={() => {
                        openNewModal({
                          category: 'Reservation',
                          restaurantId: restaurant.id,
                        })
                      }}
                      className='space-y-2'
                    >
                      {restaurant.reservations
                        .sort((a, b) => a.number - b.number)
                        .map((reservation) => (
                          <li
                            key={reservation.id}
                            className='flex flex-row justify-between w-60'
                          >
                            <div className='flex flex-col'>
                              <p>Reservation #{reservation.number}</p>
                              <p>Table #{reservation.table_number}</p>
                              <p>Status: {reservation.status}</p>
                              <p>Guests: {reservation.capacity}</p>
                            </div>
                            <div className='flex flex-row items-center'>
                              <EditIcon
                                action={() =>
                                  setEditSelectedItem({
                                    ...reservation,
                                    category: 'reservations',
                                  })
                                }
                              />
                              <DeleteIcon
                                action={() =>
                                  setDeleteSelectedItem({
                                    category: 'reservations',
                                    data: reservation,
                                  })
                                }
                                className='ml-2'
                              />
                            </div>
                          </li>
                        ))}
                    </CardContentHeader>
                    <CardContentHeader
                      title='Orders'
                      openNewModal={() => {
                        openNewModal({
                          category: 'Order',
                          restaurantId: restaurant.id,
                          orderNumbers: restaurant.orders.map(
                            (order) => order.number
                          ),
                        })
                      }}
                      className='flex flex-row flex-nowrap overflow-x-auto w-1/2 md:flex-1'
                      subClassName={true}
                    >
                      {restaurant.orders
                        .sort((a, b) => a.number - b.number)
                        .map((order) => (
                          <li key={order.id}>
                            <div className='flex flex-row items-center ml-10'>
                              <p>
                                Order #{order.number} - Table #
                                {order.table_number}:
                              </p>
                              <button
                                className='mx-3 -mt-1 text-green-400 hover:text-green-500 text-3xl font-semibold'
                                onClick={() =>
                                  openNewModal({
                                    category: 'Order Dish',
                                    order,
                                  })
                                }
                              >
                                +
                              </button>
                              <DeleteIcon
                                action={() =>
                                  setDeleteSelectedItem({
                                    category: 'orders',
                                    data: order,
                                  })
                                }
                                className='ml-1'
                              />
                            </div>
                            <ul className='mr-2 p-2'>
                              {order.items?.map((item, index) => (
                                <li
                                  key={index}
                                  className='flex flex-row justify-between mb-1 w-60'
                                >
                                  <p className='text-sm'>{item.quantity} x</p>
                                  <p>{item.name}</p>
                                  <div className='flex flex-row items-center'>
                                    <EditIcon
                                      action={() =>
                                        setEditSelectedItem({
                                          ...order,
                                          category: 'orders',
                                          item,
                                          index,
                                        })
                                      }
                                    />
                                    <DeleteIcon
                                      action={() =>
                                        setDeleteSelectedItem({
                                          category: 'orders',
                                          data: order,
                                          index,
                                        })
                                      }
                                      className='ml-2'
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                    </CardContentHeader>
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
          fetchRestaurantsData={getRestaurantsData}
          restaurants={restaurants}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          selected={selected}
          fetchRestaurantsData={getRestaurantsData}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          setShowDeleteModal={setShowDeleteModal}
          selected={selected}
          getRestaurantsData={getRestaurantsData}
        />
      )}
    </div>
  )
}
