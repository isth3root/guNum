// ========== PACKAGES ========== \\
import { useState } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";
import { UseRecordDuelGuessesResponse } from "../types";


const useRecordDuelGuesses = (): UseRecordDuelGuessesResponse => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recordDuelGuesses = async (
    duelId: string,
    username: string,
    guesses: number
  ) => {
    setLoading(true);
    setError(null);

    try {
      await axiosInstance.post("/duel/record", {
        duelId,
        username,
        guesses,
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { recordDuelGuesses, loading, error };
};

export default useRecordDuelGuesses;
