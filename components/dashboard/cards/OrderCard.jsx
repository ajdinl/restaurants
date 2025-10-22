import { EditIcon, DeleteIcon, Button } from '@/components';

export const OrderCard = ({ order, onEdit, onDelete, onAddDish, isExpanded }) => {
    if (!isExpanded) {
        return (
            <li className="flex flex-col text-black dark:text-white">
                <p className="font-bold">Order #{order.number}:</p>
                {order.items?.map((item, index) => (
                    <p key={index} className="text-gray-600 dark:text-gray-400 text-sm">
                        {item.quantity}x {item.name}
                    </p>
                ))}
            </li>
        );
    }

    return (
        <li className="flex flex-col md:flex-row md:items-center mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <button
                className="flex justify-end md:mx-2 md:-mt-1 text-green-400 hover:text-green-500 text-3xl font-semibold"
                onClick={() => onAddDish({ category: 'Order Dish', order })}
            >
                +
            </button>
            <span className="-mt-8 mb-2 md:-mt-0 md:mb-0 text-black dark:text-white mr-2 min-w-28">
                Order #{order.number}:
            </span>
            <ul className="flex flex-col lg:flex-row flex-wrap">
                {order.items?.map((item, index) => (
                    <div key={index} className="flex flex-row items-center justify-between mb-2 md:mb-0 md:mr-4">
                        <p className="text-black dark:text-white">
                            {item.quantity}x {item.name}
                        </p>
                        <div className="flex flex-row items-center mx-2">
                            <EditIcon
                                action={() =>
                                    onEdit({
                                        ...order,
                                        category: 'orders',
                                        item,
                                        index,
                                    })
                                }
                                className="h-5 w-5 mr-2"
                            />
                            <DeleteIcon
                                action={() =>
                                    onDelete({
                                        category: 'orders',
                                        data: order,
                                        index,
                                    })
                                }
                            />
                        </div>
                    </div>
                ))}
            </ul>
        </li>
    );
};
