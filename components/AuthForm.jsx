'use client'

import { useState } from 'react'
import { supabase } from '@/utils/supabaseClient'
import { useRouter } from 'next/navigation'

export default function AuthForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
    } else {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const fullName = user.user_metadata.full_name

      if (fullName !== 'Admin') {
        router.push('/dashboard')
      } else {
        router.push('/admin-dashboard')
      }
    }
  }

  return (
    <form
      onSubmit={handleLogin}
      className='space-y-6 w-11/12 mx-auto text-center'
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
      <button
        type='submit'
        className='text-blue-400 hover:text-blue-600 border rounded border-blue-400 hover:border-blue-600 px-4 py-2'
      >
        Sign In
      </button>
    </form>
  )
}
