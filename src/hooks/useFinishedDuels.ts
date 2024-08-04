// ========== PACKAGES ========== \\
import { useState, useEffect, useCallback } from 'react';

// ========== TYPES & UTILS ========== \\
import axiosInstance from '../utils/axiosInstance';
import { Duel, ApiResponse } from '../types';


const useFinishedDuels = (username: string) => {
  const [duels, setDuels] = useState<Duel[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchDuels = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse<Duel>>('/duel/finished', {
        params: { username }
      });
      setDuels(response.data.duels || []);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchDuels();
    };
    fetchData().catch(error => {
      console.error('Error fetching finished duels:', error);
    });
  }, [fetchDuels, refresh]);

  const refetch = () => setRefresh((prev) => !prev);

  return { duels, loading, error, refetch };
};

export default useFinishedDuels;
