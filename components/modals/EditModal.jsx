'use client'

import { useState } from 'react'
import { updateTable, updateArrayItem } from '@/utils/supabaseMethods'
import { Button } from '@/components'

export default function EditModal({
  setShowEditModal,
  selected,
  fetchRestaurantsData,
}) {
  const [status, setStatus] = useState(selected.status)
  const [capacity, setCapacity] = useState(selected.capacity)
  const [selectedItem, setSelectedItem] = useState(selected.item)
  const [openDropdown, setOpenDropdown] = useState(false)

  const handleUpdateTable = async (
    category,
    selected,
    tableStatus,
    tableCapacity
  ) => {
    const { data, error } = await updateTable(
      category,
      selected.id,
      tableStatus,
      tableCapacity
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

  const handleEditSave = () => {
    setShowEditModal(false)
    if (selectedItem) {
      handleUpdateArrayItem(selected.category, selected, selectedItem)
      return
    }
    if (capacity) {
      handleUpdateTable(selected.category, selected, capacity)
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
            {selected.capacity && (
              <div className='relative p-6 flex-auto'>
                {/* <div className='dropdown'>
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
                </div> */}
                <select
                  className='mt-2 p-2 border border-gray-300 rounded'
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
                onClick={() => handleEditSave()}
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