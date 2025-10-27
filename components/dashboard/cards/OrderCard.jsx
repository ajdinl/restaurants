import { EditIcon, DeleteIcon, Button } from '@/components';

export const OrderCard = ({ order, menu, tables, onEdit, onDelete, onAddDish, isExpanded }) => {
    const menuItems = menu?.[0]?.items || [];
    const table = tables?.find((t) => t.id === order.table_id);
    const tableNumber = table?.number || order.table_number || 'N/A';

    const calculateTotal = () => {
        if (!order.items || menuItems.length === 0) {
            return 0;
        }

        const total = order.items.reduce((total, orderItem) => {
            const menuItem = menuItems.find((m) => m.name === orderItem.name);
            const price = menuItem?.price || 0;
            return total + price * (orderItem.quantity || 0);
        }, 0);

        return total;
    };

    if (!isExpanded) {
        const totalItems = order.items?.reduce((acc, item) => acc + (item.quantity || 0), 0) || 0;
        const total = calculateTotal();

        return (
            <li className="flex items-start justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-600">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {order.number}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-50">Order #{order.number}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">Table #{tableNumber}</p>
                        <div className="mt-1 space-y-0.5">
                            {order.items?.slice(0, 2).map((item, index) => (
                                <p key={index} className="text-neutral-600 dark:text-neutral-400 text-xs truncate">
                                    <span className="font-medium text-green-600 dark:text-green-400">
                                        {item.quantity}x
                                    </span>{' '}
                                    {item.name}
                                </p>
                            ))}
                            {order.items?.length > 2 && (
                                <p className="text-neutral-500 dark:text-neutral-500 text-xs">
                                    +{order.items.length - 2} more items
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 ml-3 flex-shrink-0">
                    <span className="px-2 py-1 rounded-md text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                        {totalItems} items
                    </span>
                    {total > 0 && (
                        <span className="px-2 py-1 rounded-md text-xs font-bold bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300">
                            ${total.toFixed(2)}
                        </span>
                    )}
                </div>
            </li>
        );
    }

    const total = calculateTotal();

    return (
        <li className="flex flex-col bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-green-300 dark:hover:border-green-700 transition-all mb-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 flex items-center justify-center font-semibold">
                        {order.number}
                    </div>
                    <div>
                        <span className="text-neutral-900 dark:text-neutral-50 font-semibold">
                            Order #{order.number}
                        </span>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Table #{tableNumber}</p>
                    </div>
                </div>
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-green-600 hover:bg-green-700 text-white text-xl font-semibold transition-all shadow-sm"
                    onClick={() => onAddDish({ category: 'Order Dish', order, menu })}
                >
                    +
                </button>
            </div>
            <ul className="space-y-2">
                {order.items?.map((item, index) => {
                    const menuItem = menuItems.find((m) => m.name === item.name);
                    const price = menuItem?.price || 0;
                    const itemTotal = price * (item.quantity || 0);

                    return (
                        <li
                            key={index}
                            className="flex flex-row items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                        >
                            <p className="text-neutral-900 dark:text-neutral-50 font-medium">
                                <span className="text-green-600 dark:text-green-400 font-semibold">
                                    {item.quantity}x
                                </span>{' '}
                                {item.name}
                                {price > 0 && (
                                    <span className="text-neutral-600 dark:text-neutral-400 text-sm ml-2">
                                        (${itemTotal.toFixed(2)})
                                    </span>
                                )}
                            </p>
                            <div className="flex flex-row items-center gap-3">
                                <EditIcon
                                    action={() =>
                                        onEdit({
                                            ...order,
                                            category: 'orders',
                                            item,
                                            index,
                                        })
                                    }
                                    className="h-4 w-4 text-neutral-600 hover:text-green-600 dark:text-neutral-400 dark:hover:text-green-400 cursor-pointer transition-all"
                                />
                                <DeleteIcon
                                    action={() =>
                                        onDelete({
                                            category: 'orders',
                                            data: order,
                                            index,
                                        })
                                    }
                                    className="h-4 w-4 font-semibold text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 cursor-pointer transition-all"
                                />
                            </div>
                        </li>
                    );
                })}
                {total > 0 && (
                    <li className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border-t-2 border-green-200 dark:border-green-800 mt-2">
                        <span className="text-neutral-900 dark:text-neutral-50 font-bold">Total</span>
                        <span className="text-green-600 dark:text-green-400 font-bold text-lg">
                            ${total.toFixed(2)}
                        </span>
                    </li>
                )}
            </ul>
        </li>
    );
};
