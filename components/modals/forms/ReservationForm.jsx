export const ReservationForm = ({
    formData,
    onChange,
    tables = [],
    restaurants = [],
    isAdmin = false,
    error,
    selectedRestaurantId,
}) => {
    const getTableCapacity = (tableId) => {
        if (isAdmin) {
            const restaurant = restaurants.find((r) => r.id === formData.restaurant_id);
            const table = restaurant?.tables.find((t) => t.id === tableId);
            return table?.capacity || 0;
        }
        const table = tables.find((t) => t.id === tableId);
        return table?.capacity || 0;
    };

    const tableCapacity = getTableCapacity(formData.table_id);

    return (
        <form className="space-y-4">
            {isAdmin && (
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Restaurant
                    </label>
                    {!formData.restaurant_id && error && (
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
                        <select
                            value={formData.restaurant_id || selectedRestaurantId || ''}
                            onChange={(e) => onChange({ ...formData, restaurant_id: e.target.value })}
                            className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                        >
                            <option value="">Select a restaurant</option>
                            {restaurants.map((restaurant) => (
                                <option key={restaurant.id} value={restaurant.id}>
                                    {restaurant.name}
                                </option>
                            ))}
                        </select>
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
            )}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">Table Number</label>
                {!formData.table_number && error && (
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
                    <select
                        onChange={(e) => {
                            const option = e.target.options[e.target.selectedIndex];
                            onChange({
                                ...formData,
                                table_number: e.target.value,
                                table_id: option.getAttribute('table_id'),
                                status: 'Reserved',
                                capacity: '',
                            });
                        }}
                        className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                    >
                        <option></option>
                        {!isAdmin &&
                            tables?.map((table) => (
                                <option key={table.number} value={table.number} table_id={table.id}>
                                    {table.number}
                                </option>
                            ))}
                        {isAdmin &&
                            restaurants
                                ?.filter((restaurant) => restaurant.id === selectedRestaurantId)
                                .map((restaurant) =>
                                    restaurant.tables.map((table) => (
                                        <option key={table.id} value={table.number} table_id={table.id}>
                                            {table.number}
                                        </option>
                                    ))
                                )}
                    </select>
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
            {formData.table_number && (
                <>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Status
                        </label>
                        {!formData.status && error && (
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
                            <select
                                value={formData.status || 'Reserved'}
                                onChange={(e) => onChange({ ...formData, status: e.target.value })}
                                className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="Reserved">Reserved</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg
                                    className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                            Number of Guests
                        </label>
                        {!formData.capacity && error && (
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
                            <select
                                value={formData.capacity || ''}
                                onChange={(e) => onChange({ ...formData, capacity: e.target.value })}
                                className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                            >
                                <option value="" disabled>
                                    Select number of guests
                                </option>
                                {Array.from({ length: tableCapacity }, (_, index) => (
                                    <option key={index + 1} value={index + 1}>
                                        {index + 1}
                                    </option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                <svg
                                    className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </form>
    );
};
