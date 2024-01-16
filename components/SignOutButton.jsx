export const SignOutButton = () => {
  return (
    <form action='/auth/signout' method='post'>
      <button
        type='submit'
        className='bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-500 font-bold py-2 px-4 rounded hover:bg-gray-200 dark:hover:bg-gray-700'
      >
        Sign Out
      </button>
    </form>
  )
}
