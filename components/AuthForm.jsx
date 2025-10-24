'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button, ErrorMessage, LoadingSpinner } from '@/components';

export default function AuthForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const router = useRouter();

    async function handleLogin(e) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!email || !password) {
            setError('Please enter email and password');
            setLoading(false);
            return;
        }

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
                setLoading(false);
                return;
            }

            if (!result?.ok) {
                setError('Login failed. Please try again.');
                setLoading(false);
                return;
            }

            const session = await getSession();
            const redirectUrl = session?.user?.is_admin ? '/admin-dashboard' : '/dashboard';
            window.location.href = redirectUrl;
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-5 w-full md:w-11/12 mx-auto">
            {error && <ErrorMessage error={error} />}

            <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Email Address
                </label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-neutral-400 text-neutral-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
                    placeholder="Enter your email"
                    required
                />
            </div>

            <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="appearance-none rounded-lg relative block w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 placeholder-neutral-400 text-neutral-900 dark:text-neutral-50 bg-white dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:bg-neutral-100 dark:disabled:bg-neutral-700 disabled:cursor-not-allowed transition-all"
                    placeholder="Enter your password"
                    required
                />
            </div>

            <Button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white w-full flex items-center justify-center py-3 shadow-sm hover:shadow-md focus:ring-primary-500 transition-all"
            >
                {loading ? (
                    <>
                        <LoadingSpinner size="sm" className="mr-2" />
                        Signing In...
                    </>
                ) : (
                    'Sign In'
                )}
            </Button>
        </form>
    );
}
