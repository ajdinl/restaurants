'use client';

import { useState, useEffect, useCallback } from 'react';

export const useRestaurants = (userId = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchRestaurants = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const url = userId ? `/api/restaurants?userId=${userId}` : '/api/restaurants';
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to fetch restaurants');
            }

            const result = await response.json();
            setData(result.data || null);
        } catch (err) {
            setError(err.message);
            setData(null);
        } finally {
            setLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchRestaurants();
    }, [fetchRestaurants]);

    return {
        data,
        loading,
        error,
        refetch: fetchRestaurants,
    };
};
