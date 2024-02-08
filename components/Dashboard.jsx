'use client'

import { useState, useEffect } from 'react'
import { fetchRestaurants } from '@/utils/supabaseMethods'
import { useSearchParams } from 'next/navigation'
import { PencilIcon, EditModal, NewModal, DashboardWrapper } from '@/components'
import { fetchUserData, handleDeleteItem } from '@/components/functions'

export default function DashboardComponent() {
  const [user, setUser] = useState(null)
  const [data, setData] = useState([])
  const [showEditModal, setShowEditModal] = useState(false)
  const [selected, setSelected] = useState(null)
  const [showNewModal, setShowNewModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const view = searchParams.get('view')
  const userId = user?.user?.id
  const restaurantId = data?.id
  const restaurantMenu = data?.menu
  const restaurantTables = data?.tables
  const restaurantOrders = data?.orders

  const fetchRestaurantsData = async () => {
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

  const setEditSelectedItem = (item) => {
    setSelected(item)
    setShowEditModal(true)
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
      fetchRestaurantsData()
    }
  }, [user])

  return (
    <>
      {data && (
        <main className='flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10'>
          <DashboardWrapper
            wrapperData={{
              type: 'menu',
              title: 'Menu',
              description: 'List of available dishes and beverages.',
              buttonText: 'Add New Menu',
              view,
              loading,
              openNewModal,
              modalData: {
                category: 'Menu',
                restaurantId,
                menuNumber:
                  restaurantMenu?.map((menu) => menu.number).pop() + 1,
              },
            }}
          >
            <ul className='space-y-6'>
              {restaurantMenu
                ?.sort((a, b) => a.number - b.number)
                .map((menu) => (
                  <li
                    key={menu.id}
                    className={`flex flex-col ${
                      view ? 'space-y-4' : 'space-y-2'
                    }`}
                  >
                    <div className='flex flex-row'>
                      <p className={`${view ? 'text-3xl' : 'text-xl'}`}>
                        Menu #{menu.number}
                      </p>
                      {view && (
                        <button
                          className='mx-3 text-green-400 hover:text-green-500 text-4xl leading-none font-semibold'
                          onClick={() =>
                            openNewModal({ category: 'Dish', menu })
                          }
                        >
                          +
                        </button>
                      )}
                    </div>
                    {!view
                      ? menu.items
                          ?.slice(0, 5)
                          ?.map((item) => <div key={item}>{item}</div>)
                      : menu.items?.map((item, index) => (
                          <div
                            key={item}
                            className='flex flex-row w-full items-center justify-between bg-gray-100 p-3 rounded-lg'
                          >
                            <p>{item}</p>
                            <div className='flex flex-row items-center'>
                              <PencilIcon
                                className='h-6 w-6 text-gray-600 hover:fill-gray-300 cursor-pointer mr-6'
                                onClick={() =>
                                  setEditSelectedItem({
                                    ...menu,
                                    category: 'menu',
                                    item,
                                    index,
                                  })
                                }
                              >
                                Edit
                              </PencilIcon>
                              <button
                                className='text-2xl cursor-pointer text-red-400 hover:text-red-500'
                                onClick={() =>
                                  handleDeleteItem(
                                    'menu',
                                    menu,
                                    index,
                                    fetchRestaurantsData
                                  )
                                }
                              >
                                X
                              </button>
                            </div>
                          </div>
                        ))}
                  </li>
                ))}
            </ul>
          </DashboardWrapper>
          <DashboardWrapper
            wrapperData={{
              type: 'tables',
              title: 'Tables',
              description: 'List of tables.',
              buttonText: 'Create New Table',
              view,
              loading,
              openNewModal,
              modalData: {
                category: 'Table',
                restaurantId,
                tables: restaurantTables,
              },
            }}
          >
            <ul className='space-y-2'>
              {loading && (
                <div className='text-left text-gray-500'>Loading...</div>
              )}
              {!view
                ? restaurantTables
                    ?.sort((a, b) => a.number - b.number)
                    .slice(0, 5)
                    ?.map((table) => (
                      <li key={table.id}>Table #{table.number}</li>
                    ))
                : restaurantTables
                    ?.sort((a, b) => a.number - b.number)
                    .map((table) => (
                      <li
                        key={table.id}
                        className='flex flex-row bg-gray-100 p-3 rounded-lg'
                      >
                        Table #{table.number} - Capacity - {table.capacity}
                        <div className='flex flex-row items-center'>
                          <PencilIcon
                            className='h-6 w-6 text-gray-600 hover:fill-gray-300 cursor-pointer mr-4 ml-6'
                            onClick={() =>
                              setEditSelectedItem({
                                ...table,
                                category: 'tables',
                              })
                            }
                          >
                            Edit
                          </PencilIcon>
                          <button
                            className='text-2xl cursor-pointer text-red-400 hover:text-red-500'
                            onClick={() =>
                              handleDeleteItem(
                                'tables',
                                table,
                                '',
                                fetchRestaurantsData
                              )
                            }
                          >
                            X
                          </button>
                        </div>
                      </li>
                    ))}
            </ul>
          </DashboardWrapper>
          <DashboardWrapper
            wrapperData={{
              type: 'orders',
              title: 'Orders',
              description: 'List of current orders.',
              buttonText: 'Add New Order',
              view,
              loading,
              openNewModal,
              modalData: {
                category: 'Order',
                restaurantId,
                orderNumbers: restaurantOrders?.map((order) => order.number),
                tables: restaurantTables,
              },
            }}
          >
            <ul className={`${view ? 'space-y-4' : 'space-y-2'}`}>
              {loading && (
                <div className='text-left text-gray-500'>Loading...</div>
              )}
              {!view
                ? restaurantOrders
                    ?.sort((a, b) => a.number - b.number)
                    .slice(0, 5)
                    ?.map((order) => (
                      <li key={order.id}>
                        Order #{order.number}: {order.items?.join(', ')}
                      </li>
                    ))
                : restaurantOrders
                    ?.sort((a, b) => a.number - b.number)
                    ?.map((order) => (
                      <li
                        key={order.id}
                        className='flex flex-col md:flex-row md:items-center mb-4 bg-gray-100 p-3 rounded-lg'
                      >
                        <button
                          className='flex justify-end md:mx-2 md:-mt-1 text-green-400 hover:text-green-500 text-3xl font-semibold'
                          onClick={() =>
                            openNewModal({ category: 'Order Dish', order })
                          }
                        >
                          +
                        </button>
                        <span className='-mt-8 mb-2 md:-mt-0 md:mb-0'>
                          Order #{order.number}:
                        </span>
                        <ul className='flex flex-col md:flex-row flex-wrap'>
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className='flex flex-row items-center mb-2 md:mb-0 md:mr-4'
                            >
                              <p className='ml-4'>{item}</p>
                              <div className='flex flex-row items-center ml-2'>
                                <PencilIcon
                                  className='h-6 w-6 text-gray-600 hover:fill-gray-300 cursor-pointer mr-2'
                                  onClick={() =>
                                    setEditSelectedItem({
                                      ...order,
                                      category: 'orders',
                                      item,
                                      index,
                                    })
                                  }
                                >
                                  Edit
                                </PencilIcon>
                                <button
                                  className='text-2xl cursor-pointer text-red-400 hover:text-red-500'
                                  onClick={() =>
                                    handleDeleteItem(
                                      'orders',
                                      order,
                                      index,
                                      fetchRestaurantsData
                                    )
                                  }
                                >
                                  X
                                </button>
                              </div>
                            </div>
                          ))}
                        </ul>
                      </li>
                    ))}
            </ul>
          </DashboardWrapper>
        </main>
      )}

      {showNewModal && (
        <NewModal
          setShowNewModal={setShowNewModal}
          selected={selected}
          restaurantId={restaurantId}
          fetchRestaurantsData={fetchRestaurantsData}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          selected={selected}
          fetchRestaurantsData={fetchRestaurantsData}
        />
      )}
    </>
  )
}
