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

const addNewTable = async (data) => {
  const { data: item, error } = await supabase.from('tables').insert(data)
  return { item, error }
}

const addNewMenu = async (restaurantId, menuNumber) => {
  const { data: item, error } = await supabase
    .from('menu')
    .insert({ restaurant_id: restaurantId, number: menuNumber })
  return { item, error }
}

const addNewOrder = async (restaurantId, tableNumber, orderNumber) => {
  const { data: item, error } = await supabase.from('orders').insert({
    restaurant_id: restaurantId,
    table_number: tableNumber,
    number: orderNumber,
  })
  return { item, error }
}

const addNewReservation = async (data) => {
  const { data: item, error } = await supabase.from('reservations').insert(data)
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
  createRestaurant,
  deleteArrayItem,
  deleteItem,
  updateArrayItem,
  addNewTable,
  addNewMenu,
  addNewOrder,
  addNewReservation,
  updateItem,
}
