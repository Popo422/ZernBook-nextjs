"use client";

import { useContext } from "react";
import { ThemeContext } from "./context/ThemeContext";

const App = ({ children }: { children: React.ReactNode }) => {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <div className="w-full h-full bg-base-300" data-theme={theme}>
      {children}
    </div>
  );
};

export default App;
