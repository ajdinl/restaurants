import { getUser, deleteArrayItem, deleteItem } from '@/utils/supabaseMethods'

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

export const handleDeleteItem = async (
  category,
  selected,
  index,
  fetchRestaurantsData
) => {
  let selectedArray = selected.items
  let displayError
  const text = `Are you sure you want to delete this item?`

  if (index) {
    if (confirm(text) === true) {
      selectedArray = selectedArray.filter((_, i) => i !== index)
    } else {
      return
    }

    const { data, error } = await deleteArrayItem(
      category,
      selected.id,
      selectedArray
    )
    displayError = error
  }

  if (!index) {
    if (confirm(text) === true) {
      const { data, error } = await deleteItem(category, selected.id)
      displayError = error
    } else {
      return
    }
  }

  if (displayError) {
    console.error('Error deleting item:', displayError)
    return
  } else {
    fetchRestaurantsData()
  }
}
