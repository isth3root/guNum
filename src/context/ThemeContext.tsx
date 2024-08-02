// ========== PACKAGES ========== \\
import React, { createContext, useState, useEffect } from "react";

// ========== TYPES & UTILS ========== \\
import { Theme } from "../types";
import { ThemeContextType } from "../types";

const initTheme: Theme = "DARK";

const ThemeContext = createContext<ThemeContextType>({
  theme: initTheme,
  setTheme: () => {},
});

interface IProps extends React.PropsWithChildren {}

export const ThemeProvider: React.FC<IProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(initTheme);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
