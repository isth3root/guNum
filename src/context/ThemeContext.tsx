import React, { createContext, useState, useEffect } from 'react';

type Theme = 'DARK' | 'PINK' | 'BLUE' | 'PURPLE';

type ContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initTheme: Theme = 'DARK';

const ThemeContext = createContext<ContextType>({
  theme: initTheme,
  setTheme: () => {},
});

interface IProps extends React.PropsWithChildren {}

export const ThemeProvider: React.FC<IProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(initTheme);

  useEffect(() => {
    
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    if (storedTheme) {
      setTheme(storedTheme);
    }
  }, []);

  
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
