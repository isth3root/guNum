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

interface LoginResponse {
  user: User;
  token: string;
}

export const useLogin = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(AppContext);

  const login = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<LoginResponse>("/users/login", {
        username,
        password,
      });

      const { user, token } = response.data;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
      setUser(user);

      return user;
    } catch (err: any) {
      console.error("Login request error:", err);
      const axiosError = err as AxiosError;
      setError(
        axiosError.response ? axiosError.response.data.message : "Server error"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
};
