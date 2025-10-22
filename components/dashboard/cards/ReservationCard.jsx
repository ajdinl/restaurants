import { EditIcon, DeleteIcon } from '@/components';

export const ReservationCard = ({ reservation, onEdit, onDelete, isExpanded }) => {
    if (!isExpanded) {
        return (
            <li className="flex flex-col text-black dark:text-white">
                <p className="font-bold">
                    Reservation #{reservation.number} - Table #{reservation.table_number} - Status: {reservation.status}{' '}
                    - Number of guests: {reservation.capacity}
                </p>
            </li>
        );
    }

    return (
        <li className="flex flex-col md:flex-row md:items-center mb-4 bg-gray-100 dark:bg-gray-700 p-3 rounded">
            <div className="flex flex-row items-center justify-between w-full">
                <span className="sm:-mt-8 mb-2 md:-mt-0 md:mb-0 text-black dark:text-white mr-2 min-w-28">
                    Reservation #{reservation.number} - Table #{reservation.table_number} - Status: {reservation.status}{' '}
                    - Number of guests: {reservation.capacity}
                </span>
                <div className="flex flex-row items-center mx-2">
                    <EditIcon
                        action={() =>
                            onEdit({
                                ...reservation,
                                category: 'reservations',
                            })
                        }
                        className="h-5 w-5 mr-2"
                    />
                    <DeleteIcon
                        action={() =>
                            onDelete({
                                category: 'reservations',
                                data: reservation,
                            })
                        }
                    />
                </div>
            </div>
        </li>
    );
};
