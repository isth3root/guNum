import { useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import AppContext from "../context/AuthContext";

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

export const useAuth = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(AppContext);

  const signUp = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<User>("/users/add", {
        username,
        password,
      });
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(response.data);

      return response.data;
    } catch (err: any) {
      console.error("Error during sign up:", err);
      const axiosError = err as AxiosError;
      setError(
        axiosError.response ? axiosError.response.data.message : "Server error"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { signUp, loading, error };
};
