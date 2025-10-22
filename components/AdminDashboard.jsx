'use client';

import { useSearchParams } from 'next/navigation';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    NewUserForm,
    NewRestaurantForm,
    EditModal,
    NewModal,
    DeleteModal,
    Restaurants,
    LoadingSpinner,
    ErrorMessage,
} from '@/components';
import { useAuth } from '@/hooks/useAuth';
import { useRestaurants } from '@/hooks/useRestaurants';
import { useModal } from '@/hooks/useModal';

export default function AdminDashboardComponent() {
    const { user, loading: userLoading } = useAuth();
    const { data: restaurants, loading: restaurantsLoading, error, refetch } = useRestaurants(null);
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

    if (userLoading || restaurantsLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div>
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10 bg-white dark:bg-gray-900 text-black dark:text-white">
                {error && <ErrorMessage error={error} />}
                {!view && <div className="text-3xl text-center">Welcome to the Admin Dashboard</div>}
                {view === 'restaurants' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurants</CardTitle>
                            <CardDescription>List of all restaurants.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Restaurants
                                restaurants={restaurants || []}
                                openNewModal={openNewModal}
                                setEditSelectedItem={openEditModal}
                                setDeleteSelectedItem={openDeleteModal}
                            />
                        </CardContent>
                    </Card>
                )}
                {view === 'create' && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>Users</CardTitle>
                                <CardDescription>Add a new user.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NewUserForm />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Restaurant</CardTitle>
                                <CardDescription>Add a new restaurant.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NewRestaurantForm />
                            </CardContent>
                        </Card>
                    </>
                )}
            </main>
            {isNewModalOpen && (
                <NewModal
                    setShowNewModal={closeNewModal}
                    selected={selectedItem}
                    isAdmin={true}
                    fetchRestaurantsData={refetch}
                    restaurants={restaurants || []}
                />
            )}
            {isEditModalOpen && (
                <EditModal setShowEditModal={closeEditModal} selected={selectedItem} fetchRestaurantsData={refetch} />
            )}
            {isDeleteModalOpen && (
                <DeleteModal
                    setShowDeleteModal={closeDeleteModal}
                    selected={selectedItem}
                    getRestaurantsData={refetch}
                />
            )}
        </div>
    );
}
