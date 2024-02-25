'use client'

import { useState } from 'react'
import { updateItem, updateOrDeleteArrayItem } from '@/utils/supabaseMethods'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
} from '@/components'

export default function EditModal({
  setShowEditModal,
  selected,
  fetchRestaurantsData,
}) {
  const [status, setStatus] = useState(selected.status)
  const [capacity, setCapacity] = useState(selected.capacity)
  const [selectedItem, setSelectedItem] = useState(selected.item)
  const [openDropdown, setOpenDropdown] = useState(false)

  const handleUpdate = async (category, selected, name, value) => {
    const { data: item, error } = await updateItem(
      category,
      selected.id,
      name,
      value
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

    const { data: item, error } = await updateOrDeleteArrayItem(
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

  const handleEditSave = () => {
    setShowEditModal(false)
    if (selectedItem) {
      handleUpdateArrayItem(selected.category, selected, selectedItem)
      return
    }
    if (selected.capacity !== capacity) {
      handleUpdate(selected.category, selected, 'capacity', capacity)
    }
    if (selected.status !== status) {
      handleUpdate(selected.category, selected, 'status', status)
    }
  }

  const handleOpen = () => {
    setOpenDropdown(!openDropdown)
  }

  const setStatusValue = (value) => {
    setStatus(value)
    setOpenDropdown(false)
  }

  function removeLastChar(str) {
    if (str.charAt(str.length - 1) === 's') {
      return str.slice(0, -1)
    } else {
      return str
    }
  }

  return (
    <>
      <div className='fixed inset-0 z-40 bg-black opacity-80'></div>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4'>
        <div className='relative w-1/4 min-w-96 my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded shadow-lg relative flex flex-col w-full bg-white dark:bg-gray-800 dark:shadow-md dark:shadow-gray-500/50 outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold dark:text-white'>
                Edit Modal
              </h3>
              <button
                className='p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => setShowEditModal(false)}
              >
                X
              </button>
            </div>
            <div className='relative p-6 flex-auto'>
              <Card>
                <CardHeader>
                  <CardTitle>{selected.category.toUpperCase()}</CardTitle>
                  <CardDescription>
                    Edit the {removeLastChar(selected.category)}.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {selected.category === 'tables' && (
                    <label className='block'>
                      <span className='text-gray-700 dark:text-gray-400'>
                        Maximum Capacity
                      </span>
                      <select
                        className='mt-1 block w-full rounded border-gray-300 bg-gray-100 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        defaultValue={capacity}
                        onChange={(e) => setCapacity(e.target.value)}
                      >
                        <option value='1'>1</option>
                        <option value='2'>2</option>
                        <option value='3'>3</option>
                        <option value='4'>4</option>
                        <option value='5'>5</option>
                        <option value='6'>6</option>
                        <option value='7'>7</option>
                        <option value='8'>8</option>
                        <option value='9'>9</option>
                        <option value='10'>10</option>
                      </select>
                    </label>
                  )}
                  {(selected.category === 'orders' ||
                    selected.category === 'menu') && (
                    <form className='w-full space-y-2'>
                      <label className='block'>
                        <span className='text-gray-700 dark:text-gray-400'>
                          Name
                        </span>
                        <input
                          type='text'
                          value={selectedItem.name}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              name: e.target.value,
                            })
                          }
                          placeholder='Name'
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                        />
                      </label>
                      {selected.category === 'menu' && (
                        <>
                          <label className='block'>
                            <span className='text-gray-700 dark:text-gray-400'>
                              Ingredients
                            </span>
                            <input
                              type='text'
                              value={selectedItem.ingredients?.join(', ')}
                              onChange={(e) =>
                                setSelectedItem({
                                  ...selectedItem,
                                  ingredients: [e.target.value],
                                })
                              }
                              placeholder='Ingredients'
                              className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                            />
                          </label>
                          <label className='block'>
                            <span className='text-gray-700 dark:text-gray-400'>
                              Price
                            </span>
                            <input
                              type='number'
                              value={selectedItem.price}
                              onChange={(e) =>
                                setSelectedItem({
                                  ...selectedItem,
                                  price: e.target.value,
                                })
                              }
                              placeholder='Price'
                              className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                            />
                          </label>
                        </>
                      )}
                      {selected.category === 'orders' && (
                        <label className='block'>
                          <span className='text-gray-700 dark:text-gray-400'>
                            Quantity
                          </span>
                          <input
                            type='number'
                            value={selectedItem.quantity}
                            onChange={(e) =>
                              setSelectedItem({
                                ...selectedItem,
                                quantity: e.target.value,
                              })
                            }
                            placeholder='Quantity'
                            className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                          />
                        </label>
                      )}
                    </form>
                  )}
                  {selected.category === 'reservations' && (
                    <form className='w-full'>
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
                      <div className='flex flex-col'>
                        <span className='text-gray-700 dark:text-gray-400 my-2'>
                          Number of Guests
                        </span>
                        <select
                          className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
                          defaultValue={capacity}
                          onChange={(e) => setCapacity(e.target.value)}
                        >
                          <option value='1'>1</option>
                          <option value='2'>2</option>
                          <option value='3'>3</option>
                          <option value='4'>4</option>
                          <option value='5'>5</option>
                          <option value='6'>6</option>
                          <option value='7'>7</option>
                          <option value='8'>8</option>
                          <option value='9'>9</option>
                          <option value='10'>10</option>
                        </select>
                      </div>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
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
                onClick={() => handleEditSave()}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
