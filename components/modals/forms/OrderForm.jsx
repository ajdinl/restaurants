export const OrderForm = ({
    formData,
    onChange,
    tables = [],
    restaurants = [],
    isAdmin = false,
    error,
    selectedRestaurantId,
}) => {
    return (
        <form className="flex flex-col space-y-4">
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Table Number</label>
                {error && (
                    <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        {error}
                    </span>
                )}
                <div className="relative">
                    {isAdmin && (
                        <select
                            onChange={(e) => onChange({ ...formData, table_id: e.target.value })}
                            className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                        >
                            <option value="">Select a table</option>
                            {restaurants
                                ?.filter((restaurant) => restaurant.id === selectedRestaurantId)
                                .map((restaurant) =>
                                    restaurant.tables.map((table) => (
                                        <option key={table.id} value={table.id}>
                                            Table #{table.number}
                                        </option>
                                    ))
                                )}
                        </select>
                    )}
                    {!isAdmin && (
                        <select
                            className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                            onChange={(e) => onChange({ ...formData, table_id: e.target.value })}
                        >
                            <option value="">Select a table</option>
                            {tables?.map((table) => (
                                <option key={table.id} value={table.id}>
                                    Table #{table.number}
                                </option>
                            ))}
                        </select>
                    )}
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </form>
    );
};
