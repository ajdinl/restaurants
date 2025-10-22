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
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <ErrorMessage error={error} />}
            {submitError && <ErrorMessage error={submitError} />}
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                    <p className="text-green-600 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">User</span>
                <select
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                {users.length === 0 && !loading && (
                    <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
                        No users available. Please create a user first.
                    </p>
                )}
            </label>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Restaurant Name</span>
                <input
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            </label>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Address</span>
                <input
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
            </label>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Phone Number</span>
                <input
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    type="tel"
                    name="phone"
                    id="phone"
                    required
                    value={newRestaurant.phone || ''}
                    onChange={(e) => setNewRestaurant({ ...newRestaurant, phone: e.target.value })}
                    disabled={submitting}
                    placeholder="Enter phone number"
                />
            </label>

            <Button
                type="submit"
                className="mt-4 bg-sky-500 hover:bg-sky-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submitting || users.length === 0}
            >
                {submitting ? 'Creating...' : 'Add New Restaurant'}
            </Button>
        </form>
    );
}
