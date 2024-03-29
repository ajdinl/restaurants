import { useEffect, useCallback } from 'react'
import { handleDeleteItem } from '@/utils/functions'

export default function DeleteModal({
  setShowDeleteModal,
  selected,
  getRestaurantsData,
}) {
  const confirmDelete = useCallback(() => {
    handleDeleteItem(selected.category, selected.data, selected.index, () => {
      getRestaurantsData()
      setShowDeleteModal(false)
    })
  }, [selected, getRestaurantsData, setShowDeleteModal])

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        confirmDelete()
      } else if (event.key === 'Escape') {
        setShowDeleteModal(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [confirmDelete, setShowDeleteModal])

  return (
    <>
      <div className='fixed inset-0 z-40 bg-black opacity-80'></div>
      <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
          <div className='border-0 rounded shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none'>
            <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
              <h3 className='text-3xl font-semibold'>Delete Modal</h3>
              <button
                className='p-1 ml-auto bg-transparent border-0 text-red-500 opacity-80 float-right text-3xl leading-none font-semibold outline-none focus:outline-none'
                onClick={() => setShowDeleteModal(false)}
              >
                X
              </button>
            </div>
            <div className='relative p-6 flex-auto'>
              <p>Are you sure you want to delete?</p>
            </div>
            <div className='flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
              <button
                className='text-green-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => setShowDeleteModal(false)}
              >
                Close
              </button>
              <button
                className='bg-red-500 text-white active:bg-red-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150'
                type='button'
                onClick={() => confirmDelete()}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
