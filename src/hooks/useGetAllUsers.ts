import { useState } from 'react';
import axiosInstance from '../utils/axiosInstance.ts';

interface User {
  username: string;
  password: string;
  score: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface AxiosError {
  response?: {
    data: {
      message: string;
    };
  };
}

export const useGetAllUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllUsers = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axiosInstance.get<User[]>('/users/all');
            setUsers(response.data)
        } catch (err: any) {
            console.error('Error during save score:', err);
            const axiosError = err as AxiosError;
            setError(axiosError.response ? axiosError.response.data.message : 'Server error');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {getAllUsers, users, loading, error}
}