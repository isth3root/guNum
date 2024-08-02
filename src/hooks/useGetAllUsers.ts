// ========== PACKAGES ========== \\
import { useState, useCallback } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";
import { User } from "../types";
import { AxiosError } from "../types";


export const useGetAllUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getAllUsers = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.get<User[]>("/users/all");
      setUsers(response.data);
    } catch (err: any) {
      console.error("Error during save score:", err);
      const axiosError = err as AxiosError;
      setError(
        axiosError.response ? axiosError.response.data.message : "Server error"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { getAllUsers, users, loading, error };
};
