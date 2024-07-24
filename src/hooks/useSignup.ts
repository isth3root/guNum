import { useState, useContext } from "react";
import axiosInstance from "../utils/axiosInstance";
import AppContext from "../context/AuthContext";

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

interface AxiosError {
  response?: {
    data: {
      message: string;
    };
  };
}

export const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(AppContext);

  const signup = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<User>("/users/signup", {
        username,
        password,
      });
      const userData = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      return userData;
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

  return { signup, loading, error };
};
