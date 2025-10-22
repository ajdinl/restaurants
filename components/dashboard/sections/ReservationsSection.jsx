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

    return (
        <DashboardWrapper
            wrapperData={{
                type: 'reservations',
                title: 'Reservations',
                description: 'List of current reservations.',
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
            <ul className={`${view ? 'space-y-4' : 'space-y-2'}`}>
                {!view
                    ? reservations
                          ?.sort((a, b) => a.number - b.number)
                          .slice(0, 5)
                          ?.map((reservation) => (
                              <ReservationCard
                                  key={reservation.id}
                                  reservation={reservation}
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
                                  onEdit={onEdit}
                                  onDelete={onDelete}
                                  isExpanded={true}
                              />
                          ))}
            </ul>
        </DashboardWrapper>
    );
};
