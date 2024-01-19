'use client'

import { createBrowserClient } from '@supabase/ssr'

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

const createUser = async (email, password, user_metadata) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: user_metadata?.full_name,
        is_admin: user_metadata?.is_admin,
      },
    },
  })

  return { data, error }
}
const getUser = async () => {
  const { data, error } = await supabase.auth.getUser()
  return { data, error }
}

const signInWithPassword = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  return { data, error }
}

const fetchRestaurants = async (isAdmin, userId) => {
  let query = supabase
    .from('restaurants')
    .select('*, restaurant_menu(*), restaurant_orders(*), restaurant_tables(*)')

  if (!isAdmin) {
    query = query.eq('user_id', userId).single()
  }

  return query
}

export { supabase, getUser, signInWithPassword, fetchRestaurants, createUser }
