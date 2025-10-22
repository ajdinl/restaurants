'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
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

            await new Promise((resolve) => setTimeout(resolve, 100));
            window.location.href = '/dashboard';
        } catch (err) {
            setError('An error occurred. Please try again.');
            setLoading(false);
        }
    }

    return (
        <form onSubmit={handleLogin} className="space-y-6 w-full md:w-11/12 mx-auto text-center">
            {error && <ErrorMessage error={error} />}

            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                placeholder="Password"
                required
            />
            <Button
                type="submit"
                disabled={loading}
                className="text-blue-500 hover:text-blue-600 border border-blue-500 hover:border-blue-600 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed w-full flex items-center justify-center"
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
