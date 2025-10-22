import { useState } from 'react';

export const ReservationForm = ({
    tables = [],
    restaurants = [],
    isAdmin = false,
    error,
    selectedRestaurantId = null,
}) => {
    const [formData, setFormData] = useState({
        restaurant_id: selectedRestaurantId || '',
        table_number: '',
        table_id: '',
        status: '',
        capacity: '',
    });

    const handleChange = (field, value, extraData = {}) => {
        setFormData((prev) => ({ ...prev, [field]: value, ...extraData }));
    };

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
                <label className="block">
                    <span className="text-gray-700 dark:text-gray-400">Restaurant</span>
                    <span className="text-red-500 ml-4 text-sm">{!formData.restaurant_id && error}</span>
                    <select
                        value={formData.restaurant_id}
                        onChange={(e) => handleChange('restaurant_id', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    >
                        <option value=""></option>
                        {restaurants.map((restaurant) => (
                            <option key={restaurant.id} value={restaurant.id}>
                                {restaurant.name}
                            </option>
                        ))}
                    </select>
                </label>
            )}
            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Table Number</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.table_number && error}</span>
                <select
                    value={formData.table_number}
                    onChange={(e) => {
                        const option = e.target.options[e.target.selectedIndex];
                        handleChange('table_number', e.target.value, {
                            table_id: option.getAttribute('table_id'),
                        });
                    }}
                    className="mt-1 block w-full rounded dark:bg-gray-400 border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value=""></option>
                    {!isAdmin &&
                        tables?.map((table) => (
                            <option key={table.number} value={table.number} table_id={table.id}>
                                {table.number}
                            </option>
                        ))}
                    {isAdmin &&
                        restaurants
                            ?.filter((restaurant) => restaurant.id === formData.restaurant_id)
                            .map((restaurant) =>
                                restaurant.tables.map((table) => (
                                    <option key={table.id} value={table.number} table_id={table.id}>
                                        {table.number}
                                    </option>
                                ))
                            )}
                </select>
            </label>
            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Status</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.status && error}</span>
                <select
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value=""></option>
                    <option value="Reserved">Reserved</option>
                </select>
            </label>
            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Number of Guests</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.capacity && error}</span>
                <select
                    value={formData.capacity}
                    onChange={(e) => handleChange('capacity', e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                >
                    <option value=""></option>
                    {Array.from({ length: tableCapacity }, (_, index) => (
                        <option key={index + 1} value={index + 1}>
                            {index + 1}
                        </option>
                    ))}
                </select>
            </label>
        </form>
    );
};
