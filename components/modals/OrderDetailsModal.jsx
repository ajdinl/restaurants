import { Button } from '@/components';

export const OrderDetailsModal = ({ isOpen, onClose, order, onDone, total, totalItems, menuItems, tableNumber }) => {
    if (!isOpen || !order) return null;

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div
                className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none p-4"
                onClick={onClose}
            >
                <div className="relative w-full max-w-2xl my-6 mx-auto">
                    <div
                        className="border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-medium relative flex flex-col w-full bg-white dark:bg-neutral-800 outline-none focus:outline-none"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between p-6 border-b border-neutral-200 dark:border-neutral-700">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center font-bold text-lg">
                                    {order.number}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-50">
                                        Order #{order.number}
                                    </h3>
                                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                        Table #{tableNumber}
                                    </p>
                                </div>
                            </div>
                            <button
                                className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-all"
                                onClick={onClose}
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

                        <div className="relative p-6 flex-auto">
                            <div className="mb-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <svg
                                            className="w-5 h-5 text-green-600 dark:text-green-400"
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
                                        <span className="font-semibold text-green-700 dark:text-green-300">
                                            {totalItems} items
                                        </span>
                                    </div>
                                    {total > 0 && (
                                        <span className="text-xl font-bold text-green-700 dark:text-green-300">
                                            ${total.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                                    Order Items
                                </h4>
                                <ul className="space-y-2">
                                    {order.items?.map((item, index) => {
                                        const menuItem = menuItems.find((m) => m.name === item.name);
                                        const price = menuItem?.price || 0;
                                        const itemTotal = price * (item.quantity || 0);

                                        return (
                                            <li
                                                key={index}
                                                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg border border-neutral-200 dark:border-neutral-600"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 flex items-center justify-center font-bold">
                                                        {item.quantity}x
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                                                            {item.name}
                                                        </p>
                                                        {price > 0 && (
                                                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                                                ${price.toFixed(2)} each
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                                {price > 0 && (
                                                    <span className="font-bold text-neutral-900 dark:text-neutral-50">
                                                        ${itemTotal.toFixed(2)}
                                                    </span>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>

                                {total > 0 && (
                                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border-2 border-green-200 dark:border-green-800 mt-4">
                                        <span className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                                            Total Amount
                                        </span>
                                        <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                                            ${total.toFixed(2)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-3 p-6 border-t border-neutral-200 dark:border-neutral-700">
                            <Button
                                className="bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-600 border border-neutral-300 dark:border-neutral-600 focus:ring-neutral-500"
                                type="button"
                                onClick={onClose}
                            >
                                Close
                            </Button>
                            <Button
                                className="bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow-md focus:ring-green-500"
                                type="button"
                                onClick={onDone}
                            >
                                Done
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
