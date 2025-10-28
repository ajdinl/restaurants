'use client';

import { useState, useEffect, useRef } from 'react';
import { updateItem, updateOrDeleteArrayItem, deleteItem } from '@/services/api.service';
import { Button, SelectInput } from '@/components';

export default function EditModal({ setShowEditModal, selected, fetchRestaurantsData, menu }) {
    const [status, setStatus] = useState(selected.status);
    const [capacity, setCapacity] = useState(selected.capacity);
    const [date, setDate] = useState(selected.date || '');
    const [time, setTime] = useState(selected.time || '');
    const [selectedItem, setSelectedItem] = useState(selected.item);
    const [openDropdown, setOpenDropdown] = useState(false);
    const dropdownRef = useRef(null);

    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleUpdate = async (category, selected, name, value) => {
        const { data: item, error } = await updateItem(category, selected.id, name, value);
        if (error) {
            return;
        }
        fetchRestaurantsData();
    };

    const handleUpdateArrayItem = async (category, selected, selectedItem) => {
        let selectedArray = [...selected.items];

        if (selectedItem) {
            if (selectedArray[selected.index] === selectedItem) {
                return;
            }
            selectedArray[selected.index] = selectedItem;
        }

        const { data: item, error } = await updateOrDeleteArrayItem(category, selected.id, selectedArray);
        if (error) {
            return;
        }
        fetchRestaurantsData();
    };

    const handleEditSave = async () => {
        setShowEditModal(false);
        if (selectedItem) {
            handleUpdateArrayItem(selected.category, selected, selectedItem);
            return;
        }

        if (selected.category === 'reservations' && status === 'Available' && selected.status !== status) {
            const { error } = await deleteItem('reservations', selected.id);
            if (error) {
                return;
            }
            fetchRestaurantsData();
            return;
        }

        if (selected.capacity !== capacity) {
            handleUpdate(selected.category, selected, 'capacity', capacity);
        }
        if (selected.status !== status) {
            handleUpdate(selected.category, selected, 'status', status);
        }
        if (selected.category === 'reservations') {
            if (selected.date !== date) {
                handleUpdate(selected.category, selected, 'date', date);
            }
            if (selected.time !== time) {
                handleUpdate(selected.category, selected, 'time', time);
            }
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setOpenDropdown(false);
            }
        };

        if (openDropdown) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdown]);

    const handleOpen = () => {
        setOpenDropdown(!openDropdown);
    };

    const setStatusValue = (value) => {
        setStatus(value);
        setOpenDropdown(false);
    };

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"></div>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4"
                onClick={() => setShowEditModal(false)}
            >
                <div className="relative w-full max-w-2xl my-6 mx-auto" onClick={(e) => e.stopPropagation()}>
                    <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-medium relative flex flex-col w-full bg-white dark:bg-neutral-800 outline-none focus:outline-none">
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50">
                                Edit {selected.category}
                            </h3>
                            <button
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
                                onClick={() => setShowEditModal(false)}
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
                            {selected.category === 'tables' && (
                                <SelectInput
                                    label="Maximum Capacity"
                                    value={capacity}
                                    onChange={(e) => setCapacity(e.target.value)}
                                />
                            )}
                            {selected.category === 'menu' && (
                                <form className="w-full space-y-2">
                                    <label className="block">
                                        <span className="text-neutral-700 dark:text-neutral-300">Name</span>
                                        <input
                                            type="text"
                                            value={selectedItem.name}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    name: e.target.value,
                                                })
                                            }
                                            placeholder="Name"
                                            className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-neutral-700 dark:text-neutral-300">Ingredients</span>
                                        <input
                                            type="text"
                                            value={selectedItem.ingredients?.join(', ')}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    ingredients: [e.target.value],
                                                })
                                            }
                                            placeholder="Ingredients"
                                            className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </label>
                                    <label className="block">
                                        <span className="text-neutral-700 dark:text-neutral-300">Price</span>
                                        <input
                                            type="number"
                                            value={selectedItem.price}
                                            onChange={(e) =>
                                                setSelectedItem({
                                                    ...selectedItem,
                                                    price: e.target.value,
                                                })
                                            }
                                            placeholder="Price"
                                            className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </label>
                                </form>
                            )}
                            {selected.category === 'orders' && (
                                <form className="w-full space-y-2">
                                    {!menu || menu.length === 0 || !menu.some((m) => m.items?.length > 0) ? (
                                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 text-center">
                                            <svg
                                                className="w-10 h-10 text-orange-600 dark:text-orange-400 mx-auto mb-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                                />
                                            </svg>
                                            <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                                                No menu items available
                                            </p>
                                            <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                                                Please add dishes to the menu first
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="space-y-2">
                                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                    Select Dish from Menu
                                                </label>
                                                <div className="relative">
                                                    <select
                                                        value={selectedItem.name}
                                                        onChange={(e) =>
                                                            setSelectedItem({
                                                                ...selectedItem,
                                                                name: e.target.value,
                                                            })
                                                        }
                                                        className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all appearance-none"
                                                    >
                                                        <option value="">Select a dish</option>
                                                        {menu
                                                            ?.flatMap((m) => m.items)
                                                            .map((item, index) => (
                                                                <option key={index} value={item.name}>
                                                                    {item.name} - ${item.price}
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
                                            <label className="block">
                                                <span className="text-neutral-700 dark:text-neutral-300">Quantity</span>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={selectedItem.quantity}
                                                    onChange={(e) =>
                                                        setSelectedItem({
                                                            ...selectedItem,
                                                            quantity: e.target.value,
                                                        })
                                                    }
                                                    placeholder="Quantity"
                                                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                                />
                                            </label>
                                        </>
                                    )}
                                </form>
                            )}
                            {selected.category === 'reservations' && (
                                <form className="w-full space-y-4">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Status
                                        </label>
                                        <div className="relative" ref={dropdownRef}>
                                            <Button
                                                className={`w-full justify-between ${
                                                    status === 'Available'
                                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 border border-green-300 dark:border-green-700'
                                                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 hover:bg-red-200 dark:hover:bg-red-800 border border-red-300 dark:border-red-700'
                                                }`}
                                                onClick={handleOpen}
                                            >
                                                <span>{status}</span>
                                                <svg
                                                    className="w-4 h-4 ml-2"
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
                                            </Button>
                                            {openDropdown && (
                                                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-medium p-1">
                                                    {status === 'Available' && (
                                                        <button
                                                            type="button"
                                                            className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all text-neutral-900 dark:text-neutral-50"
                                                            onClick={() => setStatusValue('Reserved')}
                                                        >
                                                            Reserved
                                                        </button>
                                                    )}
                                                    {status === 'Reserved' && (
                                                        <button
                                                            type="button"
                                                            className="w-full text-left px-4 py-3 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all text-neutral-900 dark:text-neutral-50"
                                                            onClick={() => setStatusValue('Available')}
                                                        >
                                                            Available
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <SelectInput
                                        label="Number of Guests"
                                        value={capacity}
                                        onChange={(e) => setCapacity(e.target.value)}
                                    />
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Date
                                        </label>
                                        <input
                                            type="date"
                                            value={date}
                                            min={getTodayDate()}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                            Time
                                        </label>
                                        <input
                                            type="time"
                                            value={time}
                                            onChange={(e) => setTime(e.target.value)}
                                            className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                        />
                                    </div>
                                </form>
                            )}
                        </div>
                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <button
                                className="px-4 py-2 rounded-lg font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-500"
                                type="button"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-4 py-2 rounded-lg font-medium bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                                type="button"
                                onClick={() => handleEditSave()}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
