'use client'

import { useState } from 'react'
import { createUser } from '@/utils/supabaseMethods'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/Button'

export default function NewUserForm() {
  const [newUser, setNewUser] = useState({})
  const router = useRouter()

  async function handleSubmit(e) {
    e.preventDefault()

    const email = newUser.email
    const password = newUser.password
    const user_metadata = newUser.metadata

    try {
      const { data, error } = await createUser(email, password, user_metadata)

      if (error) {
        alert(error.message)
      } else {
        setNewUser({})
        e.target.reset()
        router.push('/admin-dashboard?view=users')
      }
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  return (
    <form className='space-y-4' onSubmit={(e) => handleSubmit(e)}>
      <label className='block'>
        <span className='text-gray-700'>Email</span>
        <input
          className='mt-1 p-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          type='email'
          name='email'
          id='email'
          required
          min={5}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
      </label>
      <label className='block'>
        <span className='text-gray-700'>Password</span>
        <input
          className='mt-1 p-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          type='password'
          name='password'
          id='password'
          required
          min={8}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        />
      </label>
      <label className='block'>
        <span className='text-gray-700'>Full Name</span>
        <input
          className='mt-1 p-1 block w-full rounded-md border-gray-300 shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
          type='text'
          name='full_name'
          id='full_name'
          min={5}
          required
          onChange={(e) =>
            setNewUser({
              ...newUser,
              metadata: {
                ...newUser.metadata,
                full_name: e.target.value,
              },
            })
          }
        />
      </label>
      <label className='flex items-center'>
        <input
          className='form-checkbox h-5 w-5 text-indigo-600'
          type='checkbox'
          name='is_admin'
          min={8}
          onChange={(e) =>
            setNewUser({
              ...newUser,
              metadata: {
                ...newUser.metadata,
                is_admin: e.target.checked,
              },
            })
          }
        />
        <span className='ml-2 text-gray-700'>Moderator</span>
      </label>
      <Button type='submit' className='mt-4 bg-purple-500 text-white'>
        Add New User
      </Button>
    </form>
  )
}
