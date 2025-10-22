'use client';

import { useState } from 'react';
import { createUser } from '@/services/api.service';
import { Button, ErrorMessage } from '@/components';

export default function NewUserForm() {
    const [newUser, setNewUser] = useState({
        email: '',
        password: '',
        full_name: '',
        is_admin: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setSuccessMessage('');

        if (!newUser.email || !newUser.password || !newUser.full_name) {
            setError('All fields are required');
            return;
        }

        if (newUser.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        try {
            setSubmitting(true);
            const { data, error: apiError } = await createUser(newUser.email, newUser.password, {
                full_name: newUser.full_name,
                is_admin: newUser.is_admin,
            });

            if (apiError) {
                setError(apiError.message || 'Failed to create user');
                return;
            }

            setNewUser({
                email: '',
                password: '',
                full_name: '',
                is_admin: false,
            });
            e.target.reset();
            setSuccessMessage('User created successfully!');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (err) {
            setError(err.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form className="space-y-4" onSubmit={handleSubmit}>
            {error && <ErrorMessage error={error} />}
            {successMessage && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
                    <p className="text-green-600 dark:text-green-400">{successMessage}</p>
                </div>
            )}

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Email</span>
                <input
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    disabled={submitting}
                    placeholder="user@example.com"
                />
            </label>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Password</span>
                <input
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    type="password"
                    name="password"
                    id="password"
                    required
                    minLength={6}
                    value={newUser.password}
                    onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    disabled={submitting}
                    placeholder="Minimum 6 characters"
                />
            </label>

            <label className="block">
                <span className="text-gray-700 dark:text-gray-400">Full Name</span>
                <input
                    className="mt-1 p-1 block w-full rounded border-gray-300 dark:bg-gray-700 dark:text-white shadow-md focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                    type="text"
                    name="full_name"
                    id="full_name"
                    required
                    minLength={2}
                    value={newUser.full_name}
                    onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                    disabled={submitting}
                    placeholder="John Doe"
                />
            </label>

            <label className="flex items-center">
                <input
                    className="form-checkbox h-5 w-5 text-indigo-600"
                    type="checkbox"
                    name="is_admin"
                    checked={newUser.is_admin}
                    onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                    disabled={submitting}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-400">Admin (Full access to all features)</span>
            </label>

            <Button
                type="submit"
                className="mt-4 bg-purple-500 hover:bg-purple-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={submitting}
            >
                {submitting ? 'Creating...' : 'Add New User'}
            </Button>
        </form>
    );
}
