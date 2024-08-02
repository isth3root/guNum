// ========== PACKAGES ========== \\
import { useState } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";


const useAcceptDuelRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const acceptDuelRequest = async (duelId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/duel/accept", { duelId });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to accept duel request");
    } finally {
      setLoading(false);
    }
  };

  return { acceptDuelRequest, loading, error, data };
};

export default useAcceptDuelRequest;
