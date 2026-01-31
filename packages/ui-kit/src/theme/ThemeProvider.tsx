import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

export type UiKitThemeName = 'default' | string; // allow custom classes like 'theme-kids'

type ThemeContextValue = {
  theme: UiKitThemeName;
  setTheme: (t: UiKitThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function applyThemeClass(theme: UiKitThemeName) {
  const el = document.documentElement; // <html>
  // Clear any previous custom theme classes (keep 'default' as no class)
  // Heuristic: remove classes starting with 'theme-'
  el.classList.forEach((cls) => {
    if (cls.startsWith('theme-')) el.classList.remove(cls);
  });
  if (theme !== 'default') {
    el.classList.add(theme);
  }
}

export const ThemeProvider: React.FC<{
  children: React.ReactNode;
  storageKey?: string;
  initialTheme?: UiKitThemeName;
}> = ({ children, storageKey = 'ui_theme', initialTheme = 'default' }) => {
  const [theme, setThemeState] = useState<UiKitThemeName>(initialTheme);

  useEffect(() => {
    try {
      const saved = (localStorage.getItem(storageKey) as UiKitThemeName) || initialTheme;
      setThemeState(saved);
      applyThemeClass(saved);
    } catch {
      setThemeState(initialTheme);
      applyThemeClass(initialTheme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTheme = (t: UiKitThemeName) => {
    setThemeState(t);
    try {
      localStorage.setItem(storageKey, t);
    } catch {}
    applyThemeClass(t);
  };

  const value = useMemo(() => ({ theme, setTheme }), [theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
