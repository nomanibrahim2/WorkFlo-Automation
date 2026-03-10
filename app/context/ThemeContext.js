import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getTheme, setTheme as storeTheme } from '../utils/storage';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await getTheme();
      if (saved) setMode(saved);
      setReady(true);
    })();
  }, []);

  const toggleTheme = useCallback(async () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    await storeTheme(next);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme, ready }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useThemeMode = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within a ThemeProvider');
  return ctx;
};
