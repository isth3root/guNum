// ========== PACKAGES ========== \\
import { useState, useEffect, useCallback } from 'react';

// ========== TYPES & UTILS ========== \\
import axiosInstance from '../utils/axiosInstance';
import { DuelRequest, ApiResponse } from '../types';


const useDuelRequests = (username: string) => {
  const [requests, setRequests] = useState<DuelRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refresh, setRefresh] = useState<boolean>(false);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get<ApiResponse<DuelRequest>>('/duel/requests', {
        params: { username }
      });
      setRequests(response.data.requests || []);
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
    fetchRequests();
  }, [fetchRequests, refresh]);

  const refetch = () => setRefresh((prev) => !prev);

  return { requests, loading, error, refetch };
};

export default useDuelRequests;
