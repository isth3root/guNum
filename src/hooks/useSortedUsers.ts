// ========== PACKAGES ========== \\
import { useState, useCallback } from 'react';

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";
import { User } from '../types';
import { UseSortedUsersProps } from '../types';


export const useSortedUsers = (): UseSortedUsersProps => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getSortedUsers = useCallback(async (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP') => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get<User[]>('/users/sort', {
        params: { difficulty }
      });
      setUsers(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching sorted users');
    } finally {
      setLoading(false);
    }
  }, []);

  return { users, getSortedUsers, loading, error };
};
