import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

interface AxiosError {
    response?: {
        data: {
            message: string;
        };
    };
}

export const useDeleteAccount = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const deleteAccount = async (username: string) => {
        setLoading(true);
        setError(null);
        try {
            await axiosInstance.delete(`/users/delete`, {
                data: { username }
            });
        } catch (err) {
            console.error('Error during delete account:', err);
            const axiosError = err as AxiosError;
            setError(axiosError.response ? axiosError.response.data.message : 'Server error');
            throw err;
        } finally {
            setLoading(false);
        }
    }

    return { deleteAccount, loading, error };
};
