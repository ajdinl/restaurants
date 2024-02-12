'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import {
  EditModal,
  NewModal,
  DashboardWrapper,
  EditIcon,
  DeleteIcon,
} from '@/components'
import { fetchUserData, fetchRestaurantsData } from '@/utils/functions'

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

  const setEditSelectedItem = (item) => {
    setSelected(item)
    setShowEditModal(true)
  }

  const openNewModal = (itemDetails) => {
    setShowNewModal(true)
    setSelected(itemDetails)
  }

  const getRestaurantsData = async () => {
    fetchRestaurantsData({ setLoading, setData, userId })
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
    <>
      {data && (
        <main className='flex min-h-[calc(100vh-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 bg-white dark:bg-gray-900'>
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
                      <p
                        className={`${
                          view ? 'text-xl' : 'text-xl'
                        } text-black dark:text-gray-300`}
                      >
                        Menu #{menu.number}
                      </p>
                      {view && (
                        <button
                          className='mx-3 -mt-1 text-green-400 hover:text-green-500 text-3xl leading-none font-semibold'
                          onClick={() =>
                            openNewModal({ category: 'Dish', menu })
                          }
                        >
                          +
                        </button>
                      )}
                    </div>
                    {!view
                      ? menu.items?.slice(0, 5)?.map((item) => (
                          <div
                            key={item}
                            className='text-black dark:text-white'
                          >
                            {item}
                          </div>
                        ))
                      : menu.items?.map((item, index) => (
                          <div
                            key={item}
                            className='flex flex-row w-full items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'
                          >
                            <p className='text-black dark:text-white'>{item}</p>
                            <div className='flex flex-row items-center'>
                              <EditIcon
                                className='h-5 w-5 mr-6'
                                setEditSelectedItem={setEditSelectedItem}
                                selected={menu}
                                category='menu'
                                item={item}
                                index={index}
                              />
                              <DeleteIcon
                                category='menu'
                                data={menu}
                                index={index}
                                getRestaurantsData={getRestaurantsData}
                              />
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
              {!view
                ? restaurantTables
                    ?.sort((a, b) => a.number - b.number)
                    .slice(0, 5)
                    ?.map((table) => (
                      <li key={table.id} className='text-black dark:text-white'>
                        Table #{table.number}
                      </li>
                    ))
                : restaurantTables
                    ?.sort((a, b) => a.number - b.number)
                    .map((table) => (
                      <li
                        key={table.id}
                        className='flex flex-row w-full items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'
                      >
                        <p className='text-black dark:text-white'>
                          Table #{table.number} - Capacity - {table.capacity}
                        </p>
                        <div className='flex flex-row items-center'>
                          <EditIcon
                            className='h-5 w-5 mr-4 ml-6'
                            setEditSelectedItem={setEditSelectedItem}
                            selected={table}
                            category='tables'
                          />
                          <DeleteIcon
                            category='tables'
                            data={table}
                            index={null}
                            getRestaurantsData={getRestaurantsData}
                          />
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
              {!view
                ? restaurantOrders
                    ?.sort((a, b) => a.number - b.number)
                    .slice(0, 5)
                    ?.map((order) => (
                      <li
                        key={order.id}
                        className='flex flex-col text-black dark:text-white'
                      >
                        <p className='font-bold'>Order #{order.number}:</p>
                        {order.items?.join(', ')}
                      </li>
                    ))
                : restaurantOrders
                    ?.sort((a, b) => a.number - b.number)
                    ?.map((order) => (
                      <li
                        key={order.id}
                        className='flex flex-col md:flex-row md:items-center mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg'
                      >
                        <button
                          className='flex justify-end md:mx-2 md:-mt-1 text-green-400 hover:text-green-500 text-3xl font-semibold'
                          onClick={() =>
                            openNewModal({ category: 'Order Dish', order })
                          }
                        >
                          +
                        </button>
                        <span className='-mt-8 mb-2 md:-mt-0 md:mb-0 text-black dark:text-white mr-2 min-w-28'>
                          Order #{order.number}:
                        </span>
                        <ul className='flex flex-col lg:flex-row flex-wrap'>
                          {order.items?.map((item, index) => (
                            <div
                              key={index}
                              className='flex flex-row items-center justify-between mb-2 md:mb-0 md:mr-4'
                            >
                              <p className='text-black dark:text-white'>
                                {item}
                              </p>
                              <div className='flex flex-row items-center mx-2'>
                                <EditIcon
                                  className='h-5 w-5 mr-2'
                                  setEditSelectedItem={setEditSelectedItem}
                                  selected={order}
                                  category='orders'
                                  item={item}
                                  index={index}
                                />
                                <DeleteIcon
                                  category='orders'
                                  data={order}
                                  index={index}
                                  getRestaurantsData={getRestaurantsData}
                                />
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
          fetchRestaurantsData={getRestaurantsData}
        />
      )}
      {showEditModal && (
        <EditModal
          setShowEditModal={setShowEditModal}
          selected={selected}
          fetchRestaurantsData={getRestaurantsData}
        />
      )}
    </>
  )
}
