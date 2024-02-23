'use client'

import { useState, useEffect } from 'react'
import {
  fetchRestaurant,
  addItem,
  updateOrDeleteArrayItem,
} from '@/utils/supabaseMethods'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components'

export default function RestaurantComponent({ id }) {
  const [restaurant, setRestaurant] = useState(null)
  const [loading, setLoading] = useState(false)
  const [order, setOrder] = useState({})
  const { name, address, phone, menu } = restaurant?.data ?? {}
  const searchParams = useSearchParams()
  const tableNumber = searchParams.get('table')

  useEffect(() => {
    setLoading(true)
    fetchRestaurant(id).then((data) => {
      setRestaurant(data)
      setLoading(false)
    })
  }, [id])

  const handleOrder = async (items) => {
    Object.keys(items).forEach((key) => {
      if (items[key] === '0') {
        delete items[key]
      }
    })

    const allOrders = restaurant.data.orders

    const orderNumber =
      allOrders
        .map((order) => order.number)
        .sort((a, b) => a - b)
        .pop() + 1

    const { data, error } = await addItem('orders', {
      restaurant_id: id,
      table_number: tableNumber,
      number: orderNumber,
    })

    fetchRestaurant(id).then((data) => {
      setRestaurant(data)
    })

    if (error) {
      console.error('Error adding item:', error)
      return
    }

    const lastOrder = allOrders.pop()

    const formatedItems = Object.keys(items).map((key) => {
      return {
        name: key,
        quantity: items[key],
      }
    })

    console.log(lastOrder)

    const { data: data2, error: error2 } = await updateOrDeleteArrayItem(
      'orders',
      lastOrder.id,
      formatedItems
    )

    if (error2) {
      console.error('Error adding item:', error2)
      return
    }
  }

  return (
    <>
      {loading && (
        <div className='text-center text-xl font-bold mt-96 text-gray-500'>
          Loading...
        </div>
      )}
      {!loading && restaurant && (
        <div className='flex flex-col'>
          <div className='flex flex-row items-center justify-between p-4 h-12 font-bold text-gray-600 bg-gray-300'>
            <p className='text-sm sm:text-base'>
              <span className='text-gray-700 hidden sm:inline'>Address: </span>
              {address}
            </p>
            <h1 className='text-xl'>{name}</h1>
            <p className='text-sm sm:text-base'>
              <span className='text-gray-700 hidden sm:inline'>Phone: </span>
              {phone}
            </p>
          </div>
          <div className='flex flex-col items-center p-4 mt-36'>
            <p className='text-gray-600 text-2xl font-bold'>Menu</p>
            <div className='flex flex-col gap-2 mt-4'>
              {menu[0].items.map((item, index) => (
                <div key={index} className='flex flex-row space-x-4'>
                  <div className='flex flex-col items-center mt-1'>
                    <div className='flex flex-row space-x-2'>
                      <label className='text-gray-600'>Quantity:</label>
                      <input
                        type='number'
                        defaultValue={0}
                        min={0}
                        onChange={(e) =>
                          setOrder({
                            ...order,
                            [item.name]: e.target.value,
                          })
                        }
                        className='w-12 border-2 border-gray-400 rounded'
                      />
                    </div>
                  </div>
                  <div className='flex flex-col sm:flex-row justify-between text-md mb-2 w-full'>
                    <div className='space-y-1'>
                      <p>{item.name}</p>
                      <p className='text-sm'>{item.ingredients?.join(', ')}</p>
                    </div>
                    <p className='sm:ml-10'>${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h1 className='font-bold'>Ordered Items:</h1>
              <div className='flex flex-col gap-2 mt-4'>
                {Object.keys(order).map((key, index) => (
                  <div key={index} className='flex flex-row space-x-4'>
                    {order[key] === '0' ? (
                      <p className='hidden'></p>
                    ) : (
                      <>
                        <div className='flex flex-col items-center mt-1'>
                          <div className='flex flex-row space-x-2 -mt-1'>
                            <label className='text-gray-600 hidden sm:inline'>
                              Quantity:
                            </label>
                            <p>{order[key]}</p>
                          </div>
                        </div>
                        <div className='flex flex-col sm:flex-row justify-between text-md mb-2 w-full'>
                          <div className='space-y-1'>
                            <p>{key}</p>
                          </div>
                          <p className='sm:ml-10'>
                            $
                            {order[key] *
                              menu[0].items.find((item) => item.name === key)
                                .price}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
              <div className='flex flex-col items-end'>
                <p className='text-lg font-bold'>Total: $</p>
              </div>
            </div>
          </div>
          <div className='flex flex-col items-center'>
            <Button
              className='bg-green-500 hover:bg-green-600 text-white mt-6'
              onClick={() => handleOrder(order)}
            >
              Order
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
