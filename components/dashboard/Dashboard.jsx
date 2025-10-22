'use client';

import { useSearchParams } from 'next/navigation';
import { EditModal, NewModal, DeleteModal, LoadingSpinner, ErrorMessage } from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useModal } from '@/hooks/useModal';
import { MenuSection } from './sections/MenuSection';
import { TablesSection } from './sections/TablesSection';
import { OrdersSection } from './sections/OrdersSection';
import { ReservationsSection } from './sections/ReservationsSection';

export default function DashboardComponent() {
    const { user } = useAuth();
    const userId = user?.id;
    const { data, loading, error, refetch } = useRestaurants(userId);
    const {
        isNewModalOpen,
        isEditModalOpen,
        isDeleteModalOpen,
        selectedItem,
        openNewModal,
        closeNewModal,
        openEditModal,
        closeEditModal,
        openDeleteModal,
        closeDeleteModal,
    } = useModal();

    const searchParams = useSearchParams();
    const view = searchParams.get('view');

    const restaurantId = data?.id;
    const restaurantMenu = data?.menu || [];
    const restaurantTables = data?.tables || [];
    const restaurantOrders = data?.orders || [];
    const restaurantReservations = data?.reservations || [];

    if (loading) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <LoadingSpinner size='lg' />
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <>
            <main className='flex min-h-[calc(100vh-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 sm:p-10 bg-white dark:bg-gray-900'>
                {error && <ErrorMessage error={error} />}
                
                <MenuSection
                    menu={restaurantMenu}
                    view={view}
                    loading={loading}
                    restaurantId={restaurantId}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onAddMenu={openNewModal}
                    onAddDish={openNewModal}
                />

                <TablesSection
                    tables={restaurantTables}
                    view={view}
                    loading={loading}
                    restaurantId={restaurantId}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onAddTable={openNewModal}
                />

                <OrdersSection
                    orders={restaurantOrders}
                    tables={restaurantTables}
                    view={view}
                    loading={loading}
                    restaurantId={restaurantId}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onAddOrder={openNewModal}
                    onAddDish={openNewModal}
                />

                <ReservationsSection
                    reservations={restaurantReservations}
                    tables={restaurantTables}
                    view={view}
                    loading={loading}
                    restaurantId={restaurantId}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                    onAddReservation={openNewModal}
                />
            </main>

            {isNewModalOpen && (
                <NewModal
                    setShowNewModal={closeNewModal}
                    selected={selectedItem}
                    restaurantId={restaurantId}
                    fetchRestaurantsData={refetch}
                />
            )}
            {isEditModalOpen && (
                <EditModal
                    setShowEditModal={closeEditModal}
                    selected={selectedItem}
                    fetchRestaurantsData={refetch}
                />
            )}
            {isDeleteModalOpen && (
                <DeleteModal
                    setShowDeleteModal={closeDeleteModal}
                    selected={selectedItem}
                    getRestaurantsData={refetch}
                />
            )}
        </>
    );
}

