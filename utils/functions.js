import {
  getUser,
  fetchRestaurants,
  deleteArrayItem,
  deleteItem,
} from '@/utils/supabaseMethods'

export const fetchUserData = async (setUser) => {
  try {
    const { data, error } = await getUser()
    if (error) {
      console.error('Error fetching user:', error)
      return
    }
    setUser(data)
  } catch (error) {
    console.error('Error fetching user:', error)
  }
}

export const fetchRestaurantsData = async ({ setLoading, setData, userId }) => {
  setLoading(true)
  try {
    const { data, error } = await fetchRestaurants(userId)

    if (error) {
      console.error('Error fetching restaurant:', error)
      return
    }
    setLoading(false)
    setData(data)
  } catch (error) {
    console.error('Error fetching restaurant:', error)
  }
}

export const handleDeleteItem = async (
  category,
  selected,
  index,
  fetchRestaurantsData
) => {
  let selectedArray = selected.items
  let displayError

  if (index) {
    selectedArray = selectedArray.filter((_, i) => i !== index)

    const { data, error } = await deleteArrayItem(
      category,
      selected.id,
      selectedArray
    )
    displayError = error
  }

  if (!index) {
    const { data, error } = await deleteItem(category, selected.id)
    displayError = error
  }

  if (displayError) {
    console.error('Error deleting item:', displayError)
    return
  } else {
    fetchRestaurantsData()
  }
}
