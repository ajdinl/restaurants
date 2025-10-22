import { useState } from 'react';
import { SelectInput } from '@/components';

export const TableForm = ({ initialData = {}, restaurants = [], isAdmin = false, error }) => {
    const [formData, setFormData] = useState({
        restaurant_id: initialData.restaurant_id || '',
        capacity: initialData.capacity || '',
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

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
            <SelectInput
                label="Maximum Capacity"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', e.target.value)}
                error={!formData.capacity && error}
            />
        </form>
    );
};
