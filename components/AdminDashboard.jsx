'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  NewUserForm,
  NewRestaurantForm,
  EditModal,
  NewModal,
  DeleteModal,
  Restaurants,
} from '@/components'
import { fetchUserData, fetchRestaurantsData } from '@/utils/functions'

export default function AdminDashboardComponent() {
  const [user, setUser] = useState(null)
  const [restaurants, setRestaurants] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const searchParams = useSearchParams()
  const view = searchParams.get('view')

  const getRestaurantsData = async () => {
    fetchRestaurantsData({
      setLoading: () => {},
      setData: setRestaurants,
      userId: null,
    })
  }

  const setEditSelectedItem = (item) => {
    setSelected(item)
    setShowEditModal(true)
  }

  const setDeleteSelectedItem = (item) => {
    setSelected(item)
    setShowDeleteModal(true)
  }

  const openNewModal = (itemDetails) => {
    setShowNewModal(true)
    setSelected(itemDetails)
  }

  useEffect(() => {
    fetchUserData(setUser)
  }, [])

  useEffect(() => {
    if (user) {
      getRestaurantsData()
    }
  }, [user])

  return (
    <div>
      <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 bg-white dark:bg-gray-900 text-black dark:text-white'>
        {!view && (
          <div className='text-3xl text-center'>
            Welcome to the Admin Dashboard
          </div>
        )}
        {view === 'restaurants' && (
          <Card>
            <CardHeader>
              <CardTitle>Restaurants</CardTitle>
              <CardDescription>List of all restaurants.</CardDescription>
            </CardHeader>
            <CardContent>
              <Restaurants
                restaurants={restaurants}
                openNewModal={openNewModal}
                setEditSelectedItem={setEditSelectedItem}
                setDeleteSelectedItem={setDeleteSelectedItem}
              />
            </CardContent>
          </Card>
        )}
        {view === 'create' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Users</CardTitle>
                <CardDescription>Add a new user.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewUserForm />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Restaurant</CardTitle>
                <CardDescription>Add a new restaurant.</CardDescription>
              </CardHeader>
              <CardContent>
                <NewRestaurantForm />
              </CardContent>
            </Card>
          </>
        )}
      </main>
      {showNewModal && (
        <NewModal
          setShowNewModal={setShowNewModal}
          selected={selected}
          isAdmin={true}
          fetchRestaurantsData={getRestaurantsData}
          restaurants={restaurants}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          selected={selected}
          fetchRestaurantsData={getRestaurantsData}
        />
      )}
      {showDeleteModal && (
        <DeleteModal
          setShowDeleteModal={setShowDeleteModal}
          selected={selected}
          getRestaurantsData={getRestaurantsData}
        />
      )}
    </div>
  )
}
