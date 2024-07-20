import { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

interface User {
  username: string;
  password: string;
  score: {
    easy: number;
    medium: number;
    hard: number;
  };
}

interface AxiosError {
  response?: {
    data: {
      message: string;
    };
  };
}

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

      // Retrieve the user data from localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
        const parsedUserData = JSON.parse(userData);

        // Ensure the score object exists
        if (!parsedUserData.score) {
          parsedUserData.score = {
            easy: Infinity,
            medium: Infinity,
            hard: Infinity,
          };
        }

        // Update the relevant score based on difficulty
        switch (difficulty) {
          case "EASY":
            parsedUserData.score.easy = updatedUser.score;
            break;
          case "MEDIUM":
            parsedUserData.score.medium = updatedUser.score;
            break;
          case "HARD":
            parsedUserData.score.hard = updatedUser.score;
            break;
          default:
            throw new Error("Invalid difficulty level");
        }

        // Save the updated user data back to localStorage
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
