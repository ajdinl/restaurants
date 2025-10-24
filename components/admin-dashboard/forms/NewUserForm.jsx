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
        <form className="space-y-5" onSubmit={handleSubmit}>
            {error && <ErrorMessage error={error} />}
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
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address
                </label>
                <input
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={newUser.email}
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    disabled={submitting}
                    placeholder="user@example.com"
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Password
                </label>
                <input
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
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
            </div>

            <div className="space-y-2">
                <label htmlFor="full_name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Full Name
                </label>
                <input
                    className="block w-full rounded-lg px-4 py-3 border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
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
            </div>

            <div className="flex items-center p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
                <input
                    className="w-5 h-5 text-primary-600 bg-white dark:bg-neutral-700 border-neutral-300 dark:border-neutral-600 rounded focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed transition-all"
                    type="checkbox"
                    name="is_admin"
                    id="is_admin"
                    checked={newUser.is_admin}
                    onChange={(e) => setNewUser({ ...newUser, is_admin: e.target.checked })}
                    disabled={submitting}
                />
                <label htmlFor="is_admin" className="ml-3 text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">Admin User</span>
                    <span className="block text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                        Full access to all features and settings
                    </span>
                </label>
            </div>

            <Button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white shadow-sm hover:shadow-md focus:ring-primary-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={submitting}
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
                    'Add New User'
                )}
            </Button>
        </form>
    );
}
