'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components';
import { TableForm } from './forms/TableForm';
import { ReservationForm } from './forms/ReservationForm';
import { DishForm } from './forms/DishForm';
import { OrderDishForm } from './forms/OrderDishForm';
import { MenuForm } from './forms/MenuForm';
import { OrderForm } from './forms/OrderForm';
import {
    handleTableSave,
    handleMenuSave,
    handleOrderSave,
    handleDishSave,
    handleReservationSave,
} from '@/lib/modal-handlers';

export default function NewModal({
    setShowNewModal,
    selected,
    isAdmin,
    restaurantId,
    fetchRestaurantsData,
    restaurants,
}) {
    const [formData, setFormData] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        if (selected.restaurantId) {
            setFormData((prev) => ({ ...prev, restaurant_id: selected.restaurantId }));
        }
    }, [selected.restaurantId]);

    const handleSave = async () => {
        let result;

        switch (selected.category) {
            case 'Table':
                result = await handleTableSave(formData, isAdmin, restaurantId, restaurants, selected);
                break;
            case 'Dish':
                result = await handleDishSave(formData, selected.category, selected.menu);
                break;
            case 'Order Dish':
                result = await handleDishSave(formData, selected.category, selected.order);
                break;
            case 'Menu':
                result = await handleMenuSave(selected.restaurantId, selected.menuNumber);
                break;
            case 'Order':
                result = await handleOrderSave(selected.restaurantId, selected.orderNumbers, formData.table_id);
                break;
            case 'Reservation':
                result = await handleReservationSave(formData, restaurantId, restaurants, selected.reservationNumbers);
                break;
            default:
                return;
        }

        if (result?.error) {
            setError(result.error);
            return;
        }

        fetchRestaurantsData();
        setShowNewModal(false);
    };

    const renderForm = () => {
        const commonProps = {
            formData,
            onChange: setFormData,
            error,
            isAdmin,
            restaurants,
        };

        switch (selected.category) {
            case 'Table':
                return <TableForm {...commonProps} />;
            case 'Reservation':
                return (
                    <ReservationForm
                        {...commonProps}
                        tables={selected.tables}
                        selectedRestaurantId={selected.restaurantId}
                    />
                );
            case 'Dish':
                return <DishForm {...commonProps} />;
            case 'Order Dish':
                return <OrderDishForm {...commonProps} menu={selected.menu} />;
            case 'Menu':
                return <MenuForm onSave={handleSave} />;
            case 'Order':
                return (
                    <OrderForm {...commonProps} tables={selected.tables} selectedRestaurantId={selected.restaurantId} />
                );
            default:
                return null;
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
                        <div className="relative p-6 flex-auto max-h-[70vh] overflow-y-auto">{renderForm()}</div>
                        {selected.category !== 'Menu' && (
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
                                    onClick={handleSave}
                                >
                                    Save
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
