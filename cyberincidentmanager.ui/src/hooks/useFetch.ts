import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

interface FetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string;
    refetch: () => void;
}

export function useFetch<T>(url: string, token?: string): FetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const fetchData = useCallback(() => {
        setLoading(true);
        setError('');

        const config = token
            ? { headers: { Authorization: `Bearer ${token}` } }
            : undefined;

        axios
            .get<T>(url, config)
            .then((res) => {
                setData(res.data);
            })
            .catch((err) => {
                setError(err.response?.data || 'Erreur inconnue');
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, token]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
}