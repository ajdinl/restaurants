'use client'

import { useState } from 'react'
import {
  addNewTable,
  updateArrayItem,
  addNewMenu,
  addNewOrder,
  addNewReservation,
} from '@/utils/supabaseMethods'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components'

export default function NewModal({
  setShowNewModal,
  selected,
  isAdmin,
  restaurantId,
  fetchRestaurantsData,
  restaurants,
}) {
  const [table, setTable] = useState({})
  const [dish, setDish] = useState(null)
  const [error, setError] = useState('')

  const handleSave = async () => {
    if (selected.category === 'Table') {
      handleTableSave()
    } else if (selected.category === 'Dish') {
      handleDishSave()
    } else if (selected.category === 'Menu') {
      handleMenuSave()
    } else if (selected.category === 'Order') {
      handleOrderSave()
    } else if (selected.category === 'Order Dish') {
      handeOrderDishSave()
    } else if (selected.category === 'Reservation') {
      handleReservationSave()
    }
  }

  const handleTableSave = async () => {
    if ((isAdmin && !table.restaurant_id) || !table.capacity) {
      setError('Please select field')
      return
    }
    if (!table.restaurant_id) {
      table.restaurant_id = restaurantId
    }

    if (!table.number) {
      let newTableNumber
      if (isAdmin) {
        const tables = restaurants.filter(
          (restaurant) => restaurant.id == Number(table.restaurant_id)
        )[0].tables
        const lastTable = tables[tables.length - 1]
        newTableNumber = lastTable.number + 1
      } else {
        const tables = selected.tables
        const lastTable = tables[tables.length - 1]
        newTableNumber = lastTable.number + 1
      }

      table.number = newTableNumber
    }

    const { data, error } = await addNewTable(table)
    if (error) {
      console.error('Error adding item:', error)
      return
    } else {
      fetchRestaurantsData()
      setShowNewModal(false)
    }
  }

  const handleDishSave = async () => {
    if (!dish) {
      setError('Please fill name of the dish')
      return
    }

    const selectedArray = [...selected.menu.items]
    selectedArray.push(dish)

    const { data, error } = await updateArrayItem(
      'menu',
      selected.menu.id,
      selectedArray
    )
    if (error) {
      console.error('Error adding item:', error)
      return
    } else {
      fetchRestaurantsData()
      setShowNewModal(false)
    }
  }

  const handleMenuSave = async () => {
    const { restaurantId, menuNumber } = selected

    const { data, error } = await addNewMenu(restaurantId, menuNumber)
    if (error) {
      console.error('Error adding item:', error)
      return
    } else {
      fetchRestaurantsData()
      setShowNewModal(false)
    }
  }

  const handleOrderSave = async () => {
    const { restaurantId, orderNumbers } = selected
    const tableNumber = table.table_number
    const orderNumber = orderNumbers[orderNumbers.length - 1] + 1

    if (!tableNumber) {
      setError('Please select table')
      return
    }

    const { data, error } = await addNewOrder(
      restaurantId,
      tableNumber,
      orderNumber
    )
    if (error) {
      console.error('Error adding item:', error)
      return
    } else {
      fetchRestaurantsData()
      setShowNewModal(false)
    }
  }

  const handeOrderDishSave = async () => {
    if (!dish) {
      setError('Please fill name of the dish')
      return
    }

    const selectedArray = Array.isArray(selected.order.items)
      ? [...selected.order.items]
      : []
    selectedArray.push(dish)

    const { data, error } = await updateArrayItem(
      'orders',
      selected.order.id,
      selectedArray
    )
    if (error) {
      console.error('Error adding item:', error)
      return
    } else {
      fetchRestaurantsData()
      setShowNewModal(false)
    }
  }

  const handleReservationSave = async () => {
    if (table.restaurant_id) {
      const filterRestarurant = restaurants.filter((restaurant) => {
        return restaurant.id == table.restaurant_id
      })
      const reservationNumber = filterRestarurant[0].reservations.length + 1
      table.number = reservationNumber
    }
    const { data, error } = await addNewReservation(table)
    if (error) {
      console.error('Error adding item:', error)
      return
    } else {
      fetchRestaurantsData()
      setShowNewModal(false)
    }
  }

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-1/4 min-w-96 my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-800 dark:shadow-md dark:shadow-gray-500/50 outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold dark:text-white'>
                New Modal
              </h3>
              <button
                className='p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => setShowNewModal(false)}
              >
                X
              </button>
            </div>
            <div className='relative p-6 flex-auto'>
              <Card>
                <CardHeader>
                  <CardTitle>New {selected.category}</CardTitle>
                  <CardDescription>
                    Add a new {selected.category}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selected.category === 'Table' && (
                    <form className='space-y-4'>
                      {isAdmin && (
                        <label className='block'>
                          <span className='text-gray-700 dark:text-gray-400'>
                            Restaurant
                          </span>
                          <span className='text-red-500 ml-4 text-sm'>
                            {!table.restaurant_id && error}
                          </span>
                          <select
                            onChange={(e) =>
                              setTable({
                                ...table,
                                restaurant_id: e.target.value,
                              })
                            }
                            className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                          >
                            <option></option>
                            {restaurants.map((restaurant) => (
                              <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label className='block'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Maximum Capacity
                        </span>
                        <span className='text-red-500 ml-4 text-sm'>
                          {!table.capacity && error}
                        </span>
                        <select
                          onChange={(e) =>
                            setTable({ ...table, capacity: e.target.value })
                          }
                          className='mt-1 block w-full rounded border-gray-300 bg-gray-100 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
                          <option></option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                          <option>10</option>
                        </select>
                      </label>
                    </form>
                  )}
                  {selected.category === 'Reservation' && (
                    <form className='space-y-4'>
                      {isAdmin && (
                        <label className='block'>
                          <span className='text-gray-700 dark:text-gray-400'>
                            Restaurant
                          </span>
                          <span className='text-red-500 ml-4 text-sm'>
                            {!table.restaurant_id && error}
                          </span>
                          <select
                            onChange={(e) =>
                              setTable({
                                ...table,
                                restaurant_id: e.target.value,
                              })
                            }
                            className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                          >
                            <option></option>
                            {restaurants.map((restaurant) => (
                              <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label className='block'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Table Number
                        </span>
                        <span className='text-red-500 ml-4 text-sm'>
                          {!table.number && error}
                        </span>
                        <select
                          onChange={(e) =>
                            setTable({ ...table, table_number: e.target.value })
                          }
                          className='mt-1 block w-full rounded dark:bg-gray-400 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
                          <option></option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                          <option>10</option>
                        </select>
                      </label>
                      <label className='block'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Status
                        </span>
                        <span className='text-red-500 ml-4 text-sm'>
                          {!table.status && error}
                        </span>
                        <select
                          onChange={(e) =>
                            setTable({ ...table, status: e.target.value })
                          }
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
                          <option></option>
                          <option>Available</option>
                          <option>Reserved</option>
                        </select>
                      </label>
                      <label className='block'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Number of Guests
                        </span>
                        <span className='text-red-500 ml-4 text-sm'>
                          {!table.capacity && error}
                        </span>
                        <select
                          onChange={(e) =>
                            setTable({ ...table, capacity: e.target.value })
                          }
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
                          <option></option>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                          <option>9</option>
                          <option>10</option>
                        </select>
                      </label>
                    </form>
                  )}
                  {(selected.category === 'Dish' ||
                    selected.category === 'Order Dish') && (
                    <form className='space-y-4'>
                      <label className='block'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Name
                        </span>
                        <span className='text-red-500 ml-4 text-sm'>
                          {!dish && error}
                        </span>
                        <input
                          type='text'
                          onChange={(e) => setDish(e.target.value)}
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        />
                      </label>
                    </form>
                  )}
                  {selected.category === 'Menu' && (
                    <form className='space-y-4'>
                      <Button
                        className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                        onClick={() => handleMenuSave()}
                      >
                        Add
                      </Button>
                    </form>
                  )}
                  {selected.category === 'Order' && (
                    <form className='flex flex-col space-y-4'>
                      {isAdmin && (
                        <select
                          onChange={(e) =>
                            setTable({ ...table, table_number: e.target.value })
                          }
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
                          <option></option>
                          {restaurants
                            ?.filter(
                              (restaurant) =>
                                restaurant.id === selected.restaurantId
                            )
                            .map((restaurant) =>
                              restaurant.tables.map((table) => (
                                <option key={table.id} value={table.number}>
                                  Table #{table.number}
                                </option>
                              ))
                            )}
                        </select>
                      )}
                      {!isAdmin && (
                        <select
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                          onChange={(e) =>
                            setTable({ ...table, table_number: e.target.value })
                          }
                        >
                          <option></option>
                          {selected.tables?.map((table) => (
                            <option key={table.id} value={table.number}>
                              Table #{table.number}
                            </option>
                          ))}
                        </select>
                      )}
                      <span className='text-red-500 text-sm'>{error}</span>
                      <Button
                        className='w-20 bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                        onClick={() => handleOrderSave()}
                      >
                        Add
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
              <Button
                className='text-red-500 background-transparent font-bold uppercase px-6 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setShowNewModal(false)}
              >
                Close
              </Button>
              <Button
                className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => handleSave()}
              >
                {selected.category === 'Menu' || selected.category === 'Order'
                  ? 'Add'
                  : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}
