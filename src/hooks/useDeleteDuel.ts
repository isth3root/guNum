// ========== PACKAGES ========== \\
import { useState } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";


const useDeleteDuel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const deleteDuel = async (duelId: string) => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/duel/delete", { duelId });
    } catch (err) {
      console.error(err);
      setError("Failed to accept duel request");
    } finally {
      setLoading(false);
    }
  };

  return { deleteDuel, loading, error };
};

export default useDeleteDuel;
