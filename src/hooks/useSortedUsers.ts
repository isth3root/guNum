import { useState, useCallback } from 'react';
import axiosInstance from "../utils/axiosInstance";

interface User {
  _id: string;
  username: string;
  score: {
    easy: number;
    medium: number;
    hard: number;
  };
  duelXP: number;
}

interface UseSortedUsersHook {
  users: User[];
  getSortedUsers: (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP') => void;
  loading: boolean;
  error: string | null;
}

export const useSortedUsers = (): UseSortedUsersHook => {
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
