import { ReservationCard } from '../cards/ReservationCard';
import DashboardWrapper from '../DashboardWrapper';

export const ReservationsSection = ({
    reservations,
    tables,
    view,
    loading,
    restaurantId,
    onEdit,
    onDelete,
    onAddReservation,
}) => {
    const reservationNumbers = reservations?.map((reservation) => reservation.number).slice(0, 5) || [];
    const totalReservations = reservations?.length || 0;
    const totalGuests = reservations?.reduce((acc, res) => acc + (res.capacity || 0), 0) || 0;
    const confirmedCount = reservations?.filter((res) => res.status?.toLowerCase() === 'confirmed').length || 0;

    return (
        <DashboardWrapper
            wrapperData={{
                type: 'reservations',
                title: 'Reservations',
                description: 'View and manage customer table reservations.',
                buttonText: 'Add Reservation',
                view,
                loading,
                openNewModal: onAddReservation,
                modalData: {
                    category: 'Reservation',
                    restaurantId,
                    reservationNumbers,
                    tables,
                },
            }}
        >
            {!view && totalReservations > 0 && (
                <div className="flex items-center gap-4 mb-4 p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-purple-600 dark:text-purple-400"
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
                        <span className="font-medium text-purple-700 dark:text-purple-300">
                            {totalReservations} reservations
                        </span>
                    </div>
                    <div className="w-px h-4 bg-purple-300 dark:bg-purple-700"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <span className="font-medium text-purple-700 dark:text-purple-300">
                            {confirmedCount} confirmed
                        </span>
                    </div>
                    <div className="w-px h-4 bg-purple-300 dark:bg-purple-700"></div>
                    <div className="flex items-center gap-2 text-sm">
                        <svg
                            className="w-4 h-4 text-purple-600 dark:text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        <span className="font-medium text-purple-700 dark:text-purple-300">{totalGuests} guests</span>
                    </div>
                </div>
            )}
            <ul className="space-y-2">
                {!view
                    ? reservations
                          ?.sort((a, b) => a.number - b.number)
                          .slice(0, 5)
                          ?.map((reservation) => (
                              <ReservationCard
                                  key={reservation.id}
                                  reservation={reservation}
                                  tables={tables}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  isExpanded={false}
                              />
                          ))
                    : reservations
                          ?.sort((a, b) => a.number - b.number)
                          ?.map((reservation) => (
                              <ReservationCard
                                  key={reservation.id}
                                  reservation={reservation}
                                  tables={tables}
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  isExpanded={true}
                              />
                          ))}
            </ul>
        </DashboardWrapper>
    );
};
