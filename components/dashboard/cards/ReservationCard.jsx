import { EditIcon, DeleteIcon } from '@/components';

export const ReservationCard = ({ reservation, onEdit, onDelete, isExpanded }) => {
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'confirmed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200';
        }
    };

    if (!isExpanded) {
        return (
            <li className="flex flex-col text-neutral-900 dark:text-neutral-50 py-2">
                <p className="font-semibold">Reservation #{reservation.number}</p>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                    Table #{reservation.table_number} · {reservation.capacity} guests · {reservation.status}
                </p>
            </li>
        );
    }

    return (
        <li className="flex flex-col bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-primary-300 dark:hover:border-primary-700 transition-all mb-3">
            <div className="flex flex-row items-center justify-between w-full">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 flex items-center justify-center font-semibold">
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
                        className="h-5 w-5 text-neutral-600 hover:text-primary-600 dark:text-neutral-400 dark:hover:text-primary-400 cursor-pointer transition-all"
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
