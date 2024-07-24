import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

interface AxiosError {
  response?: {
    data: {
      message: string;
    };
  };
}

export const useLogout = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const logout = async (username: string): Promise<void> => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/users/logout", {
        username,
      });

    } catch (err: any) {
      console.error("Error during logout", err);
      const axiosError = err as AxiosError;
      setError(
        axiosError.response ? axiosError.response.data.message : "Server error"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logout, loading, error };
};
