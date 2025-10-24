import { EditIcon, DeleteIcon } from '@/components';

export const MenuItemCard = ({ item, index, menu, onEdit, onDelete, isExpanded }) => {
    if (!isExpanded) {
        return (
            <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-600">
                <div className="flex-1 min-w-0">
                    <p className="font-semibold text-neutral-900 dark:text-neutral-50 truncate">{item.name}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-0.5 truncate">
                        {item.ingredients?.join(', ')}
                    </p>
                </div>
                <div className="flex items-center gap-3 ml-3 flex-shrink-0">
                    <span className="text-base font-bold text-primary-600 dark:text-primary-400">${item.price}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-row w-full items-center justify-between bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-orange-300 dark:hover:border-orange-700 transition-all">
            <div className="flex-1">
                <p className="text-neutral-900 dark:text-neutral-50 font-medium">{item.name}</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">{item.ingredients?.join(', ')}</p>
                <div className="flex items-center gap-2 mt-2">
                    <span className="text-lg font-bold text-orange-600 dark:text-orange-400">${item.price}</span>
                </div>
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
                    className="h-5 w-5 text-neutral-600 hover:text-orange-600 dark:text-neutral-400 dark:hover:text-orange-400 cursor-pointer transition-all"
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
