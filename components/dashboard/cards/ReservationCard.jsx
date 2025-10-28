import { EditIcon, DeleteIcon } from '@/components';

export const ReservationCard = ({ reservation, tables, onEdit, onDelete, isExpanded }) => {
    const table = tables?.find((t) => t.id === reservation.table_id);
    const tableNumber = table?.number || reservation.table_number || 'N/A';

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

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
                            Table #{tableNumber} · {reservation.capacity} guests
                        </p>
                        <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1 flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <span className="font-medium">
                                {reservation.date ? formatDate(reservation.date) : 'No date'}
                            </span>
                            <span>·</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            <span className="font-medium">{reservation.time || 'No time'}</span>
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
        <li className="relative flex flex-col bg-white dark:bg-neutral-700 p-4 rounded-lg border border-neutral-200 dark:border-neutral-600 hover:border-purple-300 dark:hover:border-purple-700 transition-all mb-3">
            <div className="absolute top-4 right-4 flex flex-row items-center gap-3">
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
            <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 flex items-center justify-center font-semibold">
                    {reservation.number}
                </div>
                <div>
                    <p className="text-neutral-900 dark:text-neutral-50 font-semibold">
                        Reservation #{reservation.number}
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm">Table #{tableNumber}</p>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(reservation.status)}`}>
                    {reservation.status}
                </span>
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">{reservation.capacity} guests</span>
            </div>
            <div className="flex items-center gap-2 mt-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-600">
                <div className="flex items-center gap-2 flex-1">
                    <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Date</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                            {reservation.date ? formatDate(reservation.date) : 'Not set'}
                        </span>
                    </div>
                </div>
                <div className="w-px h-10 bg-neutral-300 dark:bg-neutral-600"></div>
                <div className="flex items-center gap-2 flex-1">
                    <svg
                        className="w-5 h-5 text-purple-600 dark:text-purple-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <div className="flex flex-col">
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">Time</span>
                        <span className="font-semibold text-neutral-900 dark:text-neutral-50">
                            {reservation.time || 'Not set'}
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
};
