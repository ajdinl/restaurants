import { useState } from 'react';

export const DishForm = ({ initialData = {}, isOrderDish = false, error }) => {
    const [formData, setFormData] = useState({
        name: initialData.name || '',
        ingredients: initialData.ingredients?.join(', ') || '',
        price: initialData.price || '',
        quantity: initialData.quantity || '',
    });

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <form className="space-y-4">
            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Name</span>
                <span className="text-red-500 ml-4 text-sm">{!formData.name && error}</span>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
            </label>
            {!isOrderDish && (
                <>
                    <label className="block">
                        <span className="text-gray-700 dark:text-gray-400">Ingredients</span>
                        <span className="text-red-500 ml-4 text-sm">{!formData.ingredients && error}</span>
                        <input
                            type="text"
                            value={formData.ingredients}
                            onChange={(e) => handleChange('ingredients', e.target.value)}
                            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                    <label className="block">
                        <span className="text-gray-700 dark:text-gray-400">Price</span>
                        <span className="text-red-500 ml-4 text-sm">{!formData.price && error}</span>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleChange('price', e.target.value)}
                            className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        />
                    </label>
                </>
            )}
            {isOrderDish && (
                <label className="block">
                    <span className="text-gray-700 dark:text-gray-400">Quantity</span>
                    <span className="text-red-500 ml-4 text-sm">{!formData.quantity && error}</span>
                    <input
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => handleChange('quantity', e.target.value)}
                        className="mt-1 block w-full rounded border-gray-300 dark:bg-gray-400 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    />
                </label>
            )}
        </form>
    );
};
