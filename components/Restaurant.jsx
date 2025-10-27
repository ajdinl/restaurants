'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { fetchRestaurant, addItem, updateOrDeleteArrayItem } from '@/services/api.service';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components';

export default function RestaurantComponent({ id }) {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [order, setOrder] = useState({});
    const { name, address, phone, menu = [] } = restaurant?.data ?? {};
    const searchParams = useSearchParams();
    const tableNumber = searchParams.get('table');
    const router = useRouter();

    useEffect(() => {
        setLoading(true);
        fetchRestaurant(id).then((data) => {
            setRestaurant(data);
            setLoading(false);
        });
    }, [id]);

    const handleOrder = async (items) => {
        Object.keys(items).forEach((key) => {
            if (items[key] === '0') {
                delete items[key];
            }
        });

        const allOrders = restaurant.data.orders;
        const table = restaurant.data.tables.find((t) => t.number === parseInt(tableNumber));

        if (!table) {
            console.error('Table not found');
            return;
        }

        const orderNumber =
            allOrders
                .map((order) => order.number)
                .sort((a, b) => a - b)
                .pop() + 1 || 1;

        const { data, error } = await addItem('orders', {
            restaurant_id: id,
            table_id: table.id,
            number: orderNumber,
        });

        fetchRestaurant(id).then((data) => {
            setRestaurant(data);
        });

        if (error) {
            console.error('Error adding item:', error);
            return;
        }

        const lastOrder = allOrders.pop();

        const formatedItems = Object.keys(items).map((key) => {
            return {
                name: key,
                quantity: items[key],
            };
        });

        const { data: data2, error: error2 } = await updateOrDeleteArrayItem('orders', lastOrder.id, formatedItems);

        if (error2) {
            console.error('Error adding item:', error2);
            return;
        } else {
            setCompleted(true);
            setTimeout(() => {
                setCompleted(false);
                router.push(`/restaurant/${id}?table=${tableNumber}`);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
            {loading && (
                <div className="flex flex-col items-center justify-center min-h-screen">
                    <div className="w-12 h-12 border-3 border-neutral-200 dark:border-neutral-700 border-t-primary-600 dark:border-t-primary-400 rounded-full animate-spin"></div>
                    <p className="text-neutral-600 dark:text-neutral-400 mt-4 font-medium">Loading menu...</p>
                </div>
            )}
            {completed && (
                <div className="flex flex-col items-center justify-center min-h-screen px-4">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6">
                        <svg
                            className="w-12 h-12 text-green-600 dark:text-green-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-2 text-center">
                        Order Placed Successfully!
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-center">
                        Your delicious meal is being prepared
                    </p>
                </div>
            )}
            {!loading && !completed && restaurant && (
                <div className="flex flex-col">
                    <header className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 shadow-sm">
                        <div className="container mx-auto px-4 py-4">
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="text-center sm:text-left">
                                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mb-1">
                                        {name}
                                    </h1>
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">{address}</p>
                                </div>
                                <div className="text-center sm:text-right">
                                    <p className="text-sm text-neutral-600 dark:text-neutral-400">Contact</p>
                                    <p className="text-base font-medium text-neutral-900 dark:text-neutral-50">
                                        {phone}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>
                    <main className="container mx-auto px-4 py-8">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-6 text-center">
                                Our Menu
                            </h2>
                            {menu.length === 0 || !menu[0]?.items || menu[0].items.length === 0 ? (
                                <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-8 text-center">
                                    <svg
                                        className="w-16 h-16 text-neutral-400 dark:text-neutral-600 mx-auto mb-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                        />
                                    </svg>
                                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-50 mb-2">
                                        No Menu Available
                                    </h3>
                                    <p className="text-neutral-600 dark:text-neutral-400">
                                        This restaurant hasn't added any menu items yet. Please check back later!
                                    </p>
                                </div>
                            ) : (
                                <>
                                    <div className="space-y-4 mb-8">
                                        {menu[0].items.map((item, index) => (
                                            <div
                                                key={index}
                                                className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4 hover:shadow-medium transition-all"
                                            >
                                                <div className="flex flex-col sm:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-1">
                                                            {item.name}
                                                        </h3>
                                                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
                                                            {item.ingredients?.join(', ')}
                                                        </p>
                                                        <p className="text-xl font-bold text-primary-600 dark:text-primary-400">
                                                            ${item.price}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                                                            Qty:
                                                        </label>
                                                        <input
                                                            type="number"
                                                            defaultValue={0}
                                                            min={0}
                                                            onChange={(e) =>
                                                                setOrder({
                                                                    ...order,
                                                                    [item.name]: e.target.value,
                                                                })
                                                            }
                                                            className="w-16 px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-neutral-50 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {Object.keys(order).some((key) => order[key] !== '0') && (
                                        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-medium">
                                            <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-50 mb-4">
                                                Your Order
                                            </h3>
                                            <div className="space-y-3 mb-4">
                                                {Object.keys(order).map(
                                                    (key, index) =>
                                                        order[key] !== '0' && (
                                                            <div
                                                                key={index}
                                                                className="flex justify-between items-center py-2 border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <span className="w-8 h-8 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-lg flex items-center justify-center font-semibold text-sm">
                                                                        {order[key]}x
                                                                    </span>
                                                                    <span className="text-neutral-900 dark:text-neutral-50 font-medium">
                                                                        {key}
                                                                    </span>
                                                                </div>
                                                                <span className="text-neutral-900 dark:text-neutral-50 font-semibold">
                                                                    $
                                                                    {order[key] *
                                                                        menu[0].items.find((item) => item.name === key)
                                                                            .price}
                                                                </span>
                                                            </div>
                                                        )
                                                )}
                                            </div>
                                            <div className="flex justify-between items-center pt-4 border-t-2 border-neutral-300 dark:border-neutral-600">
                                                <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                                                    Total
                                                </span>
                                                <span className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                                                    $
                                                    {Object.keys(order).reduce((total, key) => {
                                                        if (order[key] !== '0') {
                                                            return (
                                                                total +
                                                                order[key] *
                                                                    menu[0].items.find((item) => item.name === key)
                                                                        .price
                                                            );
                                                        }
                                                        return total;
                                                    }, 0)}
                                                </span>
                                            </div>
                                            <Button
                                                className="w-full mt-6 bg-primary-600 hover:bg-primary-700 text-white py-3 shadow-sm hover:shadow-md focus:ring-primary-500"
                                                onClick={() => handleOrder(order)}
                                            >
                                                Place Order
                                            </Button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </main>
                </div>
            )}
        </div>
    );
}
