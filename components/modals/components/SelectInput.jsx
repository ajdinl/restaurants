function SelectInput({ label, value, onChange, error }) {
  const options = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  return (
    <div className='flex flex-col'>
      <span className='text-gray-700 dark:text-gray-400 my-2'>{label}</span>
      <span className='text-red-500 ml-4 text-sm'>{error}</span>
      <select
        className='mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50'
        value={value}
        onChange={onChange}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default SelectInput
