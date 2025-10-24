import { EditIcon, DeleteIcon } from '@/components';

export const TableCard = ({ table, onEdit, onDelete, isExpanded }) => {
    if (!isExpanded) {
        return (
            <li className="text-neutral-900 dark:text-neutral-50 py-2">
                <span className="font-medium">Table #{table.number}</span>
                <span className="text-neutral-600 dark:text-neutral-400 text-sm ml-2">
                    · Capacity: {table.capacity}
                </span>
            </li>
        );
    }

    return (
        <li className="flex flex-row w-full items-center justify-between bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-700 transition-all">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold">
                    {table.number}
                </div>
                <div>
                    <p className="text-neutral-900 dark:text-neutral-50 font-medium">Table #{table.number}</p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">Capacity: {table.capacity} guests</p>
                </div>
            </div>
            <div className="flex flex-row items-center gap-3">
                <EditIcon
                    action={() =>
                        onEdit({
                            ...table,
                            category: 'tables',
                        })
                    }
                    className="h-5 w-5 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 cursor-pointer transition-all"
                />
                <DeleteIcon
                    action={() =>
                        onDelete({
                            category: 'tables',
                            data: table,
                        })
                    }
                    className="h-5 w-5 font-semibold text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 cursor-pointer transition-all"
                />
            </div>
        </li>
    );
};
