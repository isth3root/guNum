import { useState, useCallback } from "react";
import axiosInstance from "../utils/axiosInstance";

interface AxiosError {
  response?: {
    data: {
      message: string;
    };
  };
}

export const useGetWord = () => {
  const [word, setWord] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const getWord = useCallback(async (subject: string, language: "English" | "Persian") => {
    setLoading(true);
    setError(null);


    try {
      const response = await axiosInstance.get<{ word: string }>(`/word/single`, {
        params: { subject, language },
      });
      
      if (response.data.word) {

        const word = response.data.word;
        setWord(word);
      } else {
        setWord(null);
      }
    } catch (err: any) {
      console.error("Error during fetch word:", err);
      const axiosError = err as AxiosError;
      setError(
        axiosError.response ? axiosError.response.data.message : "Server error"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  return { getWord, word, loading, error };
};
