import React from "react";

export interface Duel {
  _id: string;
  sender: string;
  receiver: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "PENDING" | "ACTIVE" | "FINISHED";
  senderGuesses?: number;
  receiverGuesses?: number;
  winner?: string;
}

export interface DuelRequest {
  _id: string;
  sender: string;
  receiver: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  status: "PENDING" | "ACTIVE" | "FINISHED";
}

export interface ApiResponse<T> {
  requests?: T[];
  duels?: T[];
  error?: string;
}

export interface User {
  _id: string;
  username: string;
  numSinglePlayScore: {
    easy: number;
    medium: number;
    hard: number;
  };
  numDuelXP: number;
}

export interface AxiosError {
  response?: {
    data: {
      message: string;
    }
  }
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface ContextMenuProps {
  children: React.ReactNode;
  handleDifficultyChange: (difficulty: "EASY" | "MEDIUM" | "HARD") => void;
}

export interface DifficultyDropdownProps {
  difficulty: "EASY" | "MEDIUM" | "HARD" | "DuelXP";
  handleDifficultyChange: (
    difficulty: "EASY" | "MEDIUM" | "HARD" | "DuelXP"
  ) => void
}

export interface GameControlsProps {
  themes: "PINK" | "DARK" | "PURPLE" | "BLUE";
  gameOver: boolean;
  guessCount: number;
  handleNewGame: () => void;
}

export interface GameGridProps {
  numbers: number[];
  shuffledIndices: number[];
  crossedNumbers: number[];
  correctGuess: number | null;
  handleClick: (index: number) => void;
  highlightCorrectNumber: boolean;
}

export interface ActiveProps {
  users: User[];
}

export interface RequestProps {
  users: User[];
}

export interface FinishedProps {
  users: User[];
}

export interface LeaderBoardListProps {
  users: User[];
  themes: 'PINK' | 'DARK' | 'PURPLE' | 'BLUE';
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP';
  currentUser: User | null;
  getScoreByDifficulty: (user: User, difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP') => number;
}

export type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
}

export type Theme = "DARK" | "PINK" | "BLUE" | "PURPLE";

export type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

export interface UseRecordDuelGuessesResponse {
  recordDuelGuesses: (
    duelId: string,
    username: string,
    guesses: number
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface SignupResponse {
  user: User,
  token: string
}

export interface UseSortedUsersProps {
  users: User[];
  getSortedUsers: (difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'DuelXP') => void;
  loading: boolean;
  error: string | null;
}