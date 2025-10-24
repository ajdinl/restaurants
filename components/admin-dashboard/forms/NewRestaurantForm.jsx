'use client';

import { useState } from 'react';
import { Button, LoadingSpinner, ErrorMessage } from '@/components';
import { addItem } from '@/services/api.service';
import { useUsers } from '@/hooks/useUsers';

export default function NewRestaurantForm() {
    const [newRestaurant, setNewRestaurant] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    const { users, loading, error } = useUsers();

    async function handleSubmit(e) {
        e.preventDefault();
        setSubmitError(null);
        setSuccessMessage('');

        const { user_id, name, address, phone } = newRestaurant;

        if (!user_id || !name || !address || !phone) {
            setSubmitError('All fields are required');
            return;
        }

        try {
            setSubmitting(true);
            const { item, error } = await addItem('restaurants', {
                name,
                address,
                phone,
                user_id,
            });

            if (error) {
                setSubmitError(error.message || 'Failed to create restaurant');
                return;
            }

            setNewRestaurant({});
            e.target.reset();
            setSuccessMessage('Restaurant created successfully!');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setSubmitError(error.message || 'Failed to create restaurant');
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center p-8">
                <LoadingSpinner size="md" />
            </div>
        );
    }

    return (
        <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <ErrorMessage error={error} />}
            {submitError && <ErrorMessage error={submitError} />}
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 flex items-center gap-3">
                    <svg
                        className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0"
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
                    <p className="text-green-700 dark:text-green-300 font-medium">{successMessage}</p>
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="user_id" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Restaurant Owner
                </label>
                <div className="relative">
                    <select
                        className="block w-full rounded-lg px-4 py-3 pr-10 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all appearance-none"
                        name="user_id"
                        id="user_id"
                        required
                        value={newRestaurant.user_id || ''}
                        onChange={(e) => setNewRestaurant({ ...newRestaurant, user_id: e.target.value })}
                        disabled={submitting}
                    >
                        <option value="">Select a user</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.email} - {user.full_name}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg
                            className="w-4 h-4 text-neutral-500 dark:text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                {users.length === 0 && !loading && (
                    <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                        <svg
                            className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            No users available. Please create a user first.
                        </p>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Restaurant Name
                </label>
                <input
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
                    type="text"
                    name="name"
                    id="name"
                    required
                    minLength={2}
                    value={newRestaurant.name || ''}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, name: e.target.value })}
                    disabled={submitting}
                    placeholder="Enter restaurant name"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="address" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Address
                </label>
                <input
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
                    type="text"
                    name="address"
                    id="address"
                    required
                    minLength={5}
                    value={newRestaurant.address || ''}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, address: e.target.value })}
                    disabled={submitting}
                    placeholder="Enter restaurant address"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Phone Number
                </label>
                <input
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={newRestaurant.phone || ''}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                    disabled={submitting}
                    placeholder="Enter phone number"
                />
            </div>

            <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting || users.length === 0}
            >
                {submitting ? (
                    <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            ></circle>
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                        </svg>
                        Creating...
                    </span>
                ) : (
                    'Add New Restaurant'
                )}
            </Button>
        </form>
    );
}
