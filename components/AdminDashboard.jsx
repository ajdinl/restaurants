'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  NewUserForm,
  NewRestaurantForm,
  EditModal,
  NewModal,
  EditIcon,
  DeleteIcon,
  fetchUserData,
  fetchRestaurantsData,
} from '@/components'

export default function AdminDashboardComponent() {
  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
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
                    <p className='text-2xl min-w-20 w-auto max-w-44 flex flex-nowrap overflow-x-auto'>
                      {restaurant.name}
                    </p>
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
                                    <EditIcon
                                      setEditSelectedItem={setEditSelectedItem}
                                      selected={menu}
                                      category='menu'
                                      item={item}
                                      index={index}
                                    />
                                    <DeleteIcon
                                      category='menu'
                                      data={menu}
                                      index={index}
                                      getRestaurantsData={getRestaurantsData}
                                      className='ml-2'
                                    />
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </li>
                        ))}
                    </ul>
                    <ul className='border-l-2 border-gray-600 p-4 w-60'>
                      <div className='flex flex-row'>
                        <p className='text-2xl'>Tables</p>
                        <button
                          className='mx-3 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
                          onClick={() =>
                            openNewModal({
                              category: 'Table',
                              restaurantId: restaurant.id,
                            })
                          }
                        >
                          +
                        </button>
                      </div>
                      {restaurant.tables
                        .sort((a, b) => a.number - b.number)
                        .map((table) => (
                          <li
                            key={table.id}
                            className='flex flex-row justify-between border-b border-gray-600 w-60'
                          >
                            <p>
                              Table #{table.number} - Capacity: {table.capacity}
                            </p>
                            <div className='flex flex-row items-center'>
                              <EditIcon
                                setEditSelectedItem={setEditSelectedItem}
                                selected={table}
                                category='tables'
                              />
                              <DeleteIcon
                                category='tables'
                                data={table}
                                index={null}
                                getRestaurantsData={getRestaurantsData}
                                className='ml-2'
                              />
                            </div>
                          </li>
                        ))}
                    </ul>
                    <ul className='border-l-2 border-gray-600 p-4 w-60 space-y-2'>
                      <div className='flex flex-row'>
                        <p className='text-2xl'>Reservations</p>
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
                      {restaurant.reservations
                        .sort((a, b) => a.number - b.number)
                        .map((reservation) => (
                          <li
                            key={reservation.id}
                            className='flex flex-row justify-between border-b border-gray-600 w-60'
                          >
                            <div className='flex flex-col'>
                              <p>Reservation #{reservation.number}</p>
                              <p>Table #{reservation.table_number}</p>
                              <p>Status: {reservation.status}</p>
                              <p>Guests: {reservation.capacity}</p>
                            </div>
                            <div className='flex flex-row items-center'>
                              <EditIcon
                                setEditSelectedItem={setEditSelectedItem}
                                selected={reservation}
                                category='reservations'
                              />
                              <DeleteIcon
                                category='reservations'
                                data={reservation}
                                index={null}
                                getRestaurantsData={getRestaurantsData}
                                className='ml-2'
                              />
                            </div>
                          </li>
                        ))}
                    </ul>
                    <ul className='flex flex-row flex-nowrap overflow-x-auto border-l-2 border-gray-600 p-4 w-1/2'>
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
                                className='mx-3 -mt-1 text-green-400 hover:text-green-500 text-3xl font-semibold'
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
                                    <EditIcon
                                      setEditSelectedItem={setEditSelectedItem}
                                      selected={order}
                                      category='orders'
                                      item={item}
                                      index={index}
                                    />
                                    <DeleteIcon
                                      category='orders'
                                      data={order}
                                      index={index}
                                      getRestaurantsData={getRestaurantsData}
                                      className='ml-2'
                                    />
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
    </div>
  )
}
