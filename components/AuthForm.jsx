'use client'

import { useState } from 'react'
import { getUser, signInWithPassword } from '@/utils/supabaseMethods'
import { useRouter } from 'next/navigation'
import { Button } from '@/components'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    const { error } = await signInWithPassword(email, password)

    if (error) {
      alert(error.message)
    } else {
      const {
        data: { user },
      } = await getUser()

      const isAdmin = user.user_metadata.is_admin

      if (isAdmin === true) {
        router.push('/admin-dashboard')
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className='space-y-6 w-full md:w-11/12 mx-auto text-center'
    >
      <input
        type='email'
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
        placeholder='Email'
      />
      <input
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className='appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500'
        placeholder='Password'
      />
      <Button
        type='submit'
        className='text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600'
      >
        Sign In
      </Button>
    </form>
  )
}
