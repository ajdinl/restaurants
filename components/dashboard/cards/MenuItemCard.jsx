import { EditIcon, DeleteIcon } from '@/components';

export const MenuItemCard = ({ item, index, menu, onEdit, onDelete, isExpanded }) => {
    if (!isExpanded) {
        return (
            <div className="text-black dark:text-white">
                <p>{item.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.ingredients?.join(', ')}</p>
                <p>${item.price}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <div>
                <p className="text-black dark:text-white">{item.name}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{item.ingredients?.join(', ')}</p>
                <p className="text-black dark:text-white">${item.price}</p>
            </div>
            <div className="flex flex-row items-center">
                <EditIcon
                    action={() =>
                        onEdit({
                            ...menu,
                            category: 'menu',
                            item,
                            index,
                        })
                    }
                    className="h-5 w-5 mr-4"
                />
                <DeleteIcon
                    action={() =>
                        onDelete({
                            category: 'menu',
                            data: menu,
                            index,
                        })
                    }
                />
            </div>
        </div>
    );
};
