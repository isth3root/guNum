// ========== PACKAGES ========== \\
import { useState, useContext } from "react";

// ========== TYPES & UTILS ========== \\
import { User } from "../types";
import { AxiosError } from "../types";
import { SignupResponse } from "../types";
import axiosInstance from "../utils/axiosInstance";

// ========== CONTEXTES ========== \\
import AppContext from "../context/AuthContext";


export const useSignup = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { setUser } = useContext(AppContext);

  const signup = async (username: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<SignupResponse>("/users/signup", {
        username,
        password,
      });
      const {user, token} = response.data;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token)
      setUser(user);

      return user;
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
