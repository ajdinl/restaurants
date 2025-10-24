'use client';

import { useState, useEffect } from 'react';
import { updateOrDeleteArrayItem, addItem } from '@/services/api.service';
import { Button, SelectInput } from '@/components';

export default function NewModal({
    setShowNewModal,
    selected,
    isAdmin,
    restaurantId,
    fetchRestaurantsData,
    restaurants,
}) {
    const [table, setTable] = useState({});
    const [dish, setDish] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (selected.restaurantId) {
            setTable((prev) => ({ ...prev, restaurant_id: selected.restaurantId }));
        }
    }, [selected.restaurantId]);

    const handleSave = async () => {
        switch (selected.category) {
            case 'Table':
                handleTableSave();
                break;
            case 'Dish':
            case 'Order Dish':
                handleDishSave();
                break;
            case 'Menu':
                handleMenuSave();
                break;
            case 'Order':
                handleOrderSave();
                break;
            case 'Reservation':
                handleReservationSave();
                break;
            default:
                break;
        }
    };

    const handleTableSave = async () => {
        if ((isAdmin && !table.restaurant_id) || !table.capacity) {
            setError('Please select field');
            return;
        }
        if (!table.restaurant_id) {
            table.restaurant_id = restaurantId;
        }

        if (!table.number) {
            let newTableNumber;
            if (isAdmin) {
                const restaurant = restaurants.find((restaurant) => restaurant.id === table.restaurant_id);
                if (!restaurant) {
                    setError('Restaurant not found');
                    return;
                }
                const tables = restaurant.tables || [];
                const lastTable = tables[tables.length - 1];
                lastTable ? (newTableNumber = lastTable.number + 1) : (newTableNumber = 1);
            } else {
                const tables = selected.tables;
                const lastTable = tables[tables.length - 1];
                newTableNumber = lastTable.number + 1;
            }

            table.number = newTableNumber;
        }

        const { data, error } = await addItem('tables', table);
        if (error) {
            console.error('Error adding item:', error);
            return;
        } else {
            fetchRestaurantsData();
            setShowNewModal(false);
        }
    };

    const handleMenuSave = async () => {
        const { restaurantId, menuNumber } = selected;

        const { data, error } = await addItem('menu', {
            restaurant_id: restaurantId,
            number: menuNumber,
        });

        if (error) {
            console.error('Error adding item:', error);
            return;
        } else {
            fetchRestaurantsData();
            setShowNewModal(false);
        }
    };

    const handleOrderSave = async () => {
        const { restaurantId, orderNumbers } = selected;
        const tableNumber = table.table_number;
        const orderNumber = orderNumbers && orderNumbers.length > 0 ? Math.max(...orderNumbers) + 1 : 1;

        if (!tableNumber) {
            setError('Please select table');
            return;
        }

        const { data, error } = await addItem('orders', {
            restaurant_id: restaurantId,
            table_number: parseInt(tableNumber),
            number: parseInt(orderNumber),
        });
        if (error) {
            console.error('Error adding item:', error);
            return;
        } else {
            fetchRestaurantsData();
            setShowNewModal(false);
        }
    };

    const handleDishSave = async () => {
        if (!dish) {
            setError('Please fill name of the dish');
            return;
        }
        const selectedCategory = selected.category === 'Dish' ? 'menu' : 'orders';
        const selectedItem = selected.category === 'Dish' ? 'menu' : 'order';
        const selectedArray = Array.isArray(selected[selectedItem].items) ? [...selected[selectedItem].items] : [];
        selectedArray.push(dish);

        const { data, error } = await updateOrDeleteArrayItem(
            selectedCategory,
            selected[selectedItem].id,
            selectedArray
        );
        if (error) {
            console.error('Error adding item:', error);
            return;
        } else {
            fetchRestaurantsData();
            setShowNewModal(false);
        }
    };

    const handleReservationSave = async () => {
        restaurantId ? (table.restaurant_id = restaurantId) : (restaurantId = null);
        table.number = selected?.reservationNumbers?.length ? selected.reservationNumbers.pop() + 1 : 1;
        if (table.restaurant_id && restaurants) {
            const restaurant = restaurants.find((restaurant) => restaurant.id === table.restaurant_id);
            if (restaurant) {
                const reservationNumber = (restaurant.reservations?.length || 0) + 1;
                table.number = reservationNumber;
            }
        }

        if (!table.capacity || !table.table_number || !table.status) {
            setError('Please select field');
            return;
        }
        const { data, error } = await addItem('reservations', table);
        if (error) {
            console.error('Error adding item:', error);
            return;
        } else {
            fetchRestaurantsData();
            setShowNewModal(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4"
                onClick={() => setShowNewModal(false)}
            >
                <div className="relative w-full max-w-2xl my-6 mx-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-medium relative flex flex-col w-full bg-white dark:bg-neutral-800 outline-none focus:outline-none">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                                New {selected.category}
                            </h3>
                            <button
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
                                onClick={() => setShowNewModal(false)}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                        <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">
                            {selected.category === 'Table' && (
                                <form className="space-y-4">
                                    {isAdmin && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                Restaurant
                                            </label>
                                            {!table.restaurant_id && error && (
                                                <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
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
                                                    value={table.restaurant_id || selected.restaurantId || ''}
                                                    onChange={(e) =>
                                                        setTable({
                                                            ...table,
                                                            restaurant_id: e.target.value,
                                                        })
                                                    }
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
                                    )}
                                    <SelectInput
                                        label="Maximum Capacity"
                                        value={table.capacity}
                                        onChange={(e) => setTable({ ...table, capacity: e.target.value })}
                                        error={!table.capacity && error}
                                    />
                                </form>
                            )}
                            {selected.category === 'Reservation' && (
                                <form className="space-y-4">
                                    {isAdmin && (
                                        <div className="space-y-2">
                                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                Restaurant
                                            </label>
                                            {!table.restaurant_id && error && (
                                                <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                                    <svg
                                                        className="w-3 h-3"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
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
                                                    value={table.restaurant_id || selected.restaurantId || ''}
                                                    onChange={(e) =>
                                                        setTable({
                                                            ...table,
                                                            restaurant_id: e.target.value,
                                                        })
                                                    }
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
                                    )}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Table Number
                                        </label>
                                        {!table.table_number && error && (
                                            <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
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
                                                onChange={(e) =>
                                                    setTable({
                                                        ...table,
                                                        table_number: e.target.value,
                                                        table_id:
                                                            e.target.options[e.target.selectedIndex].getAttribute(
                                                                'table_id'
                                                            ),
                                                        status: 'Reserved',
                                                        capacity: '',
                                                    })
                                                }
                                                className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                            >
                                                <option></option>
                                                {!isAdmin &&
                                                    selected.tables?.map((table) => (
                                                        <option
                                                            key={table.number}
                                                            value={table.number}
                                                            table_id={table.id}
                                                        >
                                                            {table.number}
                                                        </option>
                                                    ))}
                                                {isAdmin &&
                                                    restaurants
                                                        ?.filter(
                                                            (restaurant) => restaurant.id === selected.restaurantId
                                                        )
                                                        .map((restaurant) =>
                                                            restaurant.tables.map((table) => (
                                                                <option
                                                                    key={table.id}
                                                                    value={table.number}
                                                                    table_id={table.id}
                                                                >
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
                                    {table.table_number && (
                                        <>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    Status
                                                </label>
                                                {!table.status && error && (
                                                    <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
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
                                                        value={table.status || 'Reserved'}
                                                        onChange={(e) => setTable({ ...table, status: e.target.value })}
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
                                                {!table.capacity && error && (
                                                    <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                                        <svg
                                                            className="w-3 h-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
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
                                                        value={table.capacity || ''}
                                                        onChange={(e) =>
                                                            setTable({ ...table, capacity: e.target.value })
                                                        }
                                                        className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                                    >
                                                        <option value="" disabled>
                                                            Select number of guests
                                                        </option>
                                                        {!isAdmin &&
                                                            selected.tables.map((ta) => {
                                                                if (ta.id == table.table_id) {
                                                                    return Array.from(
                                                                        { length: ta.capacity },
                                                                        (_, index) => (
                                                                            <option key={index + 1} value={index + 1}>
                                                                                {index + 1}
                                                                            </option>
                                                                        )
                                                                    );
                                                                }
                                                                return null;
                                                            })}
                                                        {isAdmin &&
                                                            restaurants
                                                                ?.filter(
                                                                    (restaurant) =>
                                                                        restaurant.id === selected.restaurantId
                                                                )
                                                                .flatMap((restaurant) =>
                                                                    restaurant.tables
                                                                        .filter((t) => t.id === table.table_id)
                                                                        .flatMap((t) =>
                                                                            Array.from(
                                                                                { length: t.capacity },
                                                                                (_, index) => (
                                                                                    <option
                                                                                        key={index + 1}
                                                                                        value={index + 1}
                                                                                    >
                                                                                        {index + 1}
                                                                                    </option>
                                                                                )
                                                                            )
                                                                        )
                                                                )}
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
                            )}
                            {(selected.category === 'Dish' || selected.category === 'Order Dish') && (
                                <form className="space-y-4">
                                    <label className="block">
                                        <span className="text-neutral-700 dark:text-neutral-300">Name</span>
                                        <span className="text-red-500 ml-4 text-sm">{!dish.name && error}</span>
                                        <input
                                            type="text"
                                            onChange={(e) => setDish({ ...dish, name: e.target.value })}
                                            className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </label>
                                    {selected.category === 'Dish' && (
                                        <>
                                            <label className="block">
                                                <span className="text-neutral-700 dark:text-neutral-300">
                                                    Ingredients
                                                </span>
                                                <span className="text-red-500 ml-4 text-sm">
                                                    {!dish.ingredients && error}
                                                </span>
                                                <input
                                                    type="text"
                                                    onChange={(e) =>
                                                        setDish({
                                                            ...dish,
                                                            ingredients: [e.target.value],
                                                        })
                                                    }
                                                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-neutral-700 dark:text-neutral-300">Price</span>
                                                <span className="text-red-500 ml-4 text-sm">
                                                    {!dish.price && error}
                                                </span>
                                                <input
                                                    type="number"
                                                    onChange={(e) => setDish({ ...dish, price: e.target.value })}
                                                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                />
                                            </label>
                                        </>
                                    )}
                                    {selected.category === 'Order Dish' && (
                                        <label className="block">
                                            <span className="text-neutral-700 dark:text-neutral-300">Quantity</span>
                                            <span className="text-red-500 ml-4 text-sm">{!dish.quantity && error}</span>
                                            <input
                                                type="number"
                                                onChange={(e) => setDish({ ...dish, quantity: e.target.value })}
                                                className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                            />
                                        </label>
                                    )}
                                </form>
                            )}
                            {selected.category === 'Menu' && (
                                <form className="space-y-4">
                                    <Button
                                        className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500"
                                        onClick={() => handleMenuSave()}
                                    >
                                        Add
                                    </Button>
                                </form>
                            )}
                            {selected.category === 'Order' && (
                                <form className="flex flex-col space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Table Number
                                        </label>
                                        {error && (
                                            <span className="text-red-600 dark:text-red-400 text-xs font-medium flex items-center gap-1">
                                                <svg
                                                    className="w-3 h-3"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
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
                                                    onChange={(e) =>
                                                        setTable({ ...table, table_number: e.target.value })
                                                    }
                                                    className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                                >
                                                    <option value="">Select a table</option>
                                                    {restaurants
                                                        ?.filter(
                                                            (restaurant) => restaurant.id === selected.restaurantId
                                                        )
                                                        .map((restaurant) =>
                                                            restaurant.tables.map((table) => (
                                                                <option key={table.id} value={table.number}>
                                                                    Table #{table.number}
                                                                </option>
                                                            ))
                                                        )}
                                                </select>
                                            )}
                                            {!isAdmin && (
                                                <select
                                                    className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                                    onChange={(e) =>
                                                        setTable({ ...table, table_number: e.target.value })
                                                    }
                                                >
                                                    <option value="">Select a table</option>
                                                    {selected.tables?.map((table) => (
                                                        <option key={table.id} value={table.number}>
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
                                </form>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Button
                                className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 focus:ring-neutral-500"
                                type="button"
                                onClick={() => setShowNewModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500"
                                type="button"
                                onClick={() => handleSave()}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
