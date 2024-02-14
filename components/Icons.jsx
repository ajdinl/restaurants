function MenuIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  )
}
function PencilIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    >
      <path d='M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z' />
      <path d='m15 5 4 4' />
    </svg>
  )
}

function EditIcon({
  className,
  setEditSelectedItem,
  selected,
  category,
  item,
  index,
}) {
  return (
    <PencilIcon
      className={`h-4 w-4 text-gray-600 dark:text-gray-400 hover:fill-gray-300 cursor-pointer ${className}`}
      onClick={() =>
        setEditSelectedItem({
          ...selected,
          category,
          item,
          index,
        })
      }
    />
  )
}

function DeleteIcon({
  category,
  data,
  index,
  setDeleteSelectedItem,
  setShowDeleteModal,
  className,
}) {
  return (
    <button
      className={`cursor-pointer text-red-400 hover:text-red-500 ${className}`}
      onClick={() => {
        setDeleteSelectedItem({ category, data, index })
        setShowDeleteModal(true)
      }}
    >
      X
    </button>
  )
}

export { MenuIcon, PencilIcon, EditIcon, DeleteIcon }
