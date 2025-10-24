import { EditIcon, DeleteIcon } from '@/components';

export const MenuItemCard = ({ item, index, menu, onEdit, onDelete, isExpanded }) => {
    if (!isExpanded) {
        return (
            <div className="text-neutral-900 dark:text-neutral-50 py-2">
                <p className="font-medium">{item.name}</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">{item.ingredients?.join(', ')}</p>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mt-1">${item.price}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full items-center justify-between bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <div className="flex-1">
                <p className="text-neutral-900 dark:text-neutral-50 font-medium">{item.name}</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">{item.ingredients?.join(', ')}</p>
                <p className="text-primary-600 dark:text-primary-400 font-semibold mt-2">${item.price}</p>
            </div>
            <div className="flex flex-row items-center gap-3 ml-4">
                <EditIcon
                    action={() =>
                        onEdit({
                            ...menu,
                            category: 'menu',
                            item,
                            index,
                        })
                    }
                    className="h-5 w-5 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 cursor-pointer transition-all"
                />
                <DeleteIcon
                    action={() =>
                        onDelete({
                            category: 'menu',
                            data: menu,
                            index,
                        })
                    }
                    className="h-5 w-5 font-semibold text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 cursor-pointer transition-all"
                />
            </div>
        </div>
    );
};
