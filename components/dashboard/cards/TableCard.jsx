import { EditIcon, DeleteIcon } from '@/components';

export const TableCard = ({ table, onEdit, onDelete, isExpanded }) => {
    if (!isExpanded) {
        return (
            <li className="text-black dark:text-white">
                Table #{table.number} - Capacity - {table.capacity}
            </li>
        );
    }

    return (
        <li className="flex flex-row w-full items-center justify-between bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <p className="text-black dark:text-white">
                Table #{table.number} - Capacity - {table.capacity}
            </p>
            <div className="flex flex-row items-center">
                <EditIcon
                    action={() =>
                        onEdit({
                            ...table,
                            category: 'tables',
                        })
                    }
                    className="h-5 w-5 mr-4 ml-6"
                />
                <DeleteIcon
                    action={() =>
                        onDelete({
                            category: 'tables',
                            data: table,
                        })
                    }
                />
            </div>
        </li>
    );
};
