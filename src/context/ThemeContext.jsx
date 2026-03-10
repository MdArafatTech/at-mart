import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('at-mart-theme');
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeColor, setActiveColor] = useState(() => {
    return localStorage.getItem('at-mart-color-theme') || 'theme-amber';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Toggle Dark Mode
    if (isDarkMode) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      localStorage.setItem('at-mart-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      localStorage.setItem('at-mart-theme', 'light');
    }

    // Toggle Color Themes
    const colorThemes = ['theme-amber', 'theme-blue', 'theme-rose', 'theme-emerald'];
    colorThemes.forEach(theme => root.classList.remove(theme));
    root.classList.add(activeColor);
    localStorage.setItem('at-mart-color-theme', activeColor);

  }, [isDarkMode, activeColor]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme, activeColor, setActiveColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default ThemeContext;