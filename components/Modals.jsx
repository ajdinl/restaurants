'use client'

import { useState } from 'react'
import {
  addNewReservation,
  updateTableStatus,
  updateArrayItem,
} from '@/utils/supabaseMethods'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components'

export function NewModal({
  setShowNewModal,
  selected,
  isAdmin,
  restaurantId,
  fetchRestaurantsData,
  restaurants,
}) {
  const [table, setTable] = useState({
    restaurant_id: restaurantId,
    status: 'Reserved',
  })

  const handleSave = async () => {
    if (!table.number || !table.capacity) {
      return
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

export function EditModal({
  setShowEditModal,
  selected,
  fetchRestaurantsData,
}) {
  const [status, setStatus] = useState(selected.status)
  const [selectedItem, setSelectedItem] = useState(selected.item)
  const [openDropdown, setOpenDropdown] = useState(false)

  const handleUpdateTableStatus = async (category, selected, data) => {
    const { data: item, error } = await updateTableStatus(
      category,
      selected.id,
      data
    )
    if (error) {
      console.error('Error updating item:', error)
      return
    } else {
      fetchRestaurantsData()
    }
  }

  const handleUpdateArrayItem = async (category, selected, selectedItem) => {
    let selectedArray = [...selected.items]

    if (selectedItem) {
      if (selectedArray[selected.index] === selectedItem) {
        return
      }
      selectedArray[selected.index] = selectedItem
    }

    const { data: item, error } = await updateArrayItem(
      category,
      selected.id,
      selectedArray
    )
    if (error) {
      console.error('Error updating item:', error)
      return
    } else {
      fetchRestaurantsData()
    }
  }

  const handleSave = () => {
    setShowEditModal(false)
    if (!selectedItem && !status) {
      return
    }
    if (selectedItem) {
      handleUpdateArrayItem(selected.category, selected, selectedItem)
      return
    }
    if (status) {
      handleUpdateTableStatus(selected.category, selected, status)
    }
  }

  const handleOpen = () => {
    setOpenDropdown(!openDropdown)
  }

  const setStatusValue = (value) => {
    setStatus(value)
    setOpenDropdown(false)
  }

  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold'>Edit Modal</h3>
              <button
                className='p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => setShowEditModal(false)}
              >
                X
              </button>
            </div>
            {status && (
              <div className='relative p-6 flex-auto'>
                <div className='dropdown'>
                  <Button
                    className={
                      status === 'Available'
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-red-500 hover:bg-red-600 text-white'
                    }
                    onClick={handleOpen}
                  >
                    {status}
                  </Button>
                  {openDropdown && (
                    <ul className='menu'>
                      {status === 'Available' && (
                        <li
                          className='menu-item'
                          onClick={() => setStatusValue('Reserved')}
                        >
                          <Button className='mt-4 bg-red-500 hover:bg-red-600 text-white'>
                            Reserved
                          </Button>
                        </li>
                      )}
                      {status === 'Reserved' && (
                        <li
                          className='menu-item'
                          onClick={() => setStatusValue('Available')}
                        >
                          <Button className='mt-4 bg-green-500 hover:bg-green-600 text-white'>
                            Available
                          </Button>
                        </li>
                      )}
                    </ul>
                  )}
                </div>
              </div>
            )}
            {selectedItem && (
              <div className='relative p-6 flex-auto'>
                <form className='w-full'>
                  <input
                    type='text'
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    placeholder='Item'
                    className='w-full p-2 border border-gray-300 rounded'
                  />
                </form>
              </div>
            )}
            <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
              <button
                className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setShowEditModal(false)}
              >
                Close
              </button>
              <button
                className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => handleSave()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}

export function DeleteModal({ setShowModal }) {
  return (
    <>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold'>Delete Modal</h3>
              <button
                className='p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => setShowModal(false)}
              >
                X
              </button>
            </div>
            {/* <div className='relative p-6 flex-auto'>
              <p className='my-4 text-blueGray-500 text-lg leading-relaxed'>
                I always felt like I could do anything. That’s the main thing
                people are controlled by! Thoughts- their perception of
                themselves! They're slowed down by their perception of
                themselves. If you're taught you can’t do anything, you won’t do
                anything. I was taught I could do everything.
              </p>
            </div> */}
            <div className='relative p-6 flex-auto'>
              <p>Are you sure you want to delete?</p>
            </div>
            <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
              <button
                className='text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              <button
                className='bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setShowModal(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
    </>
  )
}
