import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const useDenyDuelRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const denyDuelRequest = async (duelId: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/duel/deny", { duelId });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to accept duel request");
    } finally {
      setLoading(false);
    }
  };

  return { denyDuelRequest, loading, error, data };
};

export default useDenyDuelRequest;
