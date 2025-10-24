import { CardContentHeader, EditIcon, DeleteIcon } from '@/components';

export default function Restaurants({ restaurants, openNewModal, setEditSelectedItem, setDeleteSelectedItem }) {
    return (
        <div className="space-y-8">
            {restaurants &&
                restaurants.map((restaurant) => (
                    <div
                        key={restaurant.id}
                        className="border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 p-5 shadow-soft"
                    >
                        <div className="flex items-center gap-3 mb-4 pb-3 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                <svg
                                    className="w-6 h-6 text-primary-600 dark:text-primary-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50">
                                {restaurant.name}
                            </h2>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <CardContentHeader
                                title="Menu"
                                openNewModal={() => {
                                    openNewModal({
                                        category: 'Menu',
                                        restaurantId: restaurant.id,
                                        menuNumber: restaurant.menu.map((menu) => menu.number).pop() + 1,
                                    });
                                }}
                            >
                                {restaurant.menu
                                    .sort((a, b) => a.number - b.number)
                                    .map((menu) => (
                                        <li key={menu.id} className="mb-4">
                                            <div className="flex items-center justify-between mb-3">
                                                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wide">
                                                    Menu #{menu.number}
                                                </h4>
                                                <button
                                                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-all"
                                                    onClick={() => openNewModal({ category: 'Dish', menu })}
                                                >
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M12 4v16m8-8H4"
                                                        />
                                                    </svg>
                                                    Add Dish
                                                </button>
                                            </div>
                                            <ul className="space-y-2">
                                                {menu.items?.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <h5 className="font-medium text-neutral-900 dark:text-neutral-50 truncate">
                                                                    {item.name}
                                                                </h5>
                                                                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 line-clamp-1">
                                                                    {item.ingredients?.join(', ')}
                                                                </p>
                                                                <span className="inline-block mt-2 px-2 py-1 text-xs font-semibold text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 rounded">
                                                                    ${item.price}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-1 flex-shrink-0">
                                                                <EditIcon
                                                                    action={() =>
                                                                        setEditSelectedItem({
                                                                            ...menu,
                                                                            category: 'menu',
                                                                            item,
                                                                            index,
                                                                        })
                                                                    }
                                                                />
                                                                <DeleteIcon
                                                                    action={() =>
                                                                        setDeleteSelectedItem({
                                                                            category: 'menu',
                                                                            data: menu,
                                                                            index,
                                                                        })
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                            </CardContentHeader>
                            <CardContentHeader
                                title="Tables"
                                openNewModal={() =>
                                    openNewModal({
                                        category: 'Table',
                                        restaurantId: restaurant.id,
                                    })
                                }
                            >
                                {restaurant.tables
                                    .sort((a, b) => a.number - b.number)
                                    .map((table) => (
                                        <li
                                            key={table.id}
                                            className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                                        <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                                                            {table.number}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                                            Table #{table.number}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            <span className="inline-flex items-center gap-1">
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
                                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                                    />
                                                                </svg>
                                                                Capacity: {table.capacity}
                                                            </span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <EditIcon
                                                        action={() =>
                                                            setEditSelectedItem({
                                                                ...table,
                                                                category: 'tables',
                                                            })
                                                        }
                                                    />
                                                    <DeleteIcon
                                                        action={() =>
                                                            setDeleteSelectedItem({
                                                                category: 'tables',
                                                                data: table,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </CardContentHeader>
                            <CardContentHeader
                                title="Reservations"
                                openNewModal={() => {
                                    openNewModal({
                                        category: 'Reservation',
                                        restaurantId: restaurant.id,
                                    });
                                }}
                                className="space-y-2"
                            >
                                {restaurant.reservations
                                    .sort((a, b) => a.number - b.number)
                                    .map((reservation) => (
                                        <li
                                            key={reservation.id}
                                            className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                                            Reservation #{reservation.number}
                                                        </p>
                                                        <span
                                                            className={`px-2 py-0.5 text-xs font-semibold rounded ${
                                                                reservation.status === 'Reserved'
                                                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                                                                    : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                                            }`}
                                                        >
                                                            {reservation.status}
                                                        </span>
                                                    </div>
                                                    <div className="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                                                        <p className="flex items-center gap-1.5">
                                                            <svg
                                                                className="w-3.5 h-3.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                                                                />
                                                            </svg>
                                                            Table #{reservation.table_number}
                                                        </p>
                                                        <p className="flex items-center gap-1.5">
                                                            <svg
                                                                className="w-3.5 h-3.5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                                />
                                                            </svg>
                                                            {reservation.capacity} Guests
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1 flex-shrink-0">
                                                    <EditIcon
                                                        action={() =>
                                                            setEditSelectedItem({
                                                                ...reservation,
                                                                category: 'reservations',
                                                            })
                                                        }
                                                    />
                                                    <DeleteIcon
                                                        action={() =>
                                                            setDeleteSelectedItem({
                                                                category: 'reservations',
                                                                data: reservation,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                            </CardContentHeader>
                            <CardContentHeader
                                title="Orders"
                                openNewModal={() => {
                                    openNewModal({
                                        category: 'Order',
                                        restaurantId: restaurant.id,
                                        orderNumbers: restaurant.orders.map((order) => order.number),
                                    });
                                }}
                                className="space-y-2 flex-nowrap overflow-x-auto w-1/2 md:flex-1"
                            >
                                {restaurant.orders
                                    .sort((a, b) => a.number - b.number)
                                    .map((order) => (
                                        <li
                                            key={order.id}
                                            className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-700/50 border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-600 transition-all"
                                        >
                                            <div className="flex items-center justify-between mb-3 pb-3 border-b border-neutral-200 dark:border-neutral-600">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900 flex items-center justify-center flex-shrink-0">
                                                        <svg
                                                            className="w-4 h-4 text-primary-600 dark:text-primary-400"
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
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-neutral-900 dark:text-neutral-50">
                                                            Order #{order.number}
                                                        </p>
                                                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                            Table #{order.table_number}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded transition-all"
                                                        onClick={() =>
                                                            openNewModal({
                                                                category: 'Order Dish',
                                                                order,
                                                            })
                                                        }
                                                    >
                                                        <svg
                                                            className="w-3.5 h-3.5"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M12 4v16m8-8H4"
                                                            />
                                                        </svg>
                                                        Add
                                                    </button>
                                                    <DeleteIcon
                                                        action={() =>
                                                            setDeleteSelectedItem({
                                                                category: 'orders',
                                                                data: order,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            </div>
                                            <ul className="space-y-2">
                                                {order.items?.map((item, index) => (
                                                    <li
                                                        key={index}
                                                        className="flex items-center justify-between gap-2 p-2 rounded bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600"
                                                    >
                                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                                            <span className="px-2 py-1 text-xs font-semibold bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded">
                                                                {item.quantity}x
                                                            </span>
                                                            <p className="text-sm font-medium text-neutral-900 dark:text-neutral-50 truncate">
                                                                {item.name}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <EditIcon
                                                                action={() =>
                                                                    setEditSelectedItem({
                                                                        ...order,
                                                                        category: 'orders',
                                                                        item,
                                                                        index,
                                                                    })
                                                                }
                                                            />
                                                            <DeleteIcon
                                                                action={() =>
                                                                    setDeleteSelectedItem({
                                                                        category: 'orders',
                                                                        data: order,
                                                                        index,
                                                                    })
                                                                }
                                                            />
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </li>
                                    ))}
                            </CardContentHeader>
                        </div>
                    </div>
                ))}
        </div>
    );
}
