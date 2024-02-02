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
  Button,
  PencilIcon,
  EditModal,
  NewModal,
} from '@/components'

export default function DashboardComponent() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const userId = user?.user?.id
  const restaurantId = data?.id
  const restaurantMenu = data?.menu
  const restaurantTables = data?.tables
  const restaurantOrders = data?.orders

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
      const { data, error } = await fetchRestaurants(userId)

      if (error) {
        console.error('Error fetching restaurant:', error)
        return
      }
      setLoading(false)
      setData(data)
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
    <>
      {data && (
        <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10'>
          {(!view || view === 'menu') && (
            <Card className={`${!view ? 'cursor-pointer' : ''}`}>
              <CardHeader>
                <div className='flex flex-row items-center justify-between'>
                  <CardTitle view={view}>Menu</CardTitle>
                  {view && (
                    <Button
                      className='bg-green-500 hover:bg-green-600 text-white'
                      onClick={() => openNewModal('Dish')}
                    >
                      Add New Dish
                    </Button>
                  )}
                </div>
                <CardDescription view={view}>
                  List of available dishes and beverages.
                </CardDescription>
              </CardHeader>
              <CardContent view={view}>
                {loading && (
                  <div className='text-left text-gray-500'>Loading...</div>
                )}
                <ul className='space-y-6'>
                  {restaurantMenu?.map((menu) => (
                    <li
                      key={menu.id}
                      className={`flex flex-col ${
                        view ? 'space-y-4' : 'space-y-2'
                      }`}
                    >
                      {!view
                        ? menu.items
                            ?.slice(0, 5)
                            ?.map((item) => <div key={item}>{item}</div>)
                        : menu.items?.map((item, index) => (
                            <div
                              key={item}
                              className='flex flex-row w-1/5 items-center justify-between'
                            >
                              <p>{item}</p>
                              <div className='flex flex-row items-center '>
                                <PencilIcon
                                  className='h-6 w-6 text-gray-600 hover:fill-gray-300 cursor-pointer mr-6'
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
                                  className='text-2xl cursor-pointer text-red-400 hover:text-red-500'
                                  onClick={() =>
                                    handleDeleteItem('menu', menu, index)
                                  }
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ))}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
          {(!view || view === 'tables') && (
            <Card className={`${!view ? 'cursor-pointer' : ''}`}>
              <CardHeader>
                <div className='flex flex-row items-center justify-between'>
                  <CardTitle view={view}>Tables</CardTitle>
                  {view && (
                    <Button
                      className='bg-red-500 hover:bg-red-600 text-white'
                      onClick={() => openNewModal('Reservation')}
                    >
                      Reserve a Table
                    </Button>
                  )}
                </div>
                <CardDescription view={view}>
                  List of table reservations.
                </CardDescription>
              </CardHeader>
              <CardContent view={view}>
                <ul className='space-y-2'>
                  {loading && (
                    <div className='text-left text-gray-500'>Loading...</div>
                  )}
                  {!view
                    ? restaurantTables
                        ?.sort((a, b) => a.id - b.id)
                        .slice(0, 5)
                        ?.map((table) => (
                          <li key={table.id}>
                            Table #{table.number}: {table.status}
                          </li>
                        ))
                    : restaurantTables
                        ?.sort((a, b) => a.id - b.id)
                        .map((table) => (
                          <li key={table.id} className='flex flex-row'>
                            Table #{table.number}: {table.status} - Number of
                            guests: {table.capacity}
                            <div className='flex flex-row items-center'>
                              <PencilIcon
                                className='h-6 w-6 text-gray-600 hover:fill-gray-300 cursor-pointer mr-4 ml-6'
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
                                className='text-2xl cursor-pointer text-red-400 hover:text-red-500'
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
              </CardContent>
            </Card>
          )}
          {(!view || view === 'orders') && (
            <Card className={`${!view ? 'cursor-pointer' : ''}`}>
              <CardHeader>
                <div className='flex flex-row items-center justify-between'>
                  <CardTitle view={view}>Orders</CardTitle>
                  {view && (
                    <Button
                      className='bg-blue-500 hover:bg-blue-600 text-white'
                      onClick={() => openNewModal('Order')}
                    >
                      Add New Order
                    </Button>
                  )}
                </div>
                <CardDescription view={view}>
                  List of current orders.
                </CardDescription>
              </CardHeader>
              <CardContent view={view}>
                <ul className={`${view ? 'space-y-4' : 'space-y-2'}`}>
                  {loading && (
                    <div className='text-left text-gray-500'>Loading...</div>
                  )}
                  {!view
                    ? restaurantOrders
                        ?.sort((a, b) => a.number - b.number)
                        .slice(0, 5)
                        ?.map((order) => (
                          <li key={order.id}>
                            Order #{order.number}: {order.items?.join(', ')}
                          </li>
                        ))
                    : restaurantOrders
                        ?.sort((a, b) => a.number - b.number)
                        ?.map((order) => (
                          <li
                            key={order.id}
                            className='flex flex-col md:flex-row md:items-center mb-4'
                          >
                            <span className='mb-2 md:mr-2'>
                              Order #{order.number}:
                            </span>
                            <ul className='flex flex-col md:flex-row flex-wrap'>
                              {order.items?.map((item, index) => (
                                <div
                                  key={index}
                                  className='flex flex-row items-center mb-2 md:mb-0 md:mr-4'
                                >
                                  <p className='ml-4'>{item}</p>
                                  <div className='flex flex-row items-center ml-2'>
                                    <PencilIcon
                                      className='h-6 w-6 text-gray-600 hover:fill-gray-300 cursor-pointer mr-2'
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
                                      className='text-2xl cursor-pointer text-red-400 hover:text-red-500'
                                      onClick={() =>
                                        handleDeleteItem('orders', order, index)
                                      }
                                    >
                                      X
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </ul>
                          </li>
                        ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </main>
      )}

      {showNewModal && (
        <NewModal
          setShowNewModal={setShowNewModal}
          selected={selected}
          restaurantId={restaurantId}
          fetchRestaurantsData={fetchRestaurantsData}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          selected={selected}
          fetchRestaurantsData={fetchRestaurantsData}
        />
      )}
    </>
  )
}
