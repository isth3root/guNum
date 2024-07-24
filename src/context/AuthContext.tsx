// context/AuthContext.tsx

import React, { createContext, useState, useEffect } from "react";

type User = {
  _id: string;
  username: string;
  score: {
    easy: number;
    medium: number;
    hard: number;
  };
  duelXP: number;
};

type ContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const initialUser: User | null = null;

const AuthContext = createContext<ContextType>({
  user: initialUser,
  setUser: () => {},
});
interface IProps extends React.PropsWithChildren {}
export const AuthProvider: React.FC<IProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : initialUser;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;
