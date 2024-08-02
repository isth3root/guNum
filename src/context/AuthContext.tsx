// ========== PACKAGES ========== \\
import React, { createContext, useState, useEffect } from "react";

// ========== TYPES & UTILS ========== \\
import { User } from "../types";
import { UserContextType } from "../types";


const initialUser: User | null = null;

const AuthContext = createContext<UserContextType>({
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
