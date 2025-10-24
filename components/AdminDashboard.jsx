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
            <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-6 p-6 md:gap-8 md:p-8 bg-neutral-50 dark:bg-neutral-900">
                {error && <ErrorMessage error={error} />}
                {!view && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-primary-100 dark:bg-primary-900 rounded-2xl flex items-center justify-center mb-6">
                            <svg
                                className="w-12 h-12 text-primary-600 dark:text-primary-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                />
                            </svg>
                        </div>
                        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-50 mb-3">
                            Admin Dashboard
                        </h2>
                        <p className="text-neutral-600 dark:text-neutral-400 text-center max-w-md">
                            Manage all restaurants, users, and system configurations from one central location
                        </p>
                    </div>
                )}
                {view === 'restaurants' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Restaurants</CardTitle>
                            <CardDescription>Manage and oversee all restaurant locations</CardDescription>
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
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New User</CardTitle>
                                <CardDescription>Add a new user to the system</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NewUserForm />
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Create New Restaurant</CardTitle>
                                <CardDescription>Register a new restaurant location</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <NewRestaurantForm />
                            </CardContent>
                        </Card>
                    </div>
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
