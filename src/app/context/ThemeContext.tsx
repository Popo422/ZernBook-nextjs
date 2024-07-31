"use client";

import { createContext, useState } from "react";

export const ThemeContext = createContext({
  theme: "dark",
  setTheme: (theme: string) => {},
});

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("dark");
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
export default ThemeProvider;
