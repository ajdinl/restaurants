import { supabase } from '@/utils/supabaseClient'

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

const createRestaurant = async (name, address, phone) => {
  const { data, error } = await supabase.from('restaurants').insert({
    name,
    address,
    phone,
  })
  return { data, error }
}

export {
  createUser,
  getUser,
  signInWithPassword,
  fetchRestaurants,
  createRestaurant,
}
