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
    .select('*, menu(*), orders(*), tables(*)')

  if (userId) {
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

const deleteArrayItem = async (category, id, array) => {
  const { data, error } = await supabase
    .from(category)
    .update({ items: array })
    .eq('id', id)

  return { data, error }
}

const deleteItem = async (category, id) => {
  const { data, error } = await supabase.from(category).delete().eq('id', id)
  return { data, error }
}

const updateArrayItem = async (category, id, array) => {
  const { data, error } = await supabase
    .from(category)
    .update({ items: array })
    .eq('id', id)
  return { data, error }
}

const updateTable = async (category, id, status, capacity) => {
  const { data: item, error } = await supabase
    .from(category)
    .update({ status, capacity })
    .eq('id', id)
  return { item, error }
}

const addNewReservation = async (data) => {
  const { data: item, error } = await supabase.from('tables').insert(data)
  return { item, error }
}

export {
  createUser,
  getUser,
  signInWithPassword,
  fetchRestaurants,
  createRestaurant,
  deleteArrayItem,
  deleteItem,
  updateTable,
  updateArrayItem,
  addNewReservation,
}
