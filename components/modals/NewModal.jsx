'use client'

import { useState } from 'react'
import { addNewReservation } from '@/utils/supabaseMethods'
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

  const handleReservationSave = async () => {
    if (!table.number || !table.capacity) {
      return
    }
    if (!table.restaurant_id) {
      table.restaurant_id = restaurantId
    }
    if (!table.status) {
      table.status = 'Reserved'
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
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold'>New Modal</h3>
              <button
                className='p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => setShowNewModal(false)}
              >
                X
              </button>
            </div>
            <div className='relative p-6 flex-auto'>
              <Card>
                <CardHeader>
                  <CardTitle>New {selected}</CardTitle>
                  <CardDescription>Add a new {selected}.</CardDescription>
                </CardHeader>
                <CardContent>
                  {selected === 'Reservation' && (
                    <form className='space-y-4'>
                      {isAdmin && (
                        <label className='block'>
                          <span className='text-gray-700'>Restaurant</span>
                          <select
                            onChange={(e) =>
                              setTable({
                                ...table,
                                restaurant_id: e.target.value,
                              })
                            }
                            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                          >
                            {restaurants.map((restaurant) => (
                              <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                              </option>
                            ))}
                          </select>
                        </label>
                      )}
                      <label className='block'>
                        <span className='text-gray-700'>Table Number</span>
                        <select
                          defaultValue='1'
                          onChange={(e) =>
                            setTable({ ...table, number: e.target.value })
                          }
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
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
                        <span className='text-gray-700'>Number of Guests</span>
                        <select
                          onChange={(e) =>
                            setTable({ ...table, capacity: e.target.value })
                          }
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
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
                        <span className='text-gray-700'>Status</span>
                        <select
                          onChange={(e) =>
                            setTable({ ...table, status: e.target.value })
                          }
                          className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        >
                          <option>Reserved</option>
                        </select>
                      </label>
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
                onClick={() => handleReservationSave()}
              >
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}
