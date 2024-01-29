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
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const isAdmin = user?.user?.user_metadata.is_admin
  const userId = user?.user?.id
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

  const openNewTableModal = (category) => {
    setShowNewModal(true)
    setSelected(category)
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
        {(!view || view === 'menu') && !isAdmin && (
          <Card className={`${!view ? 'cursor-pointer' : ''}`}>
            <CardHeader>
              <div className='flex flex-row items-center justify-between'>
                <CardTitle view={view}>Menu</CardTitle>
                {view && (
                  <Button
                    className='bg-green-500 hover:bg-green-600 text-white'
                    onClick={() => openNewTableModal('Dish')}
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
              <ul className='space-y-6'>
                {data &&
                  restaurantMenu?.map((menu) => (
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
                                  className='h-6 w-6 text-gray-600 cursor-pointer mr-6'
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
                                  className='text-2xl cursor-pointer text-red-500'
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
        {(!view || view === 'tables') && !isAdmin && (
          <Card className={`${!view ? 'cursor-pointer' : ''}`}>
            <CardHeader>
              <div className='flex flex-row items-center justify-between'>
                <CardTitle view={view}>Tables</CardTitle>
                {view && (
                  <Button
                    className='bg-red-500 hover:bg-red-600 text-white'
                    onClick={() => openNewTableModal('Reservation')}
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
                {data && !view
                  ? restaurantTables?.slice(0, 5)?.map((table) => (
                      <li key={table.id}>
                        Table #{table.number}: {table.status}
                      </li>
                    ))
                  : restaurantTables?.map((table) => (
                      <li key={table.id} className='flex flex-row'>
                        Table #{table.number}: {table.status}
                        <div className='flex flex-row items-center'>
                          <PencilIcon
                            className='h-6 w-6 text-gray-600 cursor-pointer mr-4 ml-6'
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
                            className='text-2xl cursor-pointer text-red-500'
                            onClick={() => handleDeleteItem('tables', table)}
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
        {(!view || view === 'orders') && !isAdmin && (
          <Card className={`${!view ? 'cursor-pointer' : ''}`}>
            <CardHeader>
              <div className='flex flex-row items-center justify-between'>
                <CardTitle view={view}>Orders</CardTitle>
                {view && (
                  <Button
                    className='bg-blue-500 hover:bg-blue-600 text-white'
                    onClick={() => openNewTableModal('Order')}
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
                {data && !view
                  ? restaurantOrders?.slice(0, 5)?.map((order) => (
                      <li key={order.id}>
                        Order #{order.number}: {order.items?.join(', ')}
                      </li>
                    ))
                  : restaurantOrders?.map((order) => (
                      <li
                        key={order.id}
                        className='flex flex-col md:flex-row md:items-center mb-4'
                      >
                        <span className='mb-2 md:mr-2'>
                          Order #{order.number}:
                        </span>
                        <ul className='flex flex-col md:flex-row flex-wrap'>
                          {order.items.map((item, index) => (
                            <div
                              key={index}
                              className='flex flex-row items-center mb-2 md:mb-0 md:mr-4'
                            >
                              <p className='ml-4'>{item}</p>
                              <div className='flex flex-row items-center ml-2'>
                                <PencilIcon
                                  className='h-6 w-6 text-gray-600 cursor-pointer mr-2'
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
                                  className='text-2xl cursor-pointer text-red-500'
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
                    <p className='text-4xl w-44'>{restaurant.name}</p>
                    <ul className='border-l-2 border-gray-600 p-4 w-64'>
                      <p className='text-2xl'>Menu</p>
                      {restaurant.menu
                        .sort((a, b) => a.number - b.number)
                        .map((menu) => (
                          <li key={menu.id}>
                            <p className='mb-2'>Menu #{menu.number}</p>
                            <ul>
                              {menu.items.map((item, index) => (
                                <li
                                  key={index}
                                  className='flex flex-row justify-between border-b border-gray-600 w-60'
                                >
                                  <p>{item}</p>
                                  <div className='flex flex-row items-center'>
                                    <PencilIcon
                                      className='h-4 w-4 text-gray-600 cursor-pointer'
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
                                      className='ml-2 cursor-pointer text-red-500'
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
                      <p className='text-2xl'>Tables</p>
                      {restaurant.tables
                        .sort((a, b) => a.number - b.number)
                        .map((table) => (
                          <li
                            key={table.id}
                            className='flex flex-row justify-between border-b border-gray-600 w-60'
                          >
                            <p>
                              Table #{table.number} - {table.status}
                            </p>
                            <div className='flex flex-row items-center'>
                              <PencilIcon
                                className='h-4 w-4 text-gray-600 cursor-pointer'
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
                                className='ml-2 cursor-pointer text-red-500'
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
                      <p className='text-2xl mr-2'>Orders</p>
                      {restaurant.orders
                        .sort((a, b) => a.number - b.number)
                        .map((order) => (
                          <li key={order.id}>
                            <p className='ml-2'>Order #{order.number}:</p>
                            <ul className='mr-2 p-2'>
                              {order.items.map((item, index) => (
                                <li
                                  key={index}
                                  className='flex flex-row justify-between border-b border-gray-600 w-60'
                                >
                                  <p>{item}</p>
                                  <div className='flex flex-row items-center'>
                                    <PencilIcon
                                      className='h-4 w-4 text-gray-600 cursor-pointer'
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
                                      className='ml-2 cursor-pointer text-red-500'
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
      {showNewModal && (
        <NewModal
          setShowNewModal={setShowNewModal}
          selected={selected}
          isAdmin={isAdmin}
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
