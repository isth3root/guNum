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
