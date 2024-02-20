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

const fetchRestaurants = async (userId) => {
  let query = supabase
    .from('restaurants')
    .select('*, menu(*), tables(*), orders(*), reservations(*)')

  if (userId) {
    query = query.eq('user_id', userId).single()
  }

  return query
}

const fetchRestaurant = async (id) => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*, menu(*), tables(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

const updateOrDeleteArrayItem = async (category, id, items) => {
  const { data, error } = await supabase
    .from(category)
    .update({ items })
    .eq('id', id)

  return { data, error }
}

const deleteItem = async (category, id) => {
  const { data, error } = await supabase.from(category).delete().eq('id', id)
  return { data, error }
}

const addItem = async (category, data) => {
  const { data: item, error } = await supabase.from(category).insert(data)
  return { item, error }
}

const updateItem = async (category, id, name, value) => {
  const { data: item, error } = await supabase
    .from(category)
    .update({ [name]: value })
    .eq('id', id)
  return { item, error }
}

export {
  createUser,
  getUser,
  signInWithPassword,
  fetchRestaurants,
  deleteItem,
  addItem,
  updateItem,
  updateOrDeleteArrayItem,
  fetchRestaurant,
}
