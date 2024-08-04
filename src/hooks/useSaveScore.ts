// ========== PACKAGES ========== \\
import { useState } from "react";

// ========== TYPES & UTILS ========== \\
import axiosInstance from "../utils/axiosInstance";
import { User } from "../types";
import { AxiosError } from "../types";


export const useSaveScore = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const saveScore = async (
    username: string,
    score: number,
    difficulty: "EASY" | "MEDIUM" | "HARD"
  ): Promise<User> => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosInstance.post<User>("/hs", {
        username,
        score,
        difficulty,
      });

      const updatedUser = response.data;

      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUserData = JSON.parse(userData);


        if (!parsedUserData.numSinglePlayScore) {
          parsedUserData.numSinglePlayScore = {
            easy: Infinity,
            medium: Infinity,
            hard: Infinity,
          };
        }

        switch (difficulty) {
          case "EASY":
            parsedUserData.numSinglePlayScore.easy = updatedUser.numSinglePlayScore;
            break;
          case "MEDIUM":
            parsedUserData.numSinglePlayScore.medium = updatedUser.numSinglePlayScore;
            break;
          case "HARD":
            parsedUserData.numSinglePlayScore.hard = updatedUser.numSinglePlayScore;
            break;
          default:
            console.error("Invalid difficulty level");
        }

        localStorage.setItem("user", JSON.stringify(parsedUserData));
      }

      return updatedUser;
    } catch (err: any) {
      console.error("Error during save score:", err);
      const axiosError = err as AxiosError;
      setError(
        axiosError.response ? axiosError.response.data.message : "Server error"
      );
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { saveScore, loading, error };
};
