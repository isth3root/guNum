// ========== PACKAGES ========== \\
import { useState } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from '../utils/axiosInstance';


const useSendDuelRequest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState(null);

  const sendDuelRequest = async (
    senderUsername: string,
    receiverUsername: string,
    difficulty: "EASY" | "MEDIUM" | "HARD"
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post("/duel/send", {
        senderUsername,
        receiverUsername,
        difficulty,
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to send duel request");
    } finally {
      setLoading(false);
    }
  };

  return { sendDuelRequest, loading, error, data };
};

export default useSendDuelRequest;
