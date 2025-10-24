import { EditIcon, DeleteIcon, Button } from '@/components';

export const OrderCard = ({ order, onEdit, onDelete, onAddDish, isExpanded }) => {
    if (!isExpanded) {
        return (
            <li className="flex flex-col text-neutral-900 dark:text-neutral-50 py-2">
                <p className="font-semibold">Order #{order.number}</p>
                {order.items?.map((item, index) => (
                    <p key={index} className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                        {item.quantity}x {item.name}
                    </p>
                ))}
            </li>
        );
    }

    return (
        <li className="flex flex-col bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-700 transition-all mb-3">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold">
                        {order.number}
                    </div>
                    <span className="text-neutral-900 dark:text-neutral-50 font-semibold">Order #{order.number}</span>
                </div>
                <button
                    className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-600 hover:bg-primary-700 text-white text-xl font-semibold transition-all"
                    onClick={() => onAddDish({ category: 'Order Dish', order })}
                >
                    +
                </button>
            </div>
            <ul className="space-y-2">
                {order.items?.map((item, index) => (
                    <li
                        key={index}
                        className="flex flex-row items-center justify-between p-2 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                    >
                        <p className="text-neutral-900 dark:text-neutral-50 font-medium">
                            <span className="text-primary-600 dark:text-primary-400 font-semibold">
                                {item.quantity}x
                            </span>{' '}
                            {item.name}
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
                                className="h-4 w-4 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 cursor-pointer transition-all"
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
                ))}
            </ul>
        </li>
    );
};
