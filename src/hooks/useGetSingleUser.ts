// ========== PACKAGES ========== \\
import { useEffect, useState } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";
import axios from "axios";
import { User } from "../types";


const useGetSingleUser = (username: string) => {
  const [singleUser, setSingleUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {

        const response = await axiosInstance.get<User>("/users/one", {
          params: { username },
        });
        setSingleUser(response.data);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || "An unknown error occurred");
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchUser().catch(error => {
        console.error('Error fetching user:', error);
      });
    } else {
      setSingleUser(null);
      setError(null);
      setLoading(false);
    }
  }, [username]);

  return { singleUser, loading, error };
};

export default useGetSingleUser;
