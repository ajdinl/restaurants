import { useState } from 'react'
import { Button } from '@/components'
import { addItem } from '@/utils/supabaseMethods'

export default function NewRestaurantForm() {
  const [newRestaurant, setNewRestaurant] = useState({})

  async function handleSubmit(e) {
    e.preventDefault()

    const name = newRestaurant.name
    const address = newRestaurant.address
    const phone = newRestaurant.phone

    try {
      const { data, error } = await addItem('restaurants', {
        name,
        address,
        phone,
      })

      if (error) {
        console.error('Error creating restaurant:', error)
        return
      } else {
        setNewRestaurant({})
        e.target.reset()
      }
    } catch (error) {
      console.error('Error creating restaurant:', error)
    }
  }

  return (
    <form className='space-y-4' onSubmit={(e) => handleSubmit(e)}>
      <label className='block'>
        <span className='text-gray-700 dark:text-gray-400'>Name</span>
        <input
          className='mt-1 p-1 block w-full rounded border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          type='text'
          name='name'
          id='name'
          required
          min={3}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, name: e.target.value })
          }
        />
      </label>
      <label className='block'>
        <span className='text-gray-700 dark:text-gray-400'>Address</span>
        <input
          className='mt-1 p-1 block w-full rounded border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          type='text'
          name='address'
          id='address'
          required
          min={3}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, address: e.target.value })
          }
        />
      </label>
      <label className='block'>
        <span className='text-gray-700 dark:text-gray-400'>Phone Number</span>
        <input
          className='mt-1 p-1 block w-full rounded border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          type='tel'
          name='phone'
          id='phone'
          required
          min={8}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, phone: e.target.value })
          }
        />
      </label>
      <Button type='submit' className='mt-4 bg-sky-500 text-white'>
        Add New Restaurant
      </Button>
    </form>
  )
}
