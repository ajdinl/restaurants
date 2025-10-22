'use client';

import { useState, useEffect } from 'react';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        try {
            setLoading(true);
            setError(null);

            const response = await fetch('/api/auth/session');
            const session = await response.json();

            if (session && session.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    user_metadata: {
                        full_name: session.user.full_name,
                        is_admin: session.user.is_admin,
                    },
                });
            } else {
                setUser(null);
            }
        } catch (err) {
            setError(err.message || 'Failed to fetch user');
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return {
        user,
        loading,
        error,
        refetch: fetchUser,
        isAdmin: user?.user_metadata?.is_admin || false,
        fullName: user?.user_metadata?.full_name || '',
    };
};
