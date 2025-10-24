import { EditIcon, DeleteIcon } from '@/components';

export const ReservationCard = ({ reservation, onEdit, onDelete, isExpanded }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'reserved':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'cancelled':
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
            default:
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
        }
    };

    if (!isExpanded) {
        return (
            <li className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all border border-transparent hover:border-neutral-200 dark:hover:border-neutral-600">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="w-9 h-9 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-sm flex-shrink-0">
                        {reservation.number}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold text-neutral-900 dark:text-neutral-50">
                            Reservation #{reservation.number}
                        </p>
                        <p className="text-neutral-600 dark:text-neutral-400 text-xs mt-0.5">
                            Table #{reservation.table_number} · {reservation.capacity} guests
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                    </span>
                </div>
            </li>
        );
    }

    return (
        <li className="flex flex-col bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-purple-300 dark:hover:border-purple-700 transition-all mb-3">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-semibold">
                            {reservation.number}
                        </div>
                        <div>
                            <p className="text-neutral-900 dark:text-neutral-50 font-semibold">
                                Reservation #{reservation.number}
                            </p>
                            <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                                Table #{reservation.table_number}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <span
                            className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(reservation.status)}`}
                        >
                            {reservation.status}
                        </span>
                        <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                            {reservation.capacity} guests
                        </span>
                    </div>
                </div>
                <div className="flex flex-row items-center gap-3">
                    <EditIcon
                        action={() =>
                            onEdit({
                                ...reservation,
                                category: 'reservations',
                            })
                        }
                        className="h-5 w-5 text-neutral-600 hover:text-purple-600 dark:text-neutral-400 dark:hover:text-purple-400 cursor-pointer transition-all"
                    />
                    <DeleteIcon
                        action={() =>
                            onDelete({
                                category: 'reservations',
                                data: reservation,
                            })
                        }
                        className="h-5 w-5 font-semibold text-neutral-600 hover:text-red-600 dark:text-neutral-400 dark:hover:text-red-400 cursor-pointer transition-all"
                    />
                </div>
            </div>
        </li>
    );
};
